import type { Metadata } from "next";
import BubbleDiagram from "./BubbleDiagram";

export const metadata: Metadata = {
  title: "Mimari Balon Diyagramı ve İlişki Şeması Oluşturucu | PAFTA",
  description: "Mekânları alanlarına göre boyutlandır, yakınlık ilişkilerini tanımla, otomatik balon diyagramı oluştur ve PNG veya SVG indir.",
  alternates: { canonical: "/proje-araclari/balon-diyagrami" },
};

export default function BubbleDiagramPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proje Araçları / 06</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Mimari İlişki ve Balon Diyagramı</h1>
        <p className="mt-4 mb-8 max-w-3xl leading-7 text-slate-400">Mekân alanlarını, zonları ve yakınlık ilişkilerini tanımla. Otomatik şemayı sürükleyerek düzenle ve jüri paftana uygun biçimde dışa aktar.</p>
        <BubbleDiagram />
      </div>
    </main>
  );
}
