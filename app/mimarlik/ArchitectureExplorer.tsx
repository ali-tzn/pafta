"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ArchitectureArticle } from "./articles";

export default function ArchitectureExplorer({ articles }: { articles: ArchitectureArticle[] }) {
  const categories = ["Tümü", ...Array.from(new Set(articles.map((item) => item.category)))];
  const [category, setCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    return articles.filter((article) => {
      const matchesCategory = category === "Tümü" || article.category === category;
      const haystack = [article.title, article.description, article.period, ...article.keywords, ...article.architects].join(" ").toLocaleLowerCase("tr-TR");
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [articles, category, query]);

  return (
    <section className="mt-16" id="rehberleri-kesfet">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">Arşivi keşfet</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Akım, kavram, mimar ve yapı ara</h2></div>
        <label className="w-full lg:max-w-md"><span className="sr-only">Mimarlık kültüründe ara</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Örn. tipoloji, Le Corbusier, modernizm…" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3.5 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" /></label>
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${category === item ? "border-cyan-400 bg-cyan-400 text-slate-950" : "border-slate-700 text-slate-300 hover:border-cyan-400/60"}`}>{item}</button>)}
      </div>
      <p className="mt-3 text-sm text-slate-500">{filtered.length} içerik gösteriliyor</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((article) => <Link key={article.slug} href={`/mimarlik/${article.slug}`} className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/60"><div className="flex justify-between gap-3 text-xs font-semibold uppercase tracking-wider"><span className="text-cyan-400">{article.category}</span><span className="text-slate-500">{article.readingTime}</span></div><h3 className="mt-4 text-xl font-semibold group-hover:text-cyan-300">{article.shortTitle}</h3><p className="mt-3 flex-1 leading-7 text-slate-400">{article.description}</p><span className="mt-4 font-semibold text-cyan-400">Rehberi oku →</span></Link>)}
      </div>
      {filtered.length === 0 && <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6 text-amber-100">Bu aramayla eşleşen içerik bulunamadı. Daha kısa bir kelime veya “Tümü” filtresini dene.</div>}
    </section>
  );
}
