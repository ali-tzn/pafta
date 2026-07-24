import Link from "next/link";

const pdfTools = [
  {
    title: "PDF Birleştirme",
    description:
      "Birden fazla PDF dosyasını istediğin sırayla tek bir PDF halinde birleştir.",
    href: "/pdf-tools/merge",
    icon: "⧉",
    status: "Hazır",
  },
  {
    title: "PDF Sıkıştırma",
    description:
      "PDF dosyasının boyutunu küçült ve paylaşım için daha uygun hale getir.",
    href: "/pdf-tools/compress",
    icon: "⇲",
    status: "Hazır",
  },
  {
    title: "PDF’den PNG’ye",
    description:
      "PDF sayfalarını ayrı PNG görsellerine dönüştür.",
    href: "/pdf-tools/pdf-to-png",
    icon: "▧",
    status: "Hazır",
  },
  {
    title: "Görsellerden PDF",
    description:
      "PNG ve JPG görsellerini sıralayarak tek bir PDF oluştur.",
    href: "/pdf-tools/images-to-pdf",
    icon: "▤",
    status: "Hazır",
  },
  {
    title: "PDF Sayfalarını Ayır",
    description:
      "PDF içinden belirli sayfaları seçerek yeni bir PDF oluştur.",
    href: "/pdf-tools/split",
    icon: "✂",
    status: "Hazır",
  },
  {
    title: "PDF Sayfalarını Düzenle",
    description:
      "Sayfaları döndür, sil ve farklı bir sıraya yerleştir.",
    href: "/pdf-tools/organize",
    icon: "↕",
    status: "Hazır",
  },
  {
    title: "PDF’e Sayfa Numarası Ekle",
    description:
      "PDF sayfalarına otomatik olarak sayfa numarası yerleştir.",
    href: "/pdf-tools/page-numbers",
    icon: "№",
    status: "Hazır",
  },
  {
    title: "PDF Bilgilerini Görüntüle",
    description:
      "Sayfa sayısı, dosya boyutu ve belge bilgilerini görüntüle.",
    href: "/pdf-tools/info",
    icon: "i",
    status: "Hazır",
  },
  {
  title: "PDF’e Filigran Ekle",
  description:
    "PDF sayfalarına konumu, açısı ve saydamlığı ayarlanabilir filigran ekle.",
  href: "/pdf-tools/watermark",
  icon: "WM",
  status: "Hazır",
  },
];

export default function PdfToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">PDF Araçları</span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Dijital Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF Araçları
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Paftalarını ve teslim dosyalarını birleştir, dönüştür,
            düzenle ve teslim için hazırla.
          </p>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pdfTools.map((tool) => {
            const isReady = tool.status === "Hazır";

            const card = (
              <div
                className={`group h-full rounded-3xl border p-6 transition ${
                  isReady
                    ? "border-slate-800 bg-slate-900 hover:-translate-y-1 hover:border-cyan-400/60"
                    : "border-slate-800 bg-slate-900 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-2xl font-semibold text-cyan-300">
                    {tool.icon}
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      isReady
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                        : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>

                <h2
                  className={`mt-6 text-xl font-semibold transition ${
                    isReady ? "group-hover:text-cyan-400" : ""
                  }`}
                >
                  {tool.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-400">
                  {tool.description}
                </p>

                <p
                  className={`mt-6 font-semibold ${
                    isReady ? "text-cyan-400" : "text-slate-500"
                  }`}
                >
                  {isReady ? "Aracı aç →" : "Yakında"}
                </p>
              </div>
            );

            return isReady ? (
              <Link key={tool.href} href={tool.href}>
                {card}
              </Link>
            ) : (
              <div key={tool.href}>{card}</div>
            );
          })}
        </section>

        <section className="mt-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-7">
          <h2 className="text-xl font-semibold text-cyan-300">
            Gizlilik öncelikli çalışma
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            Uygun olan PDF işlemleri doğrudan tarayıcında çalışır.
            Böylece dosyaların işlem için PAFTA sunucusuna yüklenmez.
            Her aracın sayfasında kullanılan işlem yöntemi ayrıca
            açıklanacaktır.
          </p>
        </section>
      </div>
    </main>
  );
}