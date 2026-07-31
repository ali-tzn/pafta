"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { guideCollections } from "./guides";
import { revitGuides } from "@/app/revit/guides";
import { bimGuides } from "@/app/bim/guides";
import { softwareCatalogs } from "@/app/software-guide-data";

type GuideItem = {
  title: string;
  description: string;
  href: string;
  group: string;
  meta: string;
  keywords: string[];
};

const items: GuideItem[] = [
  ...guideCollections.map((guide) => ({
    title: guide.shortName,
    description: guide.description,
    href: `/rehberler/${guide.slug}`,
    group: "Proje ve Çizim" as const,
    meta: `${guide.sections.length} ayrıntılı konu`,
    keywords: guide.keywords,
  })),
  ...revitGuides.map((guide) => ({
    title: guide.title,
    description: guide.description,
    href: `/revit/${guide.slug}`,
    group: "Revit" as const,
    meta: guide.category,
    keywords: [guide.category, ...guide.keyPoints],
  })),
  ...bimGuides.map((guide) => ({
    title: guide.title,
    description: guide.description,
    href: `/bim/${guide.slug}`,
    group: "BIM" as const,
    meta: guide.category,
    keywords: [guide.category, ...guide.keyPoints],
  })),
  ...softwareCatalogs.flatMap((catalog) =>
    catalog.guides.map((guide) => ({
      title: guide.title,
      description: guide.description,
      href: `/${catalog.slug}/${guide.slug}`,
      group: catalog.name,
      meta: guide.category,
      keywords: [catalog.name, guide.category, ...guide.keyPoints],
    }))
  ),
];

const workflows = [
  {
    title: "Projeye başlıyorum",
    steps: ["İhtiyaç programı", "Mekânsal ilişkiler", "Çizim ve anlatım"],
    href: "/rehberler/yapi-turleri-ihtiyac-programlari",
  },
  {
    title: "Revit modeli kuruyorum",
    steps: ["Level ve Grid", "CAD bağlantısı", "Duvar ve katmanlar"],
    href: "/revit/level-kot-olusturma",
  },
  {
    title: "BIM teslimine hazırlanıyorum",
    steps: ["BEP", "LOD / LOI", "IFC ve koordinasyon"],
    href: "/bim/bep-nedir",
  },
  {
    title: "CAD ve 3B model sorununu çözüyorum",
    steps: ["AutoCAD çizim", "SketchUp model", "Rhino yüzey"],
    href: "/autocad",
  },
] as const;

const applicationGroups = [
  {
    name: "Revit",
    href: "/revit",
    description: "BIM modelleme, family, görünürlük, pafta ve hata çözümleri",
    count: revitGuides.length,
    accent: "R",
  },
  {
    name: "BIM",
    href: "/bim",
    description: "IFC, LOD/LOI, BEP, koordinasyon ve bilgi yönetimi",
    count: bimGuides.length,
    accent: "B",
  },
  ...softwareCatalogs.map((catalog) => ({
    name: catalog.name,
    href: `/${catalog.slug}`,
    description: catalog.label,
    count: catalog.guides.length,
    accent: catalog.name.slice(0, 2).toLocaleUpperCase("tr-TR"),
  })),
];

export default function ApplicationGuideHub() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Tümü");

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    return items.filter((item) => {
      const matchesGroup = group === "Tümü" || item.group === group;
      const haystack = `${item.title} ${item.description} ${item.meta} ${item.keywords.join(" ")}`
        .toLocaleLowerCase("tr-TR");
      return matchesGroup && (!normalized || haystack.includes(normalized));
    });
  }, [group, query]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-7 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-5 border-b border-slate-800 pb-7 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-cyan-400">
              PAFTA / Mimari Uygulama Rehberi
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Çizimden BIM teslimine uygulama bilgisi
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
              Proje anlatımı, teknik karar, Revit modelleme ve BIM süreçlerini
              aynı merkezde ara. Soruna göre rehberi seç ve kontrol adımlarıyla ilerle.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <label htmlFor="application-guide-search" className="text-xs font-semibold text-slate-300">
              {items.length} rehber içinde ara
            </label>
            <input
              id="application-guide-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Duvar, IFC, pafta, toposolid…"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </div>
        </header>

        {!query && group === "Tümü" && (
          <>
          <section className="mt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Uygulama Merkezi
                </p>
                <h2 className="mt-1 text-xl font-bold">Önce uygulamayı seç</h2>
              </div>
              <span className="text-xs text-slate-500">{applicationGroups.length} uygulama</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {applicationGroups.map((application) => (
                <Link
                  key={application.href}
                  href={application.href}
                  className="group flex min-h-40 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-cyan-400/10 px-2 font-mono text-xs font-black text-cyan-300">
                      {application.accent}
                    </span>
                    <span className="text-[10px] text-slate-500">{application.count} içerik</span>
                  </div>
                  <h3 className="mt-4 font-bold group-hover:text-cyan-300">{application.name}</h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-xs leading-5 text-slate-500">
                    {application.description}
                  </p>
                  <span className="mt-3 text-xs font-semibold text-cyan-300">
                    {application.name} merkezine git →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 border-t border-slate-800 pt-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">İş akışına göre başla</h2>
              <span className="text-xs text-slate-500">{workflows.length} başlangıç rotası</span>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {workflows.map((workflow, index) => (
                <Link
                  key={workflow.title}
                  href={workflow.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-cyan-400/45"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-cyan-400">0{index + 1}</span>
                    <span className="text-cyan-300">→</span>
                  </div>
                  <h3 className="mt-3 font-bold group-hover:text-cyan-300">{workflow.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    {workflow.steps.map((step, stepIndex) => (
                      <span key={step} className="flex items-center gap-1.5">
                        {stepIndex > 0 && <span>›</span>}
                        <span>{step}</span>
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
          </>
        )}

        <section className="mt-7">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Tümü", "Proje ve Çizim", "Revit", "AutoCAD", "SketchUp", "Rhino", "Grasshopper", "Photoshop", "D5 Render", "DIALux evo", "Blender", "BIM"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGroup(option)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  group === option
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-slate-700 bg-slate-900 text-slate-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {group === "Tümü" ? "Tüm uygulama rehberleri" : group}
            </h2>
            <span className="text-xs text-slate-500">{visibleItems.length} sonuç</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-44 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/45"
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-cyan-400">{item.group}</span>
                  <span className="text-slate-600">{item.meta}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold group-hover:text-cyan-300">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
                <span className="mt-4 border-t border-slate-800 pt-3 text-xs font-semibold text-cyan-300">
                  Rehberi aç →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
