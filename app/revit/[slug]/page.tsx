import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revitGuides } from "../guides";
import { ArticleSeo, createSeoMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return revitGuides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const guide = revitGuides.find((item) => item.slug === slug);
  if (!guide) return {};
  return createSeoMetadata({ title: guide.title, description: guide.description, path: `/revit/${guide.slug}`, keywords: [guide.category, ...guide.keyPoints] });
}
export default async function RevitGuidePage({ params }: Props) {
  const { slug } = await params; const guide = revitGuides.find((item) => item.slug === slug); if (!guide) notFound();
  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16"><ArticleSeo title={guide.title} description={guide.description} path={`/revit/${guide.slug}`} section="Revit Merkezi" sectionPath="/revit" keywords={[guide.category, ...guide.keyPoints]}/><article className="mx-auto max-w-4xl">
    <nav className="mb-8 text-sm text-slate-400"><Link href="/">Ana Sayfa</Link><span className="mx-2">/</span><Link href="/revit">Revit</Link><span className="mx-2">/</span><span>{guide.title}</span></nav>
    <header className="border-b border-slate-800 pb-10"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">{guide.category}</p><h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{guide.title}</h1><p className="mt-6 text-lg leading-8 text-slate-300">{guide.description}</p></header>
    <Block title="Konuyu anlamak için temel noktalar" items={guide.keyPoints}/>
    <section className="mt-10"><h2 className="text-2xl font-bold">Adım adım çalışma sırası</h2><ol className="mt-5 space-y-4">{guide.workflow.map((item,index)=><li key={item} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"><span className="font-bold text-cyan-300">{index+1}</span><span className="leading-7 text-slate-300">{item}</span></li>)}</ol></section>
    <Block title="Sık yapılan hatalar" items={guide.pitfalls} warning/>
    <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6"><h2 className="text-xl font-semibold text-cyan-300">Son kontrol</h2><p className="mt-3 leading-7 text-slate-300">İşlemi doğrudan teslim modelinde uygulamadan önce proje kopyasında dene. Revit sürümünü, ofis şablonunu, görünüş ayarlarını ve ekip modelleme standardını birlikte kontrol et.</p></section>
  </article></main>;
}
function Block({title,items,warning=false}:{title:string;items:string[];warning?:boolean}) { return <section className={`mt-10 rounded-3xl border p-6 ${warning?"border-amber-400/20 bg-amber-400/10":"border-slate-800 bg-slate-900"}`}><h2 className={`text-2xl font-bold ${warning?"text-amber-200":""}`}>{title}</h2><ul className="mt-5 space-y-3 text-slate-300">{items.map(item=><li key={item}>• {item}</li>)}</ul></section>; }
