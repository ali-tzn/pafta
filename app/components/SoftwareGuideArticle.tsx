import Link from "next/link";
import type { SoftwareCatalog, SoftwareGuide } from "@/app/software-guide-data";
import { ArticleSeo } from "@/lib/seo";
import { ContentMeta, RelatedContent } from "./ContentNavigation";

export default function SoftwareGuideArticle({ catalog, guide }: { catalog: SoftwareCatalog; guide: SoftwareGuide }) {
  const index = catalog.guides.findIndex((item) => item.slug === guide.slug);
  const candidates = catalog.guides.filter((item) => item.slug !== guide.slug);
  const related = [...candidates.filter((item) => item.category === guide.category), ...candidates.filter((item) => item.category !== guide.category)].slice(0, 3);
  const next = catalog.guides[(index + 1) % catalog.guides.length];
  const officialSources: Record<string, { label: string; href: string }[]> = {
    autocad: [{ label: "Autodesk AutoCAD Help", href: "https://help.autodesk.com/view/ACD/2026/ENU/" }],
    sketchup: [{ label: "SketchUp Help Center", href: "https://help.sketchup.com/en" }],
    rhino: [{ label: "Rhino 8 Help", href: "https://docs.mcneel.com/rhino/8/help/en-us/" }],
    grasshopper: [{ label: "McNeel Grasshopper Guides", href: "https://developer.rhino3d.com/guides/grasshopper/" }],
    photoshop: [{ label: "Adobe Photoshop User Guide", href: "https://helpx.adobe.com/photoshop/user-guide.html" }],
    "d5-render": [{ label: "D5 Render Documentation", href: "https://docs.d5render.com/" }],
    "dialux-evo": [{ label: "DIALux evo", href: "https://www.dialux.com/en-GB/dialux" }],
    blender: [{ label: "Blender Manual", href: "https://docs.blender.org/manual/en/latest/" }],
  };
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12">
      <ArticleSeo title={guide.title} description={guide.description} path={`/${catalog.slug}/${guide.slug}`} section={`${catalog.name} Rehberleri`} sectionPath={`/${catalog.slug}`} keywords={[catalog.name, guide.category, ...guide.keyPoints]} />
      <article className="mx-auto max-w-4xl">
        <nav className="text-xs text-slate-500"><Link href="/">Ana Sayfa</Link><span className="mx-2">/</span><Link href={`/${catalog.slug}`}>{catalog.name}</Link><span className="mx-2">/</span><span>{guide.title}</span></nav>
        <header className="mt-6 border-b border-slate-800 pb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.23em] text-cyan-400">{catalog.name} / {guide.category}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">{guide.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{guide.description}</p>
        </header>
        <ContentMeta sourceNote="Uygulama içi iş akışı ve resmî dokümantasyon kontrolü" sources={officialSources[catalog.slug] ?? []} />
        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">Önce bunları kontrol et</h2>
          <ul className="mt-5 grid gap-3 text-slate-300 md:grid-cols-3">{guide.keyPoints.map((item,index)=><li key={item} className="rounded-xl bg-slate-950 p-4"><span className="text-xs font-bold text-cyan-300">0{index+1}</span><p className="mt-2 leading-6">{item}</p></li>)}</ul>
        </section>
        <section className="mt-9"><h2 className="text-2xl font-bold">Adım adım çözüm</h2><ol className="mt-5 space-y-3">{guide.workflow.map((item,index)=><li key={item} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"><span className="font-bold text-cyan-300">{index+1}</span><span className="leading-7 text-slate-300">{item}</span></li>)}</ol></section>
        <section className="mt-9 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6"><h2 className="text-2xl font-bold text-amber-200">Sık yapılan hatalar</h2><ul className="mt-5 space-y-3 text-slate-300">{guide.pitfalls.map((item)=><li key={item}>• {item}</li>)}</ul></section>
        <section className="mt-9 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6"><h2 className="text-xl font-bold text-cyan-200">Son kontrol</h2><p className="mt-3 leading-7 text-slate-300">İşlemi ana teslim dosyasında uygulamadan önce bir kopyada dene. Birim, dosya sürümü, katman düzeni ve çıktı sonucunu birlikte kontrol et.</p><Link href={`/${catalog.slug}`} className="mt-5 inline-flex font-semibold text-cyan-300">Diğer {catalog.name} rehberleri →</Link></section>
        <RelatedContent items={related.map((item) => ({ href: `/${catalog.slug}/${item.slug}`, title: item.title, description: item.description, label: item.category }))} next={{ href: `/${catalog.slug}/${next.slug}`, title: next.title }} />
      </article>
    </main>
  );
}
