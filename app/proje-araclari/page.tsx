import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mimari Tasarım Araçları | PAFTA",
  description: "İhtiyaç programı, mekânsal ilişkiler, güneş ve yönlenme, vaziyet yerleşimi ve emsal analizi için ücretsiz mimari tasarım araçları.",
  alternates: { canonical: "/proje-araclari" },
};

const tools = [
  { title: "Mimari Proje Başlangıç Merkezi", href: "/proje-araclari/proje-baslangic", code: "01", text: "İhtiyaç programı, alan dağılımı, komşuluk ilişkileri ve kat önerisi üret." },
  { title: "Mimari İlişki ve Balon Diyagramı", href: "/proje-araclari/balon-diyagrami", code: "02", text: "Mekânları alanlarına göre boyutlandır, ilişkilerle otomatik yerleştir ve diyagramı indir." },
  { title: "Güneş, Yönlenme ve Cephe Karar Asistanı", href: "/proje-araclari/gunes-yonlenme", code: "03", text: "Konum, cephe yönü ve kullanım saatine göre güneş kontrolü ve açıklık kararlarını sınama." },
  { title: "Vaziyet Yerleşimi ve Yapı Oturumu Simülatörü", href: "/proje-araclari/vaziyet-simulatoru", code: "04", text: "Parsel, çekme sınırı ve yapı oturumunu görsel olarak kur; yerleşim seçeneklerini karşılaştır." },
  { title: "Mekân Ölçüleri Kütüphanesi", href: "/proje-araclari/mekan-olculeri", code: "05", text: "Derslikten otel odasına minimum ve önerilen mekân ölçülerini incele." },
  { title: "Emsal Proje Atlası", href: "/proje-araclari/emsal-atlasi", code: "06", text: "Önemli yapıları alan, program, dolaşım ve strüktür üzerinden karşılaştır." },
];

export default function ProjectToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <section className="mx-auto max-w-7xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">PAFTA / Tasarım Araçları</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Tasarım kararlarını görünür hâle getir.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">Programdan yerleşime, güneşten mekânsal ilişkilere kadar erken tasarım kararlarını üretmene ve seçenekleri karşılaştırmana yardım eden çalışma alanı.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {tools.map((tool, index) => (
            <Link key={tool.href} href={tool.href} className={`group rounded-3xl border border-slate-800 bg-slate-900/70 p-7 transition hover:border-cyan-400/60 ${index === 0 ? "md:col-span-2" : ""}`}>
              <span className="font-mono text-sm text-cyan-400">{tool.code}</span>
              <h2 className="mt-8 text-2xl font-bold group-hover:text-cyan-300">{tool.title}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-400">{tool.text}</p>
              <span className="mt-8 inline-block text-sm font-semibold text-cyan-300">Aracı aç →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
