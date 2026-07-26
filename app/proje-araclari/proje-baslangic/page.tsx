import type { Metadata } from "next";
import ProjectStarter from "./ProjectStarter";

export const metadata: Metadata = {
  title: "Mimari İhtiyaç Programı Oluşturucu | PAFTA",
  description: "Kütüphane, müze, okul, ofis, otel ve kültür merkezi için alan programı, komşuluk ilişkileri ve kat dağılımı oluştur.",
  alternates: { canonical: "/proje-araclari/proje-baslangic" },
};

export default function ProjectStarterPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proje Araçları / 01</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Mimari Proje Başlangıç Merkezi</h1>
        <p className="mt-4 mb-8 max-w-3xl leading-7 text-slate-400">Proje türünü seç; başlangıç ihtiyaç programını, alan dağılımını, komşuluk kararlarını ve kat yaklaşımını tek ekranda oluştur.</p>
        <ProjectStarter />
      </div>
    </main>
  );
}
