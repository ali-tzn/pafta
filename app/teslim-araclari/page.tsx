import Link from "next/link";

const deliveryTools = [
  {
    title: "Pafta Yerleşim Oluşturucu",
    description:
      "Kâğıt boyutu ve içerik listesine göre dengeli bir grid oluştur; pafta bloklarını düzenle.",
    href: "/proje-araclari/pafta-yerlesimi",
    icon: "▦",
    label: "Yerleşim aracı",
  },
  {
    title: "Jüri Gözü",
    description:
      "Paftanı jüri mesafesinden gör; küçük metinleri, kenar risklerini ve aşırı yoğun bölgeleri baskıdan önce tespit et.",
    href: "/teslim-araclari/juri-gozu",
    icon: "◉",
    label: "Yeni analiz aracı",
  },
  {
    title: "Mimari Teslim Kontrol Merkezi",
    description:
      "PDF, JPG veya PNG paftanı yükle; kâğıt ölçüsü, yön, dosya boyutu, sayfa sayısı, DPI ve dosya adını denetle.",
    href: "/teslim-araclari/kontrol-merkezi",
    icon: "✓",
    label: "Ana araç",
  },
  {
    title: "Teslim Kontrol Listesi",
    description:
      "Pafta, çizim, model ve sunum dosyalarını göndermeden önce adım adım kontrol et.",
    href: "/student-tools/submission-checklist",
    icon: "☑",
    label: "Hazır",
  },
  {
    title: "Dosya Adı Oluşturucu",
    description:
      "Ders, proje, tarih ve revizyon bilgileriyle düzenli teslim dosyası adları oluştur.",
    href: "/student-tools/file-name-generator",
    icon: "Aa",
    label: "Hazır",
  },
  {
    title: "PDF Pafta Boyutu ve Ölçek",
    description:
      "Paftanın kâğıt boyutunu değiştir; içeriği sığdır veya çizim ölçeğini koru.",
    href: "/pdf-tools/resize-pages",
    icon: "↔",
    label: "Düzeltme aracı",
  },
  {
    title: "PDF Sıkıştırma",
    description:
      "Teslim sınırını aşan PDF dosyasını daha küçük hâle getir.",
    href: "/pdf-tools/compress",
    icon: "⇲",
    label: "Düzeltme aracı",
  },
  {
    title: "PDF → PNG / JPG",
    description:
      "PDF paftalarını 96, 150 veya 300 DPI görsellere dönüştür.",
    href: "/pdf-tools/pdf-to-png",
    icon: "▧",
    label: "Dönüştürme",
  },
];

export default function DeliveryToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA / Pafta ve Teslim
          </p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Pafta ve Teslim Araçları
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Pafta ve portfolyonu teknik şartlara göre denetle, sorunları bul
            ve teslimden önce doğru araçla düzelt.
          </p>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {deliveryTools.map((tool, index) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group rounded-3xl border p-6 transition hover:-translate-y-1 hover:border-cyan-400/60 ${
                index < 2
                  ? "border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-slate-900 md:col-span-2"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-xl font-bold text-cyan-300">
                  {tool.icon}
                </span>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {tool.label}
                </span>
              </div>
              <h2 className="mt-6 text-xl font-bold group-hover:text-cyan-300">
                {tool.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-400">{tool.description}</p>
              <p className="mt-6 font-semibold text-cyan-400">Aracı aç →</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
