import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mimarlık Yapay Zekâ Merkezi: Araçlar, Promptlar ve Rehberler",
  description:
    "Mimarlar ve öğrenciler için yapay zekâ araçları, mimari prompt oluşturucu, araç bulucu, iş akışları, telif ve güvenli kullanım rehberleri.",
  alternates: { canonical: "/mimarlik-yapay-zeka" },
};

const guides = [
  ["Mimarlıkta Yapay Zekâ Nasıl Kullanılır?", "Fikir geliştirmeden sunuma kadar doğru kullanım sınırları."],
  ["Eskizden Görsele AI İş Akışı", "Eskizi koruyarak kontrollü görsel alternatifleri üretme."],
  ["AI Render Hataları", "Ölçek, strüktür, malzeme ve perspektif hatalarını ayırt etme."],
  ["Telif ve Kaynak Gösterme", "Üniversite çalışmaları ve portfolyoda şeffaf kullanım."],
  ["Dosya Gizliliği", "Proje dosyası yüklemeden önce kontrol edilmesi gerekenler."],
  ["AI Çıktısını Mimari Karara Dönüştürme", "Görseli uygulanabilir proje sanmamak için değerlendirme adımları."],
];

export default function ArchitectureAiHubPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/">Ana Sayfa</Link><span className="mx-2">/</span>
          <span className="text-slate-200">Mimarlık Yapay Zekâ Merkezi</span>
        </nav>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Tasarım + teknoloji
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Mimarlık Yapay Zekâ Merkezi
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Yapay zekâyı mimari kararın yerine koymadan; araştırma, fikir
            geliştirme, görselleştirme ve sunum süreçlerinde kontrollü kullan.
            Araç seç, ayrıntılı prompt üret ve güvenli iş akışlarını öğren.
          </p>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <Link href="/mimarlik-yapay-zeka/prompt-olusturucu" className="group rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7 hover:border-cyan-300">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Çalışan araç</p>
            <h2 className="mt-3 text-3xl font-bold">Mimari Prompt Oluşturucu</h2>
            <p className="mt-4 leading-7 text-slate-300">Yapı türü, bağlam, malzeme, atmosfer, kamera ve çıktı türünü seçerek düzenlenebilir bir prompt hazırla.</p>
            <span className="mt-6 inline-flex font-semibold text-cyan-300">Aracı aç →</span>
          </Link>
          <Link href="/mimarlik-yapay-zeka/arac-bulucu" className="group rounded-3xl border border-violet-400/30 bg-violet-400/10 p-7 hover:border-violet-300">
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-300">Çalışan araç</p>
            <h2 className="mt-3 text-3xl font-bold">Mimarlık AI Araç Bulucu</h2>
            <p className="mt-4 leading-7 text-slate-300">Yapmak istediğin işi ve proje aşamasını seç; uygun araç kategorisini, kontrol listesini ve önerilen iş akışını gör.</p>
            <span className="mt-6 inline-flex font-semibold text-violet-300">Aracı aç →</span>
          </Link>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold">Rehberler ve güvenli kullanım</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {guides.map(([title, description]) => (
              <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-7">
          <h2 className="text-xl font-semibold text-amber-200">Mimari doğrulama şart</h2>
          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            Yapay zekâ çıktıları ölçek, strüktür, yönetmelik, erişilebilirlik,
            malzeme birleşimi ve telif açısından hatalı olabilir. Üretilen
            görseller fikir ve iletişim aracıdır; uygulama projesi veya uzman
            hesabı yerine kullanılmamalıdır.
          </p>
        </section>
      </div>
    </main>
  );
}
