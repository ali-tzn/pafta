import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideCollection, guideCollections } from "../guides";
import { ArticleSeo, createSeoMetadata } from "@/lib/seo";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return guideCollections.map(({slug})=>({slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const{slug}=await params;const guide=getGuideCollection(slug);if(!guide)return{};return createSeoMetadata({title:guide.name,description:guide.description,path:`/rehberler/${guide.slug}`,keywords:guide.keywords});}
export default async function GuidePage({params}:Props){const{slug}=await params;const guide=getGuideCollection(slug);if(!guide)notFound();return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16"><ArticleSeo title={guide.name} description={guide.description} path={`/rehberler/${guide.slug}`} section="Proje Rehberleri" sectionPath="/rehberler" keywords={guide.keywords}/><article className="mx-auto max-w-5xl">
  <nav className="mb-8 text-sm text-slate-400"><Link href="/">Ana Sayfa</Link><span className="mx-2">/</span><Link href="/rehberler">Rehberler</Link><span className="mx-2">/</span><span>{guide.shortName}</span></nav>
  <header className="border-b border-slate-800 pb-10"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">PAFTA Rehberleri</p><h1 className="mt-4 text-4xl font-bold md:text-5xl">{guide.name}</h1><p className="mt-6 text-lg leading-8 text-slate-300">{guide.intro}</p></header>
  <aside className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6"><h2 className="text-xl font-semibold text-cyan-300">Temel yaklaşım</h2><ul className="mt-4 space-y-3 text-slate-300">{guide.principles.map(item=><li key={item}>• {item}</li>)}</ul></aside>
  <div className="mt-12 grid gap-6 md:grid-cols-2">{guide.sections.map((section,index)=><section key={section.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm font-semibold text-cyan-400">{String(index+1).padStart(2,"0")}</p><h2 className="mt-2 text-2xl font-bold">{section.title}</h2><p className="mt-4 leading-7 text-slate-300">{section.summary}</p><h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-slate-500">Kontrol listesi</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">{section.checks.map(item=><li key={item}>• {item}</li>)}</ul></section>)}</div>
  {guide.warning&&<aside className="mt-10 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 text-amber-100"><strong>Önemli:</strong><p className="mt-2 leading-7">{guide.warning}</p></aside>}
</article></main>;}
