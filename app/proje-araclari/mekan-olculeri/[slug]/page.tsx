import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { spaceStandards } from "../../data";

export function generateStaticParams() {
  return spaceStandards.map((space) => ({ slug: space.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const space = spaceStandards.find((item) => item.slug === slug);
  if (!space) return {};
  return { title: `${space.name} Ölçüleri ve Alan İhtiyacı | PAFTA`, description: `${space.name} için minimum ve önerilen alan, temel ölçüler ve mimari yerleşim notları.`, alternates: { canonical: `/proje-araclari/mekan-olculeri/${space.slug}` } };
}

export default async function SpaceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const space = spaceStandards.find((item) => item.slug === slug);
  if (!space) notFound();
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6"><article className="mx-auto max-w-4xl">
      <Link href="/proje-araclari/mekan-olculeri" className="text-sm text-cyan-300">← Mekân kütüphanesi</Link>
      <p className="mt-10 text-xs font-bold uppercase tracking-wider text-cyan-400">{space.category}</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">{space.name} ölçüleri</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm text-slate-500">Başlangıç minimumu</p><p className="mt-2 text-2xl font-bold">{space.min}</p></div><div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-6"><p className="text-sm text-cyan-300">Önerilen aralık</p><p className="mt-2 text-2xl font-bold">{space.ideal}</p></div></div>
      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-xl font-bold">Yerleşim referansı</h2><p className="mt-3 leading-7 text-slate-300">{space.dimensions}</p><ul className="mt-5 space-y-3">{space.details.map((detail) => <li key={detail} className="flex gap-3 text-slate-400"><span className="text-cyan-400">✓</span>{detail}</li>)}</ul></section>
      <aside className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-6 text-amber-100"><strong>Önemli:</strong> {space.sourceNote} Buradaki değerler eğitim ve ön tasarım referansıdır; ruhsat veya uygulama uygunluğu beyan etmez.</aside>
    </article></main>
  );
}
