"use client";

import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type RelationType = "Yakın" | "İlişkili" | "Ayrı";
type Zone = "Kamusal" | "Yarı Kamusal" | "Özel" | "Servis" | "Dolaşım";

type SpaceNode = {
  id: string;
  name: string;
  area: number;
  zone: Zone;
  floor: string;
  x: number;
  y: number;
};

type Relation = {
  id: string;
  from: string;
  to: string;
  type: RelationType;
};

const zoneColors: Record<Zone, { fill: string; stroke: string }> = {
  Kamusal: { fill: "#cffafe", stroke: "#0891b2" },
  "Yarı Kamusal": { fill: "#dbeafe", stroke: "#2563eb" },
  Özel: { fill: "#ede9fe", stroke: "#7c3aed" },
  Servis: { fill: "#ffedd5", stroke: "#ea580c" },
  Dolaşım: { fill: "#dcfce7", stroke: "#16a34a" },
};

const relationStyles: Record<RelationType, { stroke: string; dash: string; width: number }> = {
  Yakın: { stroke: "#22d3ee", dash: "", width: 3 },
  İlişkili: { stroke: "#94a3b8", dash: "8 5", width: 2 },
  Ayrı: { stroke: "#fb7185", dash: "3 7", width: 2 },
};

const initialNodes: SpaceNode[] = [
  { id: "salon", name: "Salon", area: 45, zone: "Kamusal", floor: "Zemin", x: 35, y: 44 },
  { id: "mutfak", name: "Mutfak", area: 22, zone: "Servis", floor: "Zemin", x: 60, y: 34 },
  { id: "yemek", name: "Yemek", area: 20, zone: "Yarı Kamusal", floor: "Zemin", x: 54, y: 57 },
  { id: "yatak", name: "Yatak Odası", area: 28, zone: "Özel", floor: "1. Kat", x: 77, y: 68 },
  { id: "giris", name: "Giriş", area: 12, zone: "Dolaşım", floor: "Zemin", x: 17, y: 60 },
];

const initialRelations: Relation[] = [
  { id: "r1", from: "salon", to: "yemek", type: "Yakın" },
  { id: "r2", from: "mutfak", to: "yemek", type: "Yakın" },
  { id: "r3", from: "giris", to: "salon", type: "İlişkili" },
  { id: "r4", from: "salon", to: "yatak", type: "Ayrı" },
];

function nodeRadius(area: number) {
  return Math.max(5, Math.min(13, 3.6 + Math.sqrt(Math.max(area, 1)) * 0.72));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function autoArrange(nodes: SpaceNode[], relations: Relation[]) {
  if (nodes.length === 0) return nodes;
  const next = nodes.map((node, index) => ({
    ...node,
    x: 50 + Math.cos((index / nodes.length) * Math.PI * 2) * 30,
    y: 50 + Math.sin((index / nodes.length) * Math.PI * 2) * 30,
  }));

  for (let iteration = 0; iteration < 240; iteration += 1) {
    const forces = next.map(() => ({ x: 0, y: 0 }));

    for (let i = 0; i < next.length; i += 1) {
      for (let j = i + 1; j < next.length; j += 1) {
        const dx = next[j].x - next[i].x;
        const dy = next[j].y - next[i].y;
        const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const minimum = nodeRadius(next[i].area) + nodeRadius(next[j].area) + 3;
        const repulsion = distance < minimum ? (minimum - distance) * 0.035 : 5 / (distance * distance);
        forces[i].x -= (dx / distance) * repulsion;
        forces[i].y -= (dy / distance) * repulsion;
        forces[j].x += (dx / distance) * repulsion;
        forces[j].y += (dy / distance) * repulsion;
      }
    }

    relations.forEach((relation) => {
      const fromIndex = next.findIndex((node) => node.id === relation.from);
      const toIndex = next.findIndex((node) => node.id === relation.to);
      if (fromIndex < 0 || toIndex < 0) return;
      const from = next[fromIndex];
      const to = next[toIndex];
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const target = relation.type === "Yakın" ? 18 : relation.type === "İlişkili" ? 30 : 52;
      const strength = relation.type === "Ayrı" ? 0.018 : 0.025;
      const pull = (distance - target) * strength;
      forces[fromIndex].x += (dx / distance) * pull;
      forces[fromIndex].y += (dy / distance) * pull;
      forces[toIndex].x -= (dx / distance) * pull;
      forces[toIndex].y -= (dy / distance) * pull;
    });

    next.forEach((node, index) => {
      forces[index].x += (50 - node.x) * 0.0015;
      forces[index].y += (50 - node.y) * 0.0015;
      node.x = Math.max(8, Math.min(92, node.x + forces[index].x));
      node.y = Math.max(10, Math.min(90, node.y + forces[index].y));
    });
  }
  return next;
}

export default function BubbleDiagram() {
  const [nodes, setNodes] = useState<SpaceNode[]>(initialNodes);
  const [relations, setRelations] = useState<Relation[]>(initialRelations);
  const [selectedId, setSelectedId] = useState<string>(initialNodes[0].id);
  const [relationFrom, setRelationFrom] = useState(initialNodes[0].id);
  const [relationTo, setRelationTo] = useState(initialNodes[1].id);
  const [relationType, setRelationType] = useState<RelationType>("Yakın");
  const [floorFilter, setFloorFilter] = useState("Tümü");
  const [showAreas, setShowAreas] = useState(true);
  const [showRelations, setShowRelations] = useState(true);
  const [projectTitle, setProjectTitle] = useState("MİMARİ İLİŞKİ DİYAGRAMI");
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingId = useRef<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = window.localStorage.getItem("pafta-bubble-program");
      if (!raw) return;
      try {
        const imported = JSON.parse(raw) as { title?: string; spaces?: { name: string; area: number; group?: string }[]; relations?: [string, string, RelationType][] };
        if (!imported.spaces?.length) return;
        const created = imported.spaces.map((space, index): SpaceNode => ({
          id: makeId(`space-${index}`),
          name: space.name,
          area: space.area,
          zone: space.group === "Servis" ? "Servis" : space.group === "Dolaşım" ? "Dolaşım" : space.group === "Özel" || space.group === "Gece" ? "Özel" : index < 2 ? "Kamusal" : "Yarı Kamusal",
          floor: "Belirsiz",
          x: 50,
          y: 50,
        }));
        const createdRelations = (imported.relations ?? []).flatMap(([fromName, toName, type], index) => {
          const from = created.find((node) => node.name === fromName);
          const to = created.find((node) => node.name === toName);
          return from && to ? [{ id: makeId(`relation-${index}`), from: from.id, to: to.id, type }] : [];
        });
        const arranged = autoArrange(created, createdRelations);
        setNodes(arranged);
        setRelations(createdRelations);
        setSelectedId(arranged[0]?.id ?? "");
        setRelationFrom(arranged[0]?.id ?? "");
        setRelationTo(arranged[1]?.id ?? arranged[0]?.id ?? "");
        setProjectTitle(imported.title ? `${imported.title.toLocaleUpperCase("tr-TR")} İLİŞKİ DİYAGRAMI` : "MİMARİ İLİŞKİ DİYAGRAMI");
        window.localStorage.removeItem("pafta-bubble-program");
      } catch {
        window.localStorage.removeItem("pafta-bubble-program");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const floors = useMemo(() => ["Tümü", ...Array.from(new Set(nodes.map((node) => node.floor)))], [nodes]);
  const visibleNodes = useMemo(() => nodes.filter((node) => floorFilter === "Tümü" || node.floor === floorFilter), [floorFilter, nodes]);
  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const selectedNode = nodes.find((node) => node.id === selectedId);
  const totalArea = visibleNodes.reduce((sum, node) => sum + node.area, 0);

  function updateNode(id: string, patch: Partial<SpaceNode>) {
    setNodes((current) => current.map((node) => node.id === id ? { ...node, ...patch } : node));
  }
  function addNode() {
    const node: SpaceNode = { id: makeId("space"), name: "Yeni Mekân", area: 20, zone: "Yarı Kamusal", floor: "Zemin", x: 50, y: 50 };
    setNodes((current) => [...current, node]);
    setSelectedId(node.id);
    if (!relationFrom) setRelationFrom(node.id);
    if (!relationTo) setRelationTo(node.id);
  }
  function deleteNode(id: string) {
    setNodes((current) => current.filter((node) => node.id !== id));
    setRelations((current) => current.filter((relation) => relation.from !== id && relation.to !== id));
    setSelectedId("");
  }
  function addRelation() {
    if (!relationFrom || !relationTo || relationFrom === relationTo) return;
    setRelations((current) => [
      ...current.filter((relation) => !((relation.from === relationFrom && relation.to === relationTo) || (relation.from === relationTo && relation.to === relationFrom))),
      { id: makeId("relation"), from: relationFrom, to: relationTo, type: relationType },
    ]);
  }
  function arrange() {
    setNodes((current) => autoArrange(current, relations));
  }
  function pointerPosition(event: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return { x: 50, y: 50 };
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM()?.inverse();
    const transformed = matrix ? point.matrixTransform(matrix) : point;
    return { x: Math.max(4, Math.min(96, transformed.x)), y: Math.max(6, Math.min(94, transformed.y)) };
  }
  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!draggingId.current) return;
    const position = pointerPosition(event);
    updateNode(draggingId.current, position);
  }
  function serializeSvg() {
    if (!svgRef.current) return null;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "1600");
    clone.setAttribute("height", "1000");
    return new XMLSerializer().serializeToString(clone);
  }
  function downloadSvg() {
    const source = serializeSvg();
    if (!source) return;
    const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pafta-iliski-diyagrami.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  }
  function downloadPng() {
    const source = serializeSvg();
    if (!source) return;
    const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1000;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = "#f8fafc";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const anchor = document.createElement("a");
      anchor.href = canvas.toDataURL("image/png");
      anchor.download = "pafta-iliski-diyagrami.png";
      anchor.click();
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between"><h2 className="font-bold">Mekânlar</h2><button onClick={addNode} className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950">+ Mekân</button></div>
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {nodes.map((node) => <button key={node.id} onClick={() => setSelectedId(node.id)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm ${selectedId === node.id ? "border-cyan-400 bg-cyan-400/10" : "border-slate-800 bg-slate-950"}`}><span className="truncate">{node.name}</span><span className="ml-3 font-mono text-xs text-slate-500">{node.area} m²</span></button>)}
        </div>

        {selectedNode && <div className="space-y-3 border-t border-slate-800 pt-5">
          <label className="block text-xs text-slate-400">Mekân adı<input value={selectedNode.name} onChange={(event) => updateNode(selectedNode.id, { name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-sm text-white" /></label>
          <div className="grid grid-cols-2 gap-2"><label className="text-xs text-slate-400">Alan (m²)<input type="number" min="1" value={selectedNode.area} onChange={(event) => updateNode(selectedNode.id, { area: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-sm text-white" /></label><label className="text-xs text-slate-400">Kat<input value={selectedNode.floor} onChange={(event) => updateNode(selectedNode.id, { floor: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-sm text-white" /></label></div>
          <label className="block text-xs text-slate-400">Zon<select value={selectedNode.zone} onChange={(event) => updateNode(selectedNode.id, { zone: event.target.value as Zone })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-sm text-white">{Object.keys(zoneColors).map((zone) => <option key={zone}>{zone}</option>)}</select></label>
          <button onClick={() => deleteNode(selectedNode.id)} className="text-xs font-semibold text-rose-300">Mekânı sil</button>
        </div>}

        <div className="border-t border-slate-800 pt-5">
          <h2 className="font-bold">İlişki ekle</h2>
          <div className="mt-3 grid gap-2"><select value={relationFrom} onChange={(event) => setRelationFrom(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-sm">{nodes.map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}</select><select value={relationTo} onChange={(event) => setRelationTo(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-sm">{nodes.map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}</select><div className="grid grid-cols-[1fr_auto] gap-2"><select value={relationType} onChange={(event) => setRelationType(event.target.value as RelationType)} className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-sm"><option>Yakın</option><option>İlişkili</option><option>Ayrı</option></select><button onClick={addRelation} className="rounded-lg border border-cyan-400/50 px-4 text-sm text-cyan-300">Ekle</button></div></div>
          <div className="mt-3 max-h-36 space-y-2 overflow-y-auto">{relations.map((relation) => { const from = nodes.find((node) => node.id === relation.from); const to = nodes.find((node) => node.id === relation.to); return <div key={relation.id} className="flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs"><span className="min-w-0 flex-1 truncate">{from?.name} — {to?.name}</span><span style={{ color: relationStyles[relation.type].stroke }}>{relation.type}</span><button onClick={() => setRelations((current) => current.filter((item) => item.id !== relation.id))} className="text-rose-300">×</button></div>; })}</div>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} className="min-w-56 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-bold text-white" />
          <select value={floorFilter} onChange={(event) => setFloorFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm">{floors.map((floor) => <option key={floor}>{floor}</option>)}</select>
          <button onClick={arrange} className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950">Otomatik yerleştir</button>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-100 shadow-2xl">
          <svg ref={svgRef} viewBox="0 0 100 100" role="img" aria-label="Mimari ilişki diyagramı" onPointerMove={handlePointerMove} onPointerUp={() => { draggingId.current = null; }} onPointerLeave={() => { draggingId.current = null; }} className="aspect-[16/10] w-full touch-none select-none">
            <rect width="100" height="100" fill="#f8fafc" />
            <text x="4" y="6" fontSize="2.5" fontWeight="800" fill="#0f172a">{projectTitle}</text>
            <text x="96" y="6" textAnchor="end" fontSize="1.45" fill="#64748b">{floorFilter === "Tümü" ? "TÜM KATLAR" : floorFilter.toLocaleUpperCase("tr-TR")} · {totalArea} m²</text>
            {showRelations && relations.filter((relation) => visibleIds.has(relation.from) && visibleIds.has(relation.to)).map((relation) => {
              const from = nodes.find((node) => node.id === relation.from);
              const to = nodes.find((node) => node.id === relation.to);
              if (!from || !to) return null;
              const style = relationStyles[relation.type];
              return <g key={relation.id}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={style.stroke} strokeWidth={style.width / 10} strokeDasharray={style.dash} opacity="0.8" /><text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 1} textAnchor="middle" fontSize="1.2" fill={style.stroke}>{relation.type}</text></g>;
            })}
            {visibleNodes.map((node) => {
              const radius = nodeRadius(node.area);
              const color = zoneColors[node.zone];
              return <g key={node.id} transform={`translate(${node.x} ${node.y})`} onPointerDown={(event) => { draggingId.current = node.id; setSelectedId(node.id); event.currentTarget.setPointerCapture(event.pointerId); }} className="cursor-grab active:cursor-grabbing"><circle r={radius} fill={color.fill} stroke={selectedId === node.id ? "#0f172a" : color.stroke} strokeWidth={selectedId === node.id ? 0.7 : 0.35} /><text textAnchor="middle" y={showAreas ? -0.6 : 0.5} fontSize={Math.max(1.45, Math.min(2.2, radius / 4.2))} fontWeight="700" fill="#0f172a">{node.name.length > 18 ? `${node.name.slice(0, 17)}…` : node.name}</text>{showAreas && <text textAnchor="middle" y="2.1" fontSize="1.45" fill="#475569">{node.area} m²</text>}<text textAnchor="middle" y={radius - 1.4} fontSize="1.05" fill={color.stroke}>{node.zone}</text></g>;
            })}
            <g transform="translate(4 94)">{(Object.keys(zoneColors) as Zone[]).map((zone, index) => <g key={zone} transform={`translate(${index * 18} 0)`}><circle r="1.2" fill={zoneColors[zone].fill} stroke={zoneColors[zone].stroke} strokeWidth=".25" /><text x="2" y=".55" fontSize="1.15" fill="#475569">{zone}</text></g>)}</g>
          </svg>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={showAreas} onChange={(event) => setShowAreas(event.target.checked)} className="accent-cyan-400" /> Alanları göster</label>
          <label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={showRelations} onChange={(event) => setShowRelations(event.target.checked)} className="accent-cyan-400" /> İlişkileri göster</label>
          <span className="flex-1" />
          <button onClick={downloadSvg} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm hover:border-cyan-400">SVG indir</button>
          <button onClick={downloadPng} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm hover:border-cyan-400">PNG indir</button>
          <button onClick={() => window.print()} className="rounded-xl border border-cyan-400/50 px-4 py-2.5 text-sm font-semibold text-cyan-300">PDF / Yazdır</button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">Balonları sürükleyerek düzenleyebilirsin. Otomatik yerleşim; yakın ilişkileri çekmeye, ayrı ilişkileri uzaklaştırmaya ve çakışmaları azaltmaya çalışır.</p>
      </section>
    </div>
  );
}
