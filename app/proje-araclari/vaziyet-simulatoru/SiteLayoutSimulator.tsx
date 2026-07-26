"use client";

import { PointerEvent, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };
type Mass = { id: number; name: string; x: number; y: number; width: number; depth: number; rotation: number; floors: number };
type Mode = "edit" | "draw" | "mass";

const SCALE = 10;
const ORIGIN = { x: 55, y: 45 };

function polygonArea(points: Point[]) {
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0) / 2);
}

function centroid(points: Point[]) {
  if (!points.length) return { x: 0, y: 0 };
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function pointInPolygon(point: Point, polygon: Point[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (((a.y > point.y) !== (b.y > point.y)) &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / ((b.y - a.y) || .0001) + a.x) inside = !inside;
  }
  return inside;
}

function pointSegmentDistance(point: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return Math.hypot(point.x - a.x, point.y - a.y);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared));
  return Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy));
}

function massCorners(mass: Mass) {
  const angle = mass.rotation * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    [-mass.width / 2, -mass.depth / 2], [mass.width / 2, -mass.depth / 2],
    [mass.width / 2, mass.depth / 2], [-mass.width / 2, mass.depth / 2],
  ].map(([x, y]) => ({ x: mass.x + x * cos - y * sin, y: mass.y + x * sin + y * cos }));
}

function number(value: number) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(value);
}

export default function SiteLayoutSimulator() {
  const [points, setPoints] = useState<Point[]>([
    { x: 6, y: 5 }, { x: 54, y: 5 }, { x: 66, y: 26 }, { x: 48, y: 51 }, { x: 9, y: 43 },
  ]);
  const [closed, setClosed] = useState(true);
  const [mode, setMode] = useState<Mode>("edit");
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null);
  const [roadEdge, setRoadEdge] = useState(0);
  const [frontSetback, setFrontSetback] = useState(5);
  const [otherSetback, setOtherSetback] = useState(3);
  const [north, setNorth] = useState(0);
  const [masses, setMasses] = useState<Mass[]>([
    { id: 1, name: "A Blok", x: 27, y: 23, width: 18, depth: 12, rotation: 0, floors: 4 },
  ]);
  const [selectedMassId, setSelectedMassId] = useState(1);
  const [drag, setDrag] = useState<{ type: "vertex" | "mass"; id: number } | null>(null);
  const [nextMassId, setNextMassId] = useState(2);
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedMass = masses.find((mass) => mass.id === selectedMassId);

  function clientPoint(event: PointerEvent<SVGElement>): Point {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(svg.getScreenCTM()?.inverse());
    return {
      x: Math.max(0, Math.min(78, (local.x - ORIGIN.x) / SCALE)),
      y: Math.max(0, Math.min(52, (local.y - ORIGIN.y) / SCALE)),
    };
  }

  const analysis = useMemo(() => {
    const area = closed && points.length >= 3 ? polygonArea(points) : 0;
    const center = centroid(points);
    const insetPoints = points.map((point) => {
      const distance = Math.hypot(point.x - center.x, point.y - center.y) || 1;
      const inset = otherSetback;
      return {
        x: point.x + ((center.x - point.x) / distance) * inset,
        y: point.y + ((center.y - point.y) / distance) * inset,
      };
    });
    const massResults = masses.map((mass) => {
      const corners = massCorners(mass);
      const outside = corners.some((corner) => !pointInPolygon(corner, points));
      const setbackViolation = corners.some((corner) =>
        points.some((point, edgeIndex) => {
          const next = points[(edgeIndex + 1) % points.length];
          const required = edgeIndex === roadEdge ? frontSetback : otherSetback;
          return pointSegmentDistance(corner, point, next) < required;
        })
      );
      return { mass, corners, valid: closed && !outside && !setbackViolation, outside, setbackViolation };
    });
    const footprint = masses.reduce((sum, mass) => sum + mass.width * mass.depth, 0);
    const totalFloor = masses.reduce((sum, mass) => sum + mass.width * mass.depth * mass.floors, 0);
    return { area, center, insetPoints, massResults, footprint, totalFloor, occupancy: area ? footprint / area : 0 };
  }, [closed, frontSetback, masses, otherSetback, points, roadEdge]);

  function handleCanvasDown(event: PointerEvent<SVGSVGElement>) {
    if (event.target !== event.currentTarget && (event.target as Element).getAttribute("data-canvas") !== "true") return;
    if (mode === "draw") {
      const point = clientPoint(event);
      setPoints((current) => [...current, point]);
      setSelectedVertex(points.length);
    }
  }

  function handleMove(event: PointerEvent<SVGSVGElement>) {
    if (!drag) return;
    const point = clientPoint(event);
    if (drag.type === "vertex") {
      setPoints((current) => current.map((item, index) => index === drag.id ? point : item));
    } else {
      setMasses((current) => current.map((mass) => mass.id === drag.id ? { ...mass, x: point.x, y: point.y } : mass));
    }
  }

  function startNewParcel() {
    setPoints([]);
    setClosed(false);
    setMode("draw");
    setSelectedVertex(null);
  }

  function addMass() {
    const id = nextMassId;
    const center = analysis.center;
    setMasses((current) => [...current, { id, name: `${String.fromCharCode(64 + id)} Blok`, x: center.x, y: center.y, width: 14, depth: 10, rotation: 0, floors: 3 }]);
    setSelectedMassId(id);
    setNextMassId(id + 1);
    setMode("mass");
  }

  function updateMass(key: keyof Mass, value: string | number) {
    setMasses((current) => current.map((mass) => mass.id === selectedMassId ? { ...mass, [key]: value } : mass));
  }

  const polygonPath = points.map((point) => `${ORIGIN.x + point.x * SCALE},${ORIGIN.y + point.y * SCALE}`).join(" ");
  const insetPath = analysis.insetPoints.map((point) => `${ORIGIN.x + point.x * SCALE},${ORIGIN.y + point.y * SCALE}`).join(" ");

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-[1500px]">
        <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-cyan-400">PAFTA / Arazi ve Yerleşim</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-black sm:text-6xl">Vaziyet Yerleşimi ve Yapı Oturumu Simülatörü</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-400">Nokta ekleyerek parselini çiz, köşeleri düzelt, yol cephesini tanımla ve birden fazla yapı kütlesini sürükleyerek yerleşim seçeneklerini karşılaştır.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          <button onClick={startNewParcel} className="rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950">Yeni parsel çiz</button>
          <button onClick={() => setMode("edit")} className={`rounded-xl px-4 py-3 font-semibold ${mode === "edit" ? "bg-white text-slate-950" : "border border-slate-700"}`}>Köşeleri düzenle</button>
          <button disabled={points.length < 3} onClick={() => { setClosed(true); setMode("edit"); }} className="rounded-xl border border-slate-700 px-4 py-3 font-semibold disabled:opacity-30">Parseli kapat</button>
          <button onClick={addMass} disabled={!closed} className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 font-semibold text-cyan-200 disabled:opacity-30">+ Yapı kütlesi</button>
          {selectedVertex !== null && <button onClick={() => { setPoints((current) => current.filter((_, index) => index !== selectedVertex)); setSelectedVertex(null); }} className="rounded-xl border border-rose-400/30 px-4 py-3 text-rose-300">Seçili köşeyi sil</button>}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">
          <section className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 p-4">
            <svg ref={svgRef} viewBox="0 0 900 620" className="min-w-[820px] touch-none rounded-2xl bg-[#ece8dc]" onPointerDown={handleCanvasDown} onPointerMove={handleMove} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}>
              <defs><pattern id="site-grid-v8" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#94a3b8" strokeWidth=".7" opacity=".55" /></pattern></defs>
              <rect data-canvas="true" x="0" y="0" width="900" height="620" fill="url(#site-grid-v8)" />
              {points.length > 1 && <polyline points={polygonPath} fill={closed ? "#dcfce7" : "none"} stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />}
              {closed && analysis.insetPoints.length > 2 && <polygon points={insetPath} fill="#22c55e12" stroke="#16a34a" strokeWidth="2" strokeDasharray="8 6" />}
              {closed && points.map((point, index) => {
                const next = points[(index + 1) % points.length];
                const mid = { x: (point.x + next.x) / 2, y: (point.y + next.y) / 2 };
                return <g key={`edge-${index}`} onClick={() => setRoadEdge(index)} className="cursor-pointer">
                  <line x1={ORIGIN.x + point.x * SCALE} y1={ORIGIN.y + point.y * SCALE} x2={ORIGIN.x + next.x * SCALE} y2={ORIGIN.y + next.y * SCALE} stroke={roadEdge === index ? "#e11d48" : "transparent"} strokeWidth="9" />
                  <rect x={ORIGIN.x + mid.x * SCALE - 28} y={ORIGIN.y + mid.y * SCALE - 11} width="56" height="22" rx="8" fill={roadEdge === index ? "#e11d48" : "#334155"} />
                  <text x={ORIGIN.x + mid.x * SCALE} y={ORIGIN.y + mid.y * SCALE + 4} textAnchor="middle" fill="white" fontSize="10">{number(Math.hypot(next.x - point.x, next.y - point.y))} m</text>
                </g>;
              })}
              {points.map((point, index) => <g key={`vertex-${index}`} onPointerDown={(event) => { event.stopPropagation(); if (mode !== "draw") { setSelectedVertex(index); setDrag({ type: "vertex", id: index }); } }}>
                <circle cx={ORIGIN.x + point.x * SCALE} cy={ORIGIN.y + point.y * SCALE} r={selectedVertex === index ? 10 : 7} fill={selectedVertex === index ? "#06b6d4" : "#0f172a"} stroke="white" strokeWidth="2" className="cursor-move" />
                <text x={ORIGIN.x + point.x * SCALE + 10} y={ORIGIN.y + point.y * SCALE - 10} fill="#0f172a" fontSize="10" fontWeight="700">P{index + 1}</text>
              </g>)}
              {analysis.massResults.map(({ mass, valid }) => <g key={mass.id} transform={`translate(${ORIGIN.x + mass.x * SCALE} ${ORIGIN.y + mass.y * SCALE}) rotate(${mass.rotation})`} onPointerDown={(event) => { event.stopPropagation(); setSelectedMassId(mass.id); setDrag({ type: "mass", id: mass.id }); setMode("mass"); }} className="cursor-move">
                <rect x={-mass.width * SCALE / 2} y={-mass.depth * SCALE / 2} width={mass.width * SCALE} height={mass.depth * SCALE} rx="5" fill={valid ? "#0891b2" : "#e11d48"} stroke={selectedMassId === mass.id ? "#f8fafc" : "#164e63"} strokeWidth={selectedMassId === mass.id ? 4 : 2} />
                <text y="-4" textAnchor="middle" fill="white" fontWeight="800">{mass.name}</text><text y="15" textAnchor="middle" fill="white" fontSize="11">{mass.width}×{mass.depth} m · {mass.floors} kat</text>
              </g>)}
              <g transform={`translate(830 90) rotate(${north})`}><path d="M0 45V-35M0-35L-10-15M0-35L10-15" stroke="#0f172a" strokeWidth="4" /><text y="-46" textAnchor="middle" fill="#0f172a" fontWeight="900">K</text></g>
              {mode === "draw" && <text x="450" y="595" textAnchor="middle" fill="#0f172a" fontWeight="700">Parsel köşelerini sırayla tıkla; en az 3 noktadan sonra “Parseli kapat”ı seç.</text>}
            </svg>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500"><span><b className="text-rose-400">Kırmızı kenar:</b> yol/ön cephe</span><span><b className="text-emerald-400">Kesikli çizgi:</b> şematik çekme zarfı</span><span><b className="text-rose-400">Kırmızı kütle:</b> sınır veya çekme ihlali</span></div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-bold">Parsel kararları</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="text-xs text-slate-400">Ön çekme (m)<input type="number" min="0" step=".5" value={frontSetback} onChange={(e) => setFrontSetback(Math.max(0, Number(e.target.value)))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>
                <label className="text-xs text-slate-400">Diğer sınırlar (m)<input type="number" min="0" step=".5" value={otherSetback} onChange={(e) => setOtherSetback(Math.max(0, Number(e.target.value)))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>
              </div>
              <label className="mt-4 block text-xs text-slate-400">Kuzey dönüşü: {north}°<input type="range" min="-180" max="180" value={north} onChange={(e) => setNorth(Number(e.target.value))} className="mt-3 w-full accent-cyan-400" /></label>
              <p className="mt-3 text-xs leading-5 text-slate-500">Yol cephesini değiştirmek için parsel kenarındaki ölçü etiketine tıkla.</p>
            </section>

            {selectedMass && <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-5">
              <div className="flex items-center justify-between"><h2 className="font-bold">Seçili yapı</h2><button onClick={() => { setMasses((current) => current.filter((mass) => mass.id !== selectedMass.id)); setSelectedMassId(0); }} className="text-xs text-rose-300">Sil</button></div>
              <label className="mt-4 block text-xs text-slate-400">Ad<input value={selectedMass.name} onChange={(e) => updateMass("name", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[["En (m)", "width"], ["Boy (m)", "depth"], ["Kat", "floors"], ["Dönüş °", "rotation"]].map(([label, key]) => <label key={key} className="text-xs text-slate-400">{label}<input type="number" step={key === "rotation" ? 1 : .5} value={selectedMass[key as keyof Mass] as number} onChange={(e) => updateMass(key as keyof Mass, Number(e.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>)}
              </div>
              <button onClick={() => { const id = nextMassId; setMasses((current) => [...current, { ...selectedMass, id, name: `${selectedMass.name} Kopya`, x: selectedMass.x + 3, y: selectedMass.y + 3 }]); setSelectedMassId(id); setNextMassId(id + 1); }} className="mt-4 w-full rounded-xl border border-slate-700 p-3 text-sm font-semibold">Kütleyi çoğalt</button>
            </section>}

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">Yerleşim özeti</h2><div className="mt-4 grid grid-cols-2 gap-3">
              {[["Parsel alanı", `${number(analysis.area)} m²`], ["Toplam oturum", `${number(analysis.footprint)} m²`], ["Oturum oranı", `%${number(analysis.occupancy * 100)}`], ["Yaklaşık kat alanı", `${number(analysis.totalFloor)} m²`]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-950 p-3"><p className="text-[11px] text-slate-500">{label}</p><p className="mt-1 font-bold text-cyan-300">{value}</p></div>)}
            </div><div className="mt-4 space-y-2">{analysis.massResults.map((result) => <button key={result.mass.id} onClick={() => setSelectedMassId(result.mass.id)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm ${result.valid ? "border-emerald-400/20 text-emerald-200" : "border-rose-400/30 text-rose-200"}`}><span>{result.mass.name}</span><strong>{result.valid ? "Uygun" : result.outside ? "Parsel dışında" : "Çekme ihlali"}</strong></button>)}</div></section>
          </aside>
        </div>
        <p className="mt-6 text-xs leading-5 text-slate-600">Kesikli iç zarf görsel bir ön izleme; uygunluk kontrolü her yapı köşesinin gerçek parsel kenarlarına uzaklığıyla yapılır. Araç basit çokgenler içindir; kesişen parsel kenarları çizme. İmar çapı, aplikasyon, plan notları, kot ve resmi proje kontrolünün yerine geçmez.</p>
      </div>
    </main>
  );
}
