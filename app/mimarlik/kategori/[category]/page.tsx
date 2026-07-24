import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { architectureArticles } from "../../articles";
import {
  architectureCategories,
  getArchitectureCategory,
} from "../../categories";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return architectureCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getArchitectureCategory(slug);
  if (!category) return {};

  const hasArticles = architectureArticles.some(
    (article) => article.category === category.label
  );

  return {
    title: `${category.name} – Mimarlık Rehberi`,
    description: category.description,
    alternates: {
      canonical: `/mimarlik/kategori/${category.slug}`,
    },
    robots: hasArticles ? undefined : { index: false, follow: true },
  };
}

export default async function ArchitectureCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getArchitectureCategory(slug);
  if (!category) notFound();

  const articles = architectureArticles.filter(
    (article) => article.category === category.label
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-400">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/mimarlik" className="hover:text-cyan-400">
            Mimarlık Rehberi
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{category.name}</span>
        </nav>

        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Mimarlık Rehberi
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            {category.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            {category.introduction}
          </p>
        </header>

        {articles.length > 0 ? (
          <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/mimarlik/${article.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                <div className="flex justify-between gap-3 text-xs font-semibold uppercase tracking-wider">
                  <span className="text-cyan-400">{article.period}</span>
                  <span className="text-slate-500">{article.readingTime}</span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold group-hover:text-cyan-300">
                  {article.shortTitle}
                </h2>
                <p className="mt-3 flex-1 leading-7 text-slate-400">
                  {article.description}
                </p>
                <span className="mt-5 font-semibold text-cyan-400">
                  Rehberi oku →
                </span>
              </Link>
            ))}
          </section>
        ) : (
          <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-7">
            <h2 className="text-2xl font-semibold">
              Bu bölüm için içerik arşivi hazırlanıyor
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Sayfaları kısa tanımlarla doldurmak yerine, her konuyu örnekleri
              ve kaynaklarıyla ayrıntılı hazırlıyoruz. Bu kategori içerik
              kazanana kadar arama motorlarında dizine eklenmeyecek.
            </p>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Bu bölümde ele alınacak konular</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {category.plannedTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-slate-800 pt-10">
          <h2 className="text-xl font-semibold">Diğer rehber başlıkları</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {architectureCategories
              .filter((item) => item.slug !== category.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/mimarlik/kategori/${item.slug}`}
                  className="rounded-xl border border-cyan-400/20 px-4 py-3 font-semibold text-cyan-300 hover:bg-cyan-400/10"
                >
                  {item.name} →
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
