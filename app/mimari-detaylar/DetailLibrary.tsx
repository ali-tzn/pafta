"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { architecturalDetails, detailCategories } from "./details";
import DetailCardIcon from "./DetailCardIcon";

export default function DetailLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tümü");
  const visible = useMemo(() => architecturalDetails.filter((item) =>
    (category === "Tümü" || item.category === category) &&
    `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))
  ), [category, query]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-cyan-400">PAFTA / Bilgi Kütüphaneleri</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black sm:text-6xl">Mimari Detay Kütüphanesi</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">Detayı yalnızca çizgi olarak değil; katman sürekliliği, su, ısı, yangın ve uygulanabilirlik kararlarıyla birlikte incele.</p>
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Parapet, pencere, su yalıtımı, ısı köprüsü…" className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-cyan-400" />
          <div className="mt-4 flex flex-wrap gap-2">{detailCategories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm ${category === item ? "bg-cyan-400 font-bold text-slate-950" : "border border-slate-700 text-slate-300"}`}>{item}</button>)}</div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((detail, index) => <Link key={detail.slug} href={`/mimari-detaylar/${detail.slug}`} className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50">
            <div className="flex justify-between text-xs"><span className="font-mono text-cyan-400">DT-{String(index + 1).padStart(2, "0")}</span><span className="text-slate-500">{detail.scale}</span></div>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-700 bg-[#eef1f3]">
              <DetailCardIcon slug={detail.slug} title={detail.title} />
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-wider text-slate-500">{detail.category}</p>
            <h2 className="mt-2 text-xl font-bold group-hover:text-cyan-300">{detail.title}</h2>
            <p className="mt-3 leading-7 text-slate-400">{detail.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">{detail.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-400">{tag}</span>)}</div>
          </Link>)}
        </div>
      </div>
    </main>
  );
}
