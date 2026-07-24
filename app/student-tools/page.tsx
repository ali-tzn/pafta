import Link from "next/link";

const studentTools = [
  {
    title: "GNO Hesaplayıcı",
    description:
      "Ders kredileri ve harf notlarına göre genel not ortalamanı hesapla.",
    href: "/student-tools/gno-calculator",
    status: "Hazır",
  },
  {
    title: "Ders Notu Hesaplayıcı",
    description:
      "Vize, final, ödev ve proje yüzdelerine göre dönem sonu notunu hesapla.",
    href: "/student-tools/grade-calculator",
    status: "Hazır",
  },
  {
  title: "Öğrenci Takvimi",
  description:
    "Teslim, sınav ve jüri tarihlerini kaydet; etkinlik yaklaşmadan önce uyarı al.",
  href: "/student-tools/calendar",
  status: "Hazır",
  },
  {
    title: "Teslim Kontrol Listesi",
    description:
      "Pafta, çizim, model, sunum ve teslim dosyalarını göndermeden önce kontrol et.",
    href: "/student-tools/submission-checklist",
    status: "Hazır",
    icon: "✓",
  },
  {
    title: "Dosya Adı Oluşturucu",
    description:
      "Ders, proje, teslim tarihi ve revizyon bilgileriyle düzenli dosya adları oluştur.",
    href: "/student-tools/file-name-generator",
    status: "Hazır",
    icon: "Aa",
  },
  {
    title: "Devamsızlık Hesaplayıcı",
    description:
      "Toplam ders saati ve katılım durumuna göre kalan devamsızlık hakkını gör.",
    href: "/student-tools/attendance-calculator",
    status: "Hazır",
  },
];

export default function StudentToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Öğrenci
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Öğrenci Araçları
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Üniversite hayatını kolaylaştıran not, ortalama, devamsızlık ve
            planlama araçları.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {studentTools.map((tool) => (
            <article
              key={tool.href}
              className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-cyan-400">
                  Öğrenci Aracı
                </span>

                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {tool.status}
                </span>
              </div>

              <h2 className="text-xl font-semibold leading-8">
                {tool.title}
              </h2>

              <p className="mt-3 flex-1 leading-7 text-slate-400">
                {tool.description}
              </p>

              <Link
                href={tool.href}
                className="mt-6 inline-flex font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Aracı aç →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}