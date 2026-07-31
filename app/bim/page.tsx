"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { bimGuides } from "./guides";

const topics = [
  {
    title: "BIM Nedir?",
    description:
      "BIM’in temel mantığı, mimarlık öğrencileri ve ofis süreçleri için neden önemli olduğu.",
    href: "/bim/bim-nedir",
    status: "Hazır",
    category: "BIM Temelleri",
  },
  {
    title: "LOD Seviyeleri",
    description:
      "LOD 100, 200, 300, 350 ve 400 seviyelerinin proje sürecindeki karşılıkları.",
    href: "/bim/lod-seviyeleri",
    status: "Hazır",
    category: "LOD ve Bilgi",
  },
  {
    title: "BIM Koordinasyonu",
    description:
      "Mimari, statik ve mekanik modellerin çakışma kontrolü ve koordinasyon süreci.",
    href: "/bim/koordinasyon",
    status: "Hazır",
    category: "Koordinasyon",
  },
];

const allTopics = [
  ...topics,
  ...bimGuides.map((guide) => ({
    title: guide.title,
    description: guide.description,
    href: `/bim/${guide.slug}`,
    status: "Hazır",
    category: guide.category,
  })),
];

export default function BimPage() {
  const categories = Array.from(new Set(allTopics.map((topic) => topic.category)));
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const visibleTopics = useMemo(
    () => activeCategory === "Tümü" ? allTopics : allTopics.filter((topic) => topic.category === activeCategory),
    [activeCategory]
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA BIM
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            BIM Rehberleri
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            BIM süreçleri, model koordinasyonu, LOD seviyeleri ve dijital proje
            yönetimi hakkında öğrenci odaklı içerikler.
          </p>
        </div>

        <section className="mt-8 border-y border-slate-800 py-5">
          <div className="flex items-center justify-between gap-4"><p className="text-xs font-semibold text-slate-400">BIM içeriklerini kategoriye göre filtrele</p><span className="text-xs text-slate-500">{visibleTopics.length} içerik</span></div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Tümü", ...categories].map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeCategory === category ? "border-cyan-400 bg-cyan-400 text-slate-950" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/60"}`}>{category}<span className={`ml-1.5 ${activeCategory === category ? "text-slate-700" : "text-slate-500"}`}>{category === "Tümü" ? allTopics.length : allTopics.filter((topic) => topic.category === category).length}</span></button>)}
          </div>
        </section>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleTopics.map((topic) => (
            <article
              key={topic.href}
              className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-cyan-400">
                  {topic.category}
                </span>

                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {topic.status}
                </span>
              </div>

              <h2 className="text-xl font-semibold leading-8">
                {topic.title}
              </h2>

              <p className="mt-3 flex-1 leading-7 text-slate-400">
                {topic.description}
              </p>

              <Link
                href={topic.href}
                className="mt-6 inline-flex font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Rehberi incele →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
