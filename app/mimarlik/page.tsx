import type { Metadata } from "next";
import Link from "next/link";
import { architectureArticles } from "./articles";
import { architectureCategories } from "./categories";
import ArchitectureExplorer from "./ArchitectureExplorer";

export const metadata: Metadata = {
  title: "Mimarlık Kültürü Rehberi: Akımlar, Kavramlar ve Mimarlar",
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

export default function ArchitectureGuidePage() {
  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PAFTA Mimarlık Kültürü Rehberi",
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
          <span className="text-slate-200">Mimarlık Kültürü Rehberi</span>
        </nav>

        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Mimarlık kültürü ve kuramı
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            Mimarlık Kültürü Rehberi
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Mimarlık akımlarını yalnızca biçimleriyle değil; ortaya çıktıkları
            dönem, teknoloji, toplum, malzeme ve mekân anlayışıyla birlikte
            öğren. Ders, sınav, sunum ve tasarım araştırmalarında
            kullanabileceğin öğrenci odaklı bir bilgi arşivi.
          </p>
        </header>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {architectureCategories.map((category) => {
            const count = architectureArticles.filter(
              (article) => article.category === category.label
            ).length;
            return (
            <Link
              key={category.slug}
              href={`/mimarlik/kategori/${category.slug}`}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-xl font-semibold text-cyan-300">
                {category.name}
              </h2>
              <p className="mt-3 leading-7 text-slate-400">
                {category.description}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                {count > 0 ? `${count} kapsamlı içerik` : "İçerik planı hazır"}
              </p>
              <span className="mt-4 inline-flex font-semibold text-cyan-400">
                Başlığı aç →
              </span>
            </Link>
          )})}
        </section>

        <ArchitectureExplorer articles={architectureArticles} />

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
