import type { Metadata } from "next";
import Link from "next/link";
import { architectureArticles } from "./articles";

export const metadata: Metadata = {
  title: "Mimarlık Rehberi: Akımlar, Kavramlar, Mimarlar ve Yapılar",
  description:
    "Modernizm, Bauhaus, Brutalizm, Postmodernizm ve Dekonstrüktivizm başta olmak üzere mimarlık tarihi, akımlar, kavramlar ve yapılar için öğrenci rehberi.",
  alternates: {
    canonical: "/mimarlik",
  },
  keywords: [
    "mimarlık rehberi",
    "mimarlık akımları",
    "mimarlık kültürü",
    "mimarlık tarihi",
    "mimari kavramlar",
  ],
};

const topics = [
  {
    title: "Mimarlık Akımları",
    description:
      "Bir dönemin düşünsel, teknolojik ve toplumsal koşullarının mimari biçime nasıl dönüştüğünü incele.",
  },
  {
    title: "Önemli Mimarlar",
    description:
      "Mimarlık tarihini etkileyen tasarımcıların fikirlerini, projelerini ve tartışmalı yönlerini keşfet.",
  },
  {
    title: "İkonik Yapılar",
    description:
      "Plan, kesit, strüktür, malzeme ve bağlam üzerinden önemli yapıların neden öne çıktığını öğren.",
  },
  {
    title: "Mimari Kavramlar",
    description:
      "İşlev, bağlam, tipoloji, tektonik, mekân ve temsil gibi temel kavramları anlaşılır biçimde oku.",
  },
];

export default function ArchitectureGuidePage() {
  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PAFTA Mimarlık Rehberi",
    url: "https://paftaedu.com/mimarlik",
    description:
      "Mimarlık akımları, kavramları, önemli mimarlar ve yapılar hakkında öğrenci odaklı rehberler.",
    hasPart: architectureArticles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      url: `https://paftaedu.com/mimarlik/${article.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionData).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">Mimarlık Rehberi</span>
        </nav>

        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Mimarlık kültürü ve kuramı
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            Mimarlık Rehberi
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Mimarlık akımlarını yalnızca biçimleriyle değil; ortaya çıktıkları
            dönem, teknoloji, toplum, malzeme ve mekân anlayışıyla birlikte
            öğren. Ders, sınav, sunum ve tasarım araştırmalarında
            kullanabileceğin öğrenci odaklı bir bilgi arşivi.
          </p>
        </header>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {topics.map((topic) => (
            <article
              key={topic.title}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-xl font-semibold text-cyan-300">
                {topic.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-400">
                {topic.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Mimarlık akımları
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Temel akımları karşılaştırmalı öğren
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              Her rehber; kısa özet, tarihsel arka plan, temel özellikler,
              mimarlar, yapılar, eleştiriler, sık sorulan sorular ve güvenilir
              kaynaklardan oluşur.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {architectureArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/mimarlik/${article.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider">
                  <span className="text-cyan-400">{article.category}</span>
                  <span className="text-slate-500">{article.readingTime}</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold transition group-hover:text-cyan-300">
                  {article.shortTitle}
                </h3>
                <p className="mt-3 flex-1 leading-7 text-slate-400">
                  {article.description}
                </p>
                <p className="mt-5 text-sm text-slate-500">
                  Dönem: {article.period}
                </p>
                <span className="mt-5 font-semibold text-cyan-400">
                  Rehberi oku →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-7 md:p-10">
          <h2 className="text-2xl font-bold text-cyan-300">
            Mimarlık öğrencileri için hazırlanıyor
          </h2>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            İçerikler yalnızca kısa sözlük tanımları değildir. Bir kavramı
            stüdyo kritiğinde, araştırma raporunda veya sınavda kullanabilmek
            için gerekli tarihsel bağlamı ve örnekleri birlikte sunmayı
            amaçlar. Yazıları doğrudan kopyalamak yerine kendi yorumunu
            geliştirmek için başlangıç kaynağı olarak kullan.
          </p>
        </section>
      </div>
    </main>
  );
}
