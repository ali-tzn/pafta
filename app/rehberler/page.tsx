import type { Metadata } from "next";
import Link from "next/link";
import { guideCollections } from "./guides";

export const metadata: Metadata = {
  title: "Mimarlık Öğrenci Rehberleri: Çizim, Detay, Program ve Jüri",
  description: "Mimari çizim, yapı türleri, detay, yönetmelik, sürdürülebilirlik, yapı analizi ve portfolyo için kapsamlı öğrenci rehberleri.",
  alternates: { canonical: "/rehberler" },
};

export default function GuidesPage() {
  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16"><div className="mx-auto max-w-7xl">
    <nav className="mb-8 text-sm text-slate-400"><Link href="/">Ana Sayfa</Link><span className="mx-2">/</span><span>Rehberler</span></nav>
    <header className="max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">Mimarlık öğrencileri için</p><h1 className="mt-4 text-4xl font-bold md:text-6xl">Tasarım ve Proje Rehberleri</h1><p className="mt-6 text-lg leading-8 text-slate-300">Çizimden yapı programına, teknik detaydan jüri sunumuna kadar mimarlık eğitiminin farklı aşamalarını tek bir düzenli arşivde incele.</p></header>
    <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{guideCollections.map((guide)=><Link key={guide.slug} href={`/rehberler/${guide.slug}`} className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:-translate-y-1 hover:border-cyan-400/60"><h2 className="text-2xl font-semibold group-hover:text-cyan-300">{guide.shortName}</h2><p className="mt-3 flex-1 leading-7 text-slate-400">{guide.description}</p><p className="mt-5 text-sm text-slate-500">{guide.sections.length} ayrıntılı konu</p><span className="mt-4 font-semibold text-cyan-400">Rehberi aç →</span></Link>)}</section>
  </div></main>;
}
