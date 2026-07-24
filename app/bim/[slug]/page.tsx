import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bimGuides } from "../guides";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return bimGuides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const guide = bimGuides.find((item) => item.slug === slug); if (!guide) return {};
  return { title: guide.title, description: guide.description, alternates: { canonical: `/bim/${guide.slug}` } };
}
export default async function BimGuidePage({ params }: Props) {
  const { slug } = await params; const guide = bimGuides.find((item) => item.slug === slug); if (!guide) notFound();
  const data={"@context":"https://schema.org","@type":"Article",headline:guide.title,description:guide.description,inLanguage:"tr-TR",author:{"@type":"Organization",name:"PAFTA"},mainEntityOfPage:`https://paftaedu.com/bim/${guide.slug}`};
  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/><article className="mx-auto max-w-4xl">
    <nav className="mb-8 text-sm text-slate-400"><Link href="/">Ana Sayfa</Link><span className="mx-2">/</span><Link href="/bim">BIM</Link><span className="mx-2">/</span><span>{guide.title}</span></nav>
    <header className="border-b border-slate-800 pb-10"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">{guide.category}</p><h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{guide.title}</h1><p className="mt-6 text-lg leading-8 text-slate-300">{guide.description}</p></header>
    <Section title="Temel noktalar" items={guide.keyPoints}/>
    <section className="mt-10"><h2 className="text-2xl font-bold">Uygulama sırası</h2><ol className="mt-5 space-y-4">{guide.workflow.map((item,index)=><li key={item} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"><strong className="text-cyan-300">{index+1}</strong><span className="leading-7 text-slate-300">{item}</span></li>)}</ol></section>
    <Section title="Sık yapılan hatalar" items={guide.pitfalls} warning/>
    <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6"><h2 className="text-xl font-semibold text-cyan-300">Sonuç</h2><p className="mt-3 leading-7 text-slate-300">BIM’de değer yalnız model üretmekten değil; doğru bilginin doğru zamanda, tanımlı sorumluluk ve kontrol süreciyle paylaşılmasından doğar. Bu rehberi proje BEP’i, sözleşme koşulları ve kurum standardıyla birlikte kullan.</p></section>
  </article></main>;
}
function Section({title,items,warning=false}:{title:string;items:string[];warning?:boolean}) { return <section className={`mt-10 rounded-3xl border p-6 ${warning?"border-amber-400/20 bg-amber-400/10":"border-slate-800 bg-slate-900"}`}><h2 className={`text-2xl font-bold ${warning?"text-amber-200":""}`}>{title}</h2><ul className="mt-5 space-y-3 text-slate-300">{items.map(item=><li key={item}>• {item}</li>)}</ul></section>; }
