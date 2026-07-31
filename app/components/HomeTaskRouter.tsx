"use client";

import Link from "next/link";
import { useState } from "react";

const tasks = [
  { id: "project", title: "Projeye başlayacağım", links: [["Proje başlangıç merkezi", "/proje-araclari/proje-baslangic"], ["Emsal proje atlası", "/proje-araclari/emsal-atlasi"], ["Mekân ölçüleri", "/proje-araclari/mekan-olculeri"]] },
  { id: "detail", title: "Detay veya malzeme seçiyorum", links: [["Mimari detay kütüphanesi", "/mimari-detaylar"], ["Yapı malzemeleri", "/yapi-malzemeleri"], ["Katman ve U-değeri", "/proje-araclari/u-degeri-tasarimcisi"]] },
  { id: "software", title: "Programda takıldım", links: [["Uygulama rehberi", "/uygulama-rehberi"], ["Revit merkezi", "/revit"], ["BIM merkezi", "/bim"]] },
  { id: "calculate", title: "Hesap yapacağım", links: [["Tüm hesap araçları", "/tools"], ["TAKS–KAKS ve emsal", "/tools/taks-kaks"], ["Birim dönüştürücü", "/tools/architecture-unit-converter"]] },
  { id: "delivery", title: "Pafta veya teslim hazırlıyorum", links: [["Jüri gözü", "/teslim-araclari/juri-gozu"], ["Teslim kontrol merkezi", "/teslim-araclari/kontrol-merkezi"], ["PDF araçları", "/pdf-tools"]] },
  { id: "learn", title: "Mimarlık kültürü öğreniyorum", links: [["Mimarlık kültürü", "/mimarlik"], ["Mimarlık akımları", "/mimarlik/kategori/mimarlik-akimlari"], ["İkonik yapılar", "/mimarlik/kategori/ikonik-yapilar"]] },
] as const;

export default function HomeTaskRouter() {
  const [active, setActive] = useState<(typeof tasks)[number]["id"]>(tasks[0].id);
  const selected = tasks.find((task) => task.id === active)!;
  return <section className="border-y border-slate-800 bg-slate-900/50 px-4 py-10 sm:px-6"><div className="mx-auto max-w-7xl"><div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-400">Hızlı yönlendirme</p><h2 className="mt-2 text-2xl font-bold md:text-3xl">Bugün ne yapmak istiyorsun?</h2><p className="mt-3 text-slate-400">Amacını seç; seni doğrudan doğru başlangıç noktasına götürelim.</p></div><div><div className="flex flex-wrap gap-2">{tasks.map((task) => <button key={task.id} onClick={() => setActive(task.id)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active === task.id ? "border-cyan-400 bg-cyan-400 text-slate-950" : "border-slate-700 text-slate-300 hover:border-cyan-400/60"}`}>{task.title}</button>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-3">{selected.links.map(([title, href], index) => <Link key={href} href={href} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-400/50"><span className="text-xs font-semibold text-cyan-400">{index === 0 ? "Önerilen başlangıç" : `${index + 1}. adım`}</span><strong className="mt-1 block text-sm">{title} →</strong></Link>)}</div></div></div></div></section>;
}
