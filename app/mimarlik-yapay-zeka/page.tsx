import type { Metadata } from "next";
import Link from "next/link";
import AiWorkflowLibrary from "./AiWorkflowLibrary";

export const metadata: Metadata = {
  title: "Mimari AI: Yapay Zekâ Araçları, Promptlar ve Rehberler",
  description:
    "Mimarlar ve öğrenciler için yapay zekâ araçları, mimari prompt oluşturucu, araç bulucu, iş akışları, telif ve güvenli kullanım rehberleri.",
  alternates: { canonical: "/mimarlik-yapay-zeka" },
};

export default function ArchitectureAiHubPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-7 text-white sm:px-6 sm:py-9">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-5 text-xs text-slate-400">
          <Link href="/">Ana Sayfa</Link><span className="mx-2">/</span>
          <span className="text-slate-200">Mimari AI</span>
        </nav>
        <header className="max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Tasarım + teknoloji
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Mimari AI
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-300">
            Yapay zekâyı mimari kararın yerine koymadan; araştırma, fikir
            geliştirme, görselleştirme ve sunum süreçlerinde kontrollü kullan.
            Araç seç, ayrıntılı prompt üret ve güvenli iş akışlarını öğren.
          </p>
        </header>

        <section className="mt-7 grid gap-4 md:grid-cols-2">
          <Link href="/mimarlik-yapay-zeka/arac-bulucu" className="group rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5 hover:border-cyan-300">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">12 araç · görev bazlı eşleştirme</p>
            <h2 className="mt-2 text-2xl font-bold">Mimarlık AI Araç Bulucu</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">İşini, girdini, proje aşamanı, önceliğini ve bütçeni seç; nedenleri ve iş akışıyla birlikte araç önerisi al.</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-cyan-300">Aracı aç →</span>
          </Link>
          <Link href="/mimarlik-yapay-zeka/prompt-olusturucu" className="group rounded-2xl border border-violet-400/30 bg-violet-400/10 p-5 hover:border-violet-300">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">Kontrollü prompt üretimi</p>
            <h2 className="mt-2 text-2xl font-bold">Mimari Prompt Oluşturucu</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Yapı türü, bağlam, malzeme, atmosfer, kamera ve korunacak tasarım kararlarından ayrıntılı prompt hazırla.</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-violet-300">Aracı aç →</span>
          </Link>
        </section>

        <AiWorkflowLibrary />

        <section className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
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
