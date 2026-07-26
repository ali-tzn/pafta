"use client";

import { useMemo, useState } from "react";

type PresetName = keyof typeof presets;
type LayoutMode = "Dengeli" | "Görsel Odaklı" | "Teknik Odaklı";

const presets = {
  "Proje Jürisi": ["Konsept ve Künye", "Vaziyet Planı", "Kat Planları", "Kesitler", "Görünüşler", "Diyagramlar", "Renderlar", "Detay"],
  "Analiz Paftası": ["Başlık ve Sonuç", "Bağlam", "Ulaşım", "Doku", "İklim", "Kullanıcı", "Sorun / Potansiyel", "Tasarım Kararı"],
  "Portfolyo Sayfası": ["Proje Özeti", "Ana Görsel", "Plan", "Kesit", "Süreç", "Diyagram", "Detay", "Künye"],
} as const;

const sizes = { A0: [1189, 841], A1: [841, 594], A2: [594, 420], A3: [420, 297] } as const;

function distributeRows(items: string[], mode: LayoutMode) {
  const preferred =
    mode === "Görsel Odaklı" ? [8, 4, 6, 3, 3, 4, 8, 4] :
    mode === "Teknik Odaklı" ? [4, 8, 6, 6, 6, 3, 3, 6] :
    [5, 7, 6, 6, 4, 4, 8, 4];
  const rows: { item: string; span: number; index: number }[][] = [];
  let row: { item: string; span: number; index: number }[] = [];
  let total = 0;

  items.forEach((item, index) => {
    const wanted = preferred[index % preferred.length];
    if (total + wanted > 12 && row.length) {
      rows.push(row);
      row = [];
      total = 0;
    }
    row.push({ item, span: wanted, index });
    total += wanted;
  });
  if (row.length) rows.push(row);

  return rows.flatMap((currentRow) => {
    const used = currentRow.reduce((sum, entry) => sum + entry.span, 0);
    const missing = 12 - used;
    return currentRow.map((entry, index) => ({
      ...entry,
      span: entry.span + (index === currentRow.length - 1 ? missing : 0),
    }));
  });
}

export default function BoardPlanner() {
  const [size, setSize] = useState<keyof typeof sizes>("A1");
  const [orientation, setOrientation] = useState<"Yatay" | "Dikey">("Yatay");
  const [preset, setPreset] = useState<PresetName>("Proje Jürisi");
  const [mode, setMode] = useState<LayoutMode>("Dengeli");
  const [gap, setGap] = useState(8);
  const [margin, setMargin] = useState(20);
  const [titleHeight, setTitleHeight] = useState(28);
  const [items, setItems] = useState<string[]>([...presets["Proje Jürisi"]]);

  const board = useMemo(() => {
    const [w, h] = sizes[size];
    const [width, height] = orientation === "Yatay" ? [w, h] : [h, w];
    return { width, height };
  }, [size, orientation]);
  const layout = useMemo(() => distributeRows(items, mode), [items, mode]);

  function selectPreset(next: PresetName) {
    setPreset(next);
    setItems([...presets[next]]);
  }
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }
  function rename(index: number, value: string) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  }
  function addPanel() {
    setItems((current) => [...current, `Yeni İçerik ${current.length + 1}`]);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
      <aside className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <label className="block text-sm text-slate-300">Sunum türü
          <select value={preset} onChange={(event) => selectPreset(event.target.value as PresetName)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3">
            {Object.keys(presets).map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-sm text-slate-300">Yerleşim karakteri
          <select value={mode} onChange={(event) => setMode(event.target.value as LayoutMode)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3">
            <option>Dengeli</option><option>Görsel Odaklı</option><option>Teknik Odaklı</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-slate-300">Kâğıt<select value={size} onChange={(event) => setSize(event.target.value as keyof typeof sizes)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3">{Object.keys(sizes).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="text-sm text-slate-300">Yön<select value={orientation} onChange={(event) => setOrientation(event.target.value as "Yatay" | "Dikey")} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"><option>Yatay</option><option>Dikey</option></select></label>
        </div>
        <label className="block text-sm text-slate-300">Grid aralığı: {gap} mm<input type="range" min="3" max="16" value={gap} onChange={(event) => setGap(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" /></label>
        <label className="block text-sm text-slate-300">Kenar boşluğu: {margin} mm<input type="range" min="10" max="35" value={margin} onChange={(event) => setMargin(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" /></label>
        <label className="block text-sm text-slate-300">Başlık bandı: {titleHeight} mm<input type="range" min="16" max="45" value={titleHeight} onChange={(event) => setTitleHeight(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" /></label>
        <div>
          <div className="flex items-center justify-between"><p className="text-sm text-slate-300">İçerikler ve okuma sırası</p><button onClick={addPanel} className="text-xs font-semibold text-cyan-300">+ Ekle</button></div>
          <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
            {items.map((item, index) => (
              <div key={`${index}-${item}`} className="flex items-center gap-2 rounded-lg bg-slate-950 p-2 text-sm">
                <span className="w-5 font-mono text-cyan-400">{index + 1}</span>
                <input value={item} onChange={(event) => rename(index, event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" />
                <button onClick={() => move(index, -1)} aria-label="Yukarı taşı" className="text-slate-400">↑</button>
                <button onClick={() => move(index, 1)} aria-label="Aşağı taşı" className="text-slate-400">↓</button>
                <button onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Sil" className="text-rose-300">×</button>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => window.print()} className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950">Şemayı yazdır / PDF kaydet</button>
      </aside>

      <section className="min-w-0">
        <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm text-slate-500">
          <span>{size} · {orientation} · 12 kolon</span><span>{board.width} × {board.height} mm · boşluksuz otomatik dağılım</span>
        </div>
        <div className="mx-auto flex max-h-[760px] flex-col overflow-hidden border border-cyan-300/50 bg-slate-100 p-4 text-slate-950 shadow-2xl" style={{ aspectRatio: `${board.width}/${board.height}`, padding: `${Math.max(8, margin / 2)}px` }}>
          <header className="mb-2 flex shrink-0 items-end justify-between border-b-2 border-slate-950 pb-2" style={{ height: `${Math.max(28, titleHeight * 1.4)}px` }}>
            <div><p className="text-[8px] font-bold uppercase tracking-[0.25em] text-cyan-700">{preset}</p><h2 className="text-sm font-black sm:text-xl">PROJE BAŞLIĞI</h2></div>
            <div className="text-right text-[7px] sm:text-[9px]"><b>İSİM SOYİSİM</b><br />DERS · DÖNEM · YÜRÜTÜCÜ</div>
          </header>
          <div className="grid min-h-0 flex-1 grid-cols-12 auto-rows-fr" style={{ gap: `${Math.max(2, gap / 2)}px` }}>
            {layout.map(({ item, span, index }) => (
              <div key={`${index}-${item}`} className={`relative flex min-h-0 flex-col justify-between overflow-hidden border p-2 ${index === 0 || (mode === "Görsel Odaklı" && span >= 8) ? "border-cyan-700 bg-cyan-50" : "border-slate-400 bg-white"}`} style={{ gridColumn: `span ${span}` }}>
                <span className="font-mono text-[7px] text-cyan-700">{String(index + 1).padStart(2, "0")}</span>
                <div className="my-1 flex flex-1 items-center justify-center bg-[linear-gradient(135deg,transparent_49%,rgba(15,23,42,.08)_50%,transparent_51%)] text-center text-[7px] text-slate-400">İÇERİK ALANI</div>
                <strong className="text-[7px] leading-tight sm:text-[9px]">{item}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[["Ana başlık", "24–36 pt"], ["Bölüm başlığı", "14–20 pt"], ["Açıklama", "9–12 pt"], ["Çizgi", "0,25–0,50 pt"]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm"><span className="text-slate-500">{label}</span><strong className="float-right text-cyan-300">{value}</strong></div>)}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">Yerleşim her satırda 12 kolonu tamamen doldurur. İçerik sırasını değiştirdikçe pafta otomatik yeniden dengelenir; çizimlerin gerçek oranlarına göre son düzenlemeyi tasarım programında yapmalısın.</p>
      </section>
    </div>
  );
}
