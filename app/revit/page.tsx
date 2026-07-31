"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { revitGuides } from "./guides";

const articles = [
  {
    title: "Revit’te Kolon Yüzeyine Sıva Nasıl Eklenir?",
    description:
      "Duvar uzatmadan, kolonun açıkta kalan yüzeyine doğru ve profesyonel yöntemlerle sıva ekleme.",
    href: "/revit/kolon-yuzeyine-siva-ekleme",
    status: "Hazır",
    category: "Modelleme ve Detay",
  },
  {
    title: "Revit Wall Sweep Neden Seçilemiyor?",
    description:
      "Wall Sweep komutunun pasif görünmesinin nedenleri ve uygulanabilecek çözümler.",
    href: "/revit/wall-sweep-neden-secilmiyor",
    status: "Hazır",
    category: "Hata Çözümü",
  },
  {
    title: "Revit’e İndirilen Family Nasıl Yüklenir?",
    description:
      "RFA dosyasını projeye yükleme, doğru kategoriden yerleştirme ve görünmeme sorunlarını çözme.",
    href: "/revit/indirilen-family-nasil-yuklenir",
    status: "Hazır",
    category: "Family",
  },
  {
    title: "Revit’ten D5 Render’a Malzeme Aktarma",
    description:
      "Revit malzemelerinin D5 Render içinde doğru şekilde ayrılması ve görünmesi.",
    href: "/revit/d5-render-malzeme-aktarma",
    status: "Hazır",
    category: "Görselleştirme",
  },
];

const allArticles = [
  ...articles,
  ...revitGuides.map((guide) => ({
    title: guide.title,
    description: guide.description,
    href: `/revit/${guide.slug}`,
    status: "Hazır",
    category: guide.category,
  })),
];

export default function RevitPage() {
  const categories = Array.from(new Set(allArticles.map((article) => article.category)));
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const visibleArticles = useMemo(
    () => activeCategory === "Tümü" ? allArticles : allArticles.filter((article) => article.category === activeCategory),
    [activeCategory]
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Revit
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Revit Rehberleri
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Revit modelleme, malzeme, duvar, family, görünüş ve D5 Render
            entegrasyonu hakkında öğrenci odaklı rehberler.
          </p>
        </div>

        <section className="mt-8 border-y border-slate-800 py-5">
          <div className="flex items-center justify-between gap-4"><p className="text-xs font-semibold text-slate-400">Revit içeriklerini kategoriye göre filtrele</p><span className="text-xs text-slate-500">{visibleArticles.length} içerik</span></div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Tümü", ...categories].map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeCategory === category ? "border-cyan-400 bg-cyan-400 text-slate-950" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/60"}`}>{category}<span className={`ml-1.5 ${activeCategory === category ? "text-slate-700" : "text-slate-500"}`}>{category === "Tümü" ? allArticles.length : allArticles.filter((article) => article.category === category).length}</span></button>)}
          </div>
        </section>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article) => (
            <article
              key={article.href}
              className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-cyan-400">
                  {article.category}
                </span>

                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {article.status}
                </span>
              </div>

              <h2 className="text-xl font-semibold leading-8">
                {article.title}
              </h2>

              <p className="mt-3 flex-1 leading-7 text-slate-400">
                {article.description}
              </p>

              <Link
                href={article.href}
                className="mt-6 inline-flex font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Rehberi incele →
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
          <h2 className="text-2xl font-semibold">
            Revit’te takıldığın bir konu mu var?
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            PAFTA’da duvar katmanları, sıva çözümleri, family kaynakları,
            malzeme atama, arazi, dokümantasyon ve hata çözümü gibi gerçek
            proje sorunlarına yönelik {allArticles.length} rehber bulunuyor.
          </p>

          <Link
            href="/tools"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Hesap araçlarına git
          </Link>
        </section>
      </div>
    </main>
  );
}
