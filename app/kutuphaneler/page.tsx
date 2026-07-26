import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mimarlık Bilgi Kütüphaneleri | PAFTA",
  description: "Mimari detaylar, yapı malzemeleri, mimarlık kültürü, proje rehberleri, BIM ve Revit başvuru içerikleri.",
  alternates: { canonical: "/kutuphaneler" },
};

const libraries = [
  { title: "Mimari Detay Kütüphanesi", href: "/mimari-detaylar", text: "Cephe, çatı, temel, ıslak hacim ve doğrama birleşimleri.", count: "12 detay" },
  { title: "Yapı Malzemeleri", href: "/yapi-malzemeleri", text: "Malzeme özellikleri, kullanım alanları ve karşılaştırmalar.", count: "27 malzeme" },
  { title: "Mimarlık Rehberi", href: "/mimarlik", text: "Akımlar, kavramlar, mimarlar ve ikonik yapılar.", count: "Kültür" },
  { title: "Proje Rehberleri", href: "/rehberler", text: "Çizim, ihtiyaç programı, detay ve jüri hazırlığı.", count: "70 başlık" },
  { title: "Revit Merkezi", href: "/revit", text: "Modelleme, görünüm, family ve koordinasyon çözümleri.", count: "26 rehber" },
  { title: "BIM Merkezi", href: "/bim", text: "LOD, IFC, koordinasyon ve bilgi yönetimi.", count: "26 rehber" },
];

export default function LibrariesPage() {
  return <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6"><div className="mx-auto max-w-7xl">
    <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-cyan-400">PAFTA / Kütüphaneler</p>
    <h1 className="mt-4 max-w-4xl text-4xl font-black sm:text-6xl">Bilgiye dosya düzeniyle ulaş.</h1>
    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">Araçlardan ayrı, araştırma ve teknik başvuru için düzenlenmiş mimarlık kütüphaneleri.</p>
    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{libraries.map((item, index) => <Link key={item.href} href={item.href} className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400/50">
      <div className="flex justify-between font-mono text-xs"><span className="text-cyan-400">K-{String(index + 1).padStart(2, "0")}</span><span className="text-slate-500">{item.count}</span></div>
      <h2 className="mt-8 text-2xl font-bold group-hover:text-cyan-300">{item.title}</h2><p className="mt-3 leading-7 text-slate-400">{item.text}</p><span className="mt-7 inline-block font-semibold text-cyan-400">Kütüphaneyi aç →</span>
    </Link>)}</div>
  </div></main>;
}
