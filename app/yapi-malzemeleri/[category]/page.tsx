import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategory,
  getMaterialsByCategory,
  materialCategories,
} from "../materials";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return materialCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name}: Özellikler, Kullanım ve Karşılaştırma`,
    description: category.description,
    alternates: { canonical: `/yapi-malzemeleri/${category.slug}` },
  };
}

export default async function MaterialCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryMaterials = getMaterialsByCategory(category.slug);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-400">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/yapi-malzemeleri" className="hover:text-cyan-400">
            Yapı Malzemeleri
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{category.name}</span>
        </nav>

        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Yapı malzemeleri
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {category.description}
          </p>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categoryMaterials.map((material) => (
            <Link
              key={material.slug}
              href={`/yapi-malzemeleri/${category.slug}/${material.slug}`}
              className="group flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/60"
            >
              <h2 className="text-2xl font-semibold group-hover:text-cyan-300">
                {material.name}
              </h2>
              <p className="mt-3 flex-1 leading-7 text-slate-400">
                {material.summary}
              </p>
              <span className="mt-6 font-semibold text-cyan-400">
                Özellikleri incele →
              </span>
            </Link>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/yapi-malzemeleri/karsilastir"
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
          >
            Bu malzemeleri karşılaştır
          </Link>
          <Link
            href="/yapi-malzemeleri"
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300"
          >
            Tüm kategoriler
          </Link>
        </div>
      </div>
    </main>
  );
}
