import type { Metadata } from "next";
import Link from "next/link";
import { materialCategories, materials } from "./materials";

export const metadata: Metadata = {
  title: "Yapı Malzemeleri Rehberi: Özellikler ve Karşılaştırmalar",
  description:
    "Duvar, yalıtım, cam, ahşap, sıva, beton ve zemin kaplama malzemelerinin özelliklerini, kullanım alanlarını ve avantajlarını karşılaştır.",
  alternates: { canonical: "/yapi-malzemeleri" },
  keywords: [
    "yapı malzemeleri",
    "duvar malzemeleri",
    "yalıtım malzemeleri",
    "inşaat malzemeleri",
    "malzeme karşılaştırma",
  ],
};

export default function BuildingMaterialsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PAFTA Yapı Malzemeleri Rehberi",
    url: "https://paftaedu.com/yapi-malzemeleri",
    hasPart: materials.map((material) => ({
      "@type": "Article",
      name: material.name,
      url: `https://paftaedu.com/yapi-malzemeleri/${material.category}/${material.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-400">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">Yapı Malzemeleri</span>
        </nav>

        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Malzeme bilgisi ve seçim rehberi
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Yapı Malzemeleri Rehberi
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Malzemeleri kategori kategori incele; kullanım alanlarını,
            avantajlarını ve dikkat edilmesi gereken noktaları öğren.
            Alternatifleri aynı ekranda karşılaştırarak tasarım kararına
            başlangıç oluştur.
          </p>
          <Link
            href="/yapi-malzemeleri/karsilastir"
            className="mt-7 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Malzemeleri karşılaştır →
          </Link>
        </header>

        <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {materialCategories.map((category) => {
            const count = materials.filter(
              (material) => material.category === category.slug
            ).length;
            return (
              <Link
                key={category.slug}
                href={`/yapi-malzemeleri/${category.slug}`}
                className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-2xl text-cyan-300">
                  {category.icon}
                </div>
                <h2 className="mt-5 text-2xl font-semibold group-hover:text-cyan-300">
                  {category.name}
                </h2>
                <p className="mt-3 leading-7 text-slate-400">
                  {category.description}
                </p>
                <p className="mt-5 text-sm text-slate-500">
                  {count} malzeme rehberi
                </p>
                <span className="mt-4 inline-flex font-semibold text-cyan-400">
                  Kategoriyi aç →
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-14 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-7">
          <h2 className="text-xl font-semibold text-amber-200">
            Proje kararı hakkında
          </h2>
          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            Buradaki bilgiler ön değerlendirme ve eğitim amaçlıdır. Gerçek
            ürün performansı; yoğunluk, kalınlık, üretici, uygulama sistemi ve
            yürürlükteki mevzuata göre değişir. Uygulama projesinde üretici
            teknik föylerini, standartları ve ilgili uzman hesaplarını kullan.
          </p>
        </section>
      </div>
    </main>
  );
}
