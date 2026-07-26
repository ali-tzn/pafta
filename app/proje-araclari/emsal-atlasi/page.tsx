import type { Metadata } from "next";
import CaseAtlas from "./CaseAtlas";

export const metadata: Metadata = { title: "Mimari Emsal Proje Atlası | PAFTA", description: "Önemli mimari yapıları program, alan, dolaşım, taşıyıcı sistem ve tasarım stratejileri üzerinden incele ve karşılaştır.", alternates: { canonical: "/proje-araclari/emsal-atlasi" } };

export default function CaseAtlasPage() {
  return <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6"><div className="mx-auto max-w-7xl"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proje Araçları / 04</p><h1 className="mt-4 text-4xl font-black sm:text-5xl">Mimari Emsal Proje Atlası</h1><p className="mt-4 mb-8 max-w-3xl leading-7 text-slate-400">Yapıları yalnızca görselleriyle değil; program, dolaşım, strüktür ve tasarım dersi üzerinden oku.</p><CaseAtlas /></div></main>;
}
