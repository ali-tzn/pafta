import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { architecturalDetails } from "../details";
import DetailDiagram from "../DetailDiagram";
import { ArticleSeo, createSeoMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return architecturalDetails.map((detail) => ({ slug: detail.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = architecturalDetails.find((item) => item.slug === slug);
  if (!detail) return {};
  return createSeoMetadata({
    title: `${detail.title} – Mimari Detay`,
    description: detail.summary,
    path: `/mimari-detaylar/${detail.slug}`,
    keywords: [...detail.tags, detail.category, "mimari detay", "yapı detayı"],
  });
}

export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = architecturalDetails.find((item) => item.slug === slug);
  if (!detail) notFound();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <ArticleSeo title={detail.title} description={detail.summary} path={`/mimari-detaylar/${detail.slug}`} section="Mimari Detay Kütüphanesi" sectionPath="/mimari-detaylar" keywords={detail.tags} />
      <article className="mx-auto max-w-5xl">
        <Link href="/mimari-detaylar" className="text-sm font-semibold text-cyan-400">← Detay kütüphanesi</Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[.2em] text-cyan-400">{detail.category} · Önerilen çizim {detail.scale}</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">{detail.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{detail.summary}</p>
        <DetailDiagram detail={detail} />
        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Katman kurgusu</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700">{detail.layers.map((layer, index) => <div key={layer} className="flex items-center gap-4 border-b border-slate-700 bg-slate-950 p-4 last:border-0"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-mono text-xs font-bold text-slate-950">{index + 1}</span><span>{layer}</span></div>)}</div>
        </section>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6"><h2 className="text-xl font-bold text-emerald-200">Kontrol noktaları</h2><ul className="mt-5 space-y-4 leading-7 text-slate-300">{detail.checkpoints.map((item) => <li key={item}>✓ {item}</li>)}</ul></section>
          <section className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6"><h2 className="text-xl font-bold text-amber-200">Yaygın hatalar</h2><ul className="mt-5 space-y-4 leading-7 text-slate-300">{detail.commonErrors.map((item) => <li key={item}>! {item}</li>)}</ul></section>
        </div>
        <div className="mt-8 rounded-2xl border border-slate-800 p-5 text-sm leading-6 text-slate-500">Bu içerik tasarım ve koordinasyon kontrol listesi sunar; uygulamaya özel statik, yangın, su ve ısı yalıtımı projeleriyle üretici sistem detaylarının yerine geçmez.</div>
      </article>
    </main>
  );
}
