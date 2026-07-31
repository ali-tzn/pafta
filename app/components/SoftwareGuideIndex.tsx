"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SoftwareCatalog } from "@/app/software-guide-data";

export default function SoftwareGuideIndex({ catalog }: { catalog: SoftwareCatalog }) {
  const categories = Array.from(new Set(catalog.guides.map((guide) => guide.category)));
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const visibleGuides = useMemo(
    () =>
      activeCategory === "Tümü"
        ? catalog.guides
        : catalog.guides.filter((guide) => guide.category === activeCategory),
    [activeCategory, catalog.guides]
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <nav className="text-xs text-slate-500">
          <Link href="/">Ana Sayfa</Link><span className="mx-2">/</span>
          <Link href="/rehberler">Uygulama Rehberi</Link><span className="mx-2">/</span>
          <span>{catalog.name}</span>
        </nav>
        <header className="mt-5 grid gap-5 border-b border-slate-800 pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.23em] text-cyan-400">PAFTA / {catalog.label}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{catalog.name} Rehberleri</h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-300">{catalog.description}</p>
          </div>
          <div className="flex gap-3 text-center">
            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"><strong className="block text-xl text-cyan-300">{catalog.guides.length}</strong><span className="text-[10px] text-slate-500">REHBER</span></div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"><strong className="block text-xl text-cyan-300">{categories.length}</strong><span className="text-[10px] text-slate-500">KATEGORİ</span></div>
          </div>
        </header>
        <div className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-slate-400">İçerikleri kategoriye göre filtrele</p>
            <span className="text-xs text-slate-500">{visibleGuides.length} içerik</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Tümü", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === category
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/60 hover:text-cyan-200"
                }`}
              >
                {category}
                <span className={`ml-1.5 ${activeCategory === category ? "text-slate-700" : "text-slate-500"}`}>
                  {category === "Tümü"
                    ? catalog.guides.length
                    : catalog.guides.filter((guide) => guide.category === category).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleGuides.map((guide)=>(
            <Link key={guide.slug} href={`/${catalog.slug}/${guide.slug}`} className="group flex min-h-52 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/45">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">{guide.category}</span>
              <h2 className="mt-3 text-lg font-bold leading-7 group-hover:text-cyan-300">{guide.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{guide.description}</p>
              <span className="mt-4 border-t border-slate-800 pt-3 text-xs font-semibold text-cyan-300">Adım adım çözümü aç →</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
