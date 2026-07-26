"use client";

import { useMemo, useState } from "react";
import { cities } from "./cities";

type SolarPoint = {
  hour: number;
  altitude: number;
  azimuth: number;
  facadeIncidence: number;
  visible: boolean;
  shaded: boolean;
};

const uses = {
  Konut: { start: 7, end: 22, note: "Yaşam alanlarında kış kazancı ile yaz konforunu dengele." },
  Ofis: { start: 8, end: 18, note: "Çalışma saatlerinde kamaşma ve ekran yansımasını sınırla." },
  Eğitim: { start: 8, end: 17, note: "Düzgün gün ışığını, düşük kamaşma ve kontrollü kazançla birlikte kur." },
  Atölye: { start: 8, end: 19, note: "Kararlı ve dağınık ışık için kuzey ışığı veya filtrelenmiş açıklık kullan." },
  Konaklama: { start: 6, end: 24, note: "Sabah/akşam kullanımını ve mahremiyeti cephe kararıyla birlikte değerlendir." },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function dayOfYear(date: string) {
  const current = new Date(`${date}T12:00:00`);
  const first = new Date(current.getFullYear(), 0, 0);
  return Math.floor((current.getTime() - first.getTime()) / 86400000);
}

// NOAA/GML yaklaşımındaki denklem-zamanı ve güneş sapması bağıntılarının tarayıcı uyarlaması.
function solarPosition(latitude: number, longitude: number, date: string, localHour: number): SolarPoint {
  const day = dayOfYear(date);
  const gamma = (2 * Math.PI / 365) * (day - 1 + (localHour - 12) / 24);
  const equationOfTime = 229.18 * (
    0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma)
  );
  const declination =
    0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const trueSolarMinutes = (localHour * 60 + equationOfTime + 4 * longitude - 60 * 3 + 1440) % 1440;
  const hourAngle = (trueSolarMinutes / 4 - 180) * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  const cosZenith = clamp(
    Math.sin(lat) * Math.sin(declination) + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle),
    -1,
    1
  );
  const altitude = 90 - Math.acos(cosZenith) * 180 / Math.PI;
  const azimuthRadians = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(lat) - Math.tan(declination) * Math.cos(lat)
  );
  const azimuth = (azimuthRadians * 180 / Math.PI + 180 + 360) % 360;
  return { hour: localHour, altitude, azimuth, facadeIncidence: 0, visible: altitude > 0, shaded: false };
}

function angleDifference(a: number, b: number) {
  return Math.abs(((a - b + 540) % 360) - 180);
}

function timeLabel(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function SunOrientationAssistant() {
  const [cityName, setCityName] = useState("İstanbul");
  const selectedCity = cities.find((city) => city.name === cityName) ?? cities[39];
  const [customLocation, setCustomLocation] = useState(false);
  const [latitude, setLatitude] = useState(selectedCity.latitude);
  const [longitude, setLongitude] = useState(selectedCity.longitude);
  const [date, setDate] = useState("2026-06-21");
  const [hour, setHour] = useState(14);
  const [facade, setFacade] = useState(180);
  const [use, setUse] = useState<keyof typeof uses>("Konut");
  const [windowWidth, setWindowWidth] = useState(240);
  const [windowHeight, setWindowHeight] = useState(210);
  const [overhang, setOverhang] = useState(80);
  const [overhangOffset, setOverhangOffset] = useState(20);
  const [leftFin, setLeftFin] = useState(0);
  const [rightFin, setRightFin] = useState(0);
  const [obstruction, setObstruction] = useState(0);
  const [shgc, setShgc] = useState(0.4);

  const model = useMemo(() => {
    const enrich = (point: SolarPoint) => {
      const diff = angleDifference(point.azimuth, facade);
      const front = diff < 90 && point.altitude > obstruction;
      const horizontalProfile = Math.atan(
        Math.tan(Math.max(0.1, point.altitude) * Math.PI / 180) /
        Math.max(0.05, Math.cos(diff * Math.PI / 180))
      ) * 180 / Math.PI;
      const verticalProfile = Math.atan(
        Math.tan(diff * Math.PI / 180) /
        Math.max(0.05, Math.cos(point.altitude * Math.PI / 180))
      ) * 180 / Math.PI;
      const overhangShadow = Math.max(0, overhang * Math.tan(horizontalProfile * Math.PI / 180) - overhangOffset);
      const finDepth = verticalProfile < 0 ? leftFin : rightFin;
      const finShadow = Math.max(0, finDepth * Math.tan(Math.abs(verticalProfile) * Math.PI / 180));
      const shaded = overhangShadow >= windowHeight || finShadow >= windowWidth;
      const incidence = front
        ? Math.max(0, Math.cos(point.altitude * Math.PI / 180) * Math.cos(diff * Math.PI / 180))
        : 0;
      return { ...point, visible: front, shaded, facadeIncidence: incidence };
    };
    const current = enrich(solarPosition(latitude, longitude, date, hour));
    const hourly = Array.from({ length: 31 }, (_, index) => 5 + index * .5).map((item) =>
      enrich(solarPosition(latitude, longitude, date, item))
    );
    const seasonDates = [
      ["21 Aralık", "2026-12-21"], ["21 Mart", "2026-03-21"],
      ["21 Haziran", "2026-06-21"], ["23 Eylül", "2026-09-23"],
    ] as const;
    const seasons = seasonDates.map(([label, seasonDate]) => {
      const points = Array.from({ length: 25 }, (_, index) => 6 + index * .5)
        .map((item) => enrich(solarPosition(latitude, longitude, seasonDate, item)));
      const exposed = points.filter((point) => point.visible);
      const unshaded = exposed.filter((point) => !point.shaded);
      return {
        label,
        hours: exposed.length * .5,
        unshadedHours: unshaded.length * .5,
        peakAltitude: Math.max(0, ...points.map((point) => point.altitude)),
      };
    });
    const active = hourly.filter((point) => point.hour >= uses[use].start && point.hour <= uses[use].end);
    const exposed = active.filter((point) => point.visible);
    const unshaded = exposed.filter((point) => !point.shaded);
    const exposureHours = exposed.length * .5;
    const protectedPercent = exposed.length ? Math.round((1 - unshaded.length / exposed.length) * 100) : 100;
    const solarGainIndex = Math.round(
      unshaded.reduce((sum, point) => sum + point.facadeIncidence * shgc, 0) * 10
    );
    return { current, hourly, seasons, exposureHours, protectedPercent, solarGainIndex };
  }, [date, facade, hour, latitude, leftFin, longitude, obstruction, overhang, overhangOffset, rightFin, shgc, use, windowHeight, windowWidth]);

  const recommendations = useMemo(() => {
    const items: string[] = [];
    const west = facade >= 225 && facade <= 315;
    const south = facade >= 135 && facade <= 225;
    const north = facade <= 45 || facade >= 315;
    if (west) items.push("Batı ağırlıklı cephede düşük açılı öğleden sonra güneşi için dıştan düşey kırıcı veya hareketli gölgeleme öncelikli.");
    if (south) items.push("Güney ağırlıklı cephede yatay saçak etkilidir; 21 Haziran ve 21 Aralık sonuçlarını birlikte karşılaştır.");
    if (north) items.push("Kuzey ağırlıklı cephede doğrudan kazanç azdır; açıklık oranını ısı kaybı, gün ışığı ve manzarayla dengele.");
    if (model.protectedPercent < 60) items.push(`Mevcut gölgeleme, cepheye gelen güneşli kullanım süresinin yalnızca yaklaşık %${model.protectedPercent} bölümünü tam kesiyor.`);
    if (obstruction > 20) items.push("Yüksek çevre engeli gökyüzü görüşünü ve gün ışığını da azaltabilir; yalnız güneş kesilmesi olarak değerlendirme.");
    if (shgc > .5) items.push("Cam g-değeri/SHGC yüksek; yaz kazancı için daha seçici cam veya dış gölgeleme değerlendir.");
    items.push(uses[use].note);
    return items;
  }, [facade, model.protectedPercent, obstruction, shgc, use]);

  function selectCity(name: string) {
    const city = cities.find((item) => item.name === name);
    if (!city) return;
    setCityName(name);
    setLatitude(city.latitude);
    setLongitude(city.longitude);
  }

  const sunX = 360 + Math.sin(model.current.azimuth * Math.PI / 180) * (150 - clamp(model.current.altitude, 0, 90));
  const sunY = 190 - Math.cos(model.current.azimuth * Math.PI / 180) * (150 - clamp(model.current.altitude, 0, 90));

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-[1500px]">
        <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-cyan-400">PAFTA / İklim ve Cephe</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-black sm:text-6xl">Güneş, Yönlenme ve Cephe Karar Asistanı</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-400">Güneş konumunu, kullanım saatini, cephe normalini, çevre engelini ve gölgeleme geometrisini tek senaryoda sınayarak tasarım alternatiflerini karşılaştır.</p>

        <div className="mt-9 grid gap-6 xl:grid-cols-[410px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-bold">01 · Konum ve zaman</h2>
              <label className="mt-4 block text-xs text-slate-400">İl merkezi<select value={cityName} disabled={customLocation} onChange={(e) => selectCity(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white disabled:opacity-50">{cities.map((city) => <option key={city.name}>{city.name}</option>)}</select></label>
              <label className="mt-3 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={customLocation} onChange={(e) => setCustomLocation(e.target.checked)} className="accent-cyan-400" /> Özel koordinat kullan</label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="text-xs text-slate-400">Enlem<input type="number" step=".01" disabled={!customLocation} value={latitude} onChange={(e) => setLatitude(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white disabled:opacity-50" /></label>
                <label className="text-xs text-slate-400">Boylam<input type="number" step=".01" disabled={!customLocation} value={longitude} onChange={(e) => setLongitude(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white disabled:opacity-50" /></label>
                <label className="text-xs text-slate-400">Tarih<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>
                <label className="text-xs text-slate-400">Saat: {timeLabel(hour)}<input type="range" min="5" max="21" step=".25" value={hour} onChange={(e) => setHour(Number(e.target.value))} className="mt-4 w-full accent-cyan-400" /></label>
              </div>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-bold">02 · Cephe ve kullanım</h2>
              <label className="mt-4 block text-xs text-slate-400">Cephe azimutu: {facade}° · {facade === 0 ? "Kuzey" : facade === 90 ? "Doğu" : facade === 180 ? "Güney" : facade === 270 ? "Batı" : "Ara yön"}<input type="range" min="0" max="359" value={facade} onChange={(e) => setFacade(Number(e.target.value))} className="mt-3 w-full accent-cyan-400" /></label>
              <div className="mt-2 flex justify-between">{[0, 90, 180, 270].map((angle) => <button key={angle} onClick={() => setFacade(angle)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">{angle === 0 ? "K" : angle === 90 ? "D" : angle === 180 ? "G" : "B"}</button>)}</div>
              <label className="mt-4 block text-xs text-slate-400">Kullanım<select value={use} onChange={(e) => setUse(e.target.value as keyof typeof uses)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white">{Object.keys(uses).map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="mt-4 block text-xs text-slate-400">Çevre/yapı engel açısı: {obstruction}°<input type="range" min="0" max="60" value={obstruction} onChange={(e) => setObstruction(Number(e.target.value))} className="mt-3 w-full accent-cyan-400" /></label>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-bold">03 · Açıklık ve gölgeleme</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Pencere eni (cm)", windowWidth, setWindowWidth],
                  ["Pencere yüksekliği", windowHeight, setWindowHeight],
                  ["Saçak derinliği", overhang, setOverhang],
                  ["Saçak üst boşluğu", overhangOffset, setOverhangOffset],
                  ["Sol düşey kırıcı", leftFin, setLeftFin],
                  ["Sağ düşey kırıcı", rightFin, setRightFin],
                ].map(([label, value, setter]) => <label key={label as string} className="text-xs text-slate-400">{label as string}<input type="number" min="0" value={value as number} onChange={(e) => (setter as (value: number) => void)(Math.max(0, Number(e.target.value)))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>)}
              </div>
              <label className="mt-4 block text-xs text-slate-400">Cam güneş ısı kazanç katsayısı (SHGC / g): {shgc.toFixed(2)}<input type="range" min=".2" max=".8" step=".05" value={shgc} onChange={(e) => setShgc(Number(e.target.value))} className="mt-3 w-full accent-cyan-400" /></label>
            </section>
          </aside>

          <section className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["Yükseklik", `${model.current.altitude.toFixed(1)}°`],
                ["Azimut", `${model.current.azimuth.toFixed(1)}°`],
                ["Cephe güneşi", `${model.exposureHours.toFixed(1)} saat`],
                ["Tam gölgelenme", `%${model.protectedPercent}`],
                ["Kazanç indeksi", String(model.solarGainIndex)],
              ].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-cyan-300">{value}</p></div>)}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between"><h2 className="font-bold">Gökyüzü ve cephe planı</h2><span className={`rounded-full px-3 py-1 text-xs ${model.current.visible ? "bg-amber-400/15 text-amber-200" : "bg-slate-800 text-slate-400"}`}>{model.current.visible ? model.current.shaded ? "Cephede · gölgeli" : "Cephede · doğrudan" : "Cepheyi görmüyor"}</span></div>
                <svg viewBox="0 0 720 390" className="mt-4 w-full rounded-2xl bg-slate-100">
                  <ellipse cx="360" cy="190" rx="190" ry="145" fill="#e0f2fe" stroke="#334155" strokeWidth="2" />
                  {[45, 90, 135].map((radius) => <ellipse key={radius} cx="360" cy="190" rx={radius * 1.27} ry={radius} fill="none" stroke="#94a3b8" strokeDasharray="4 5" />)}
                  <line x1="360" y1="35" x2="360" y2="345" stroke="#94a3b8" /><line x1="155" y1="190" x2="565" y2="190" stroke="#94a3b8" />
                  <text x="360" y="25" textAnchor="middle" fill="#0f172a" fontWeight="800">K</text><text x="360" y="370" textAnchor="middle" fill="#0f172a" fontWeight="800">G</text><text x="590" y="195" fill="#0f172a" fontWeight="800">D</text><text x="125" y="195" fill="#0f172a" fontWeight="800">B</text>
                  <line x1="360" y1="190" x2={360 + Math.sin(facade * Math.PI / 180) * 170} y2={190 - Math.cos(facade * Math.PI / 180) * 130} stroke="#0891b2" strokeWidth="12" strokeLinecap="round" />
                  {model.hourly.filter((point) => point.altitude > 0).map((point) => {
                    const radius = 150 - clamp(point.altitude, 0, 90);
                    return <circle key={point.hour} cx={360 + Math.sin(point.azimuth * Math.PI / 180) * radius} cy={190 - Math.cos(point.azimuth * Math.PI / 180) * radius} r="3" fill="#f59e0b" />;
                  })}
                  <circle cx={sunX} cy={sunY} r="11" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
                </svg>
              </section>

              <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="font-bold">Cephe kesiti ve gölge</h2>
                <svg viewBox="0 0 720 390" className="mt-4 w-full rounded-2xl bg-slate-100">
                  <rect x="455" y="45" width="30" height="300" fill="#475569" /><rect x="455" y="105" width="30" height="190" fill="#38bdf8" />
                  <rect x={455 - overhang * .55} y={Math.max(42, 105 - overhangOffset * .35)} width={30 + overhang * .55} height="14" fill="#0f172a" />
                  <line x1="80" y1={315 - clamp(model.current.altitude, 0, 90) * 2.5} x2="455" y2="105" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10 7" />
                  <circle cx="80" cy={315 - clamp(model.current.altitude, 0, 90) * 2.5} r="18" fill="#f59e0b" />
                  <path d={`M455 105 L455 ${Math.min(295, 105 + overhang * Math.tan(Math.max(0, model.current.altitude) * Math.PI / 180))}`} stroke="#0f172a" strokeWidth="8" opacity=".28" />
                  <line x1="455" y1="330" x2="670" y2="330" stroke="#64748b" strokeWidth="3" />
                  <text x="525" y="370" fill="#0f172a" fontWeight="700">Pencere {windowWidth} × {windowHeight} cm</text>
                  <text x="80" y="355" textAnchor="middle" fill="#92400e" fontWeight="800">{model.current.altitude.toFixed(1)}°</text>
                  <text x="500" y="75" fill="#0f172a" fontSize="12">Saçak {overhang} cm</text>
                </svg>
              </section>
            </div>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex flex-col justify-between gap-2 sm:flex-row"><h2 className="font-bold">Seçilen gün · saatlik cephe etkisi</h2><p className="text-xs text-slate-500">Turuncu: doğrudan · mavi: gölgelenmiş · koyu: cephe arkasında</p></div>
              <div className="mt-5 flex h-44 items-end gap-1 overflow-x-auto">
                {model.hourly.map((point) => <div key={point.hour} className="flex min-w-5 flex-1 flex-col items-center justify-end gap-2">
                  <div title={`${timeLabel(point.hour)} · ${point.altitude.toFixed(1)}°`} className={`w-full rounded-t ${!point.visible ? "bg-slate-800" : point.shaded ? "bg-cyan-500" : "bg-amber-400"}`} style={{ height: `${Math.max(5, point.visible ? point.facadeIncidence * 120 : 5)}px` }} />
                  {Number.isInteger(point.hour) && <span className="text-[9px] text-slate-500">{point.hour}</span>}
                </div>)}
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
              <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">Mevsim karşılaştırması</h2><div className="mt-4 space-y-3">{model.seasons.map((season) => <div key={season.label} className="rounded-xl bg-slate-950 p-4"><div className="flex justify-between"><strong>{season.label}</strong><span className="text-cyan-300">{season.hours.toFixed(1)} sa.</span></div><p className="mt-2 text-xs text-slate-500">Gölgelenmemiş {season.unshadedHours.toFixed(1)} sa. · Tepe {season.peakAltitude.toFixed(1)}°</p></div>)}</div></section>
              <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6"><h2 className="text-xl font-bold text-cyan-200">Cephe karar raporu</h2><ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">{recommendations.map((item) => <li key={item}>• {item}</li>)}</ul></section>
            </div>
            <p className="text-xs leading-5 text-slate-600">Güneş konumu NOAA/GML bağıntılarının yaklaşık tarayıcı uygulamasıyla hesaplanır. Türkiye için UTC+3 kabul edilmiştir. Sonuçlar erken tasarım karşılaştırması içindir; iklim dosyası tabanlı gün ışığı/enerji simülasyonu, çevre modellemesi ve ürün doğrulamasının yerine geçmez.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
