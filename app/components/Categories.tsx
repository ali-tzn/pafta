import Link from "next/link";

const spaces = [
  {
    code: "A-01",
    title: "Hesap Araçları",
    description: "TAKS–KAKS, ölçek, merdiven, beton, rampa ve uygulama hesapları.",
    href: "/tools",
    detail: "12 araç",
    className: "md:col-span-2",
  },
  {
    code: "A-02",
    title: "PDF Araçları",
    description: "Birleştir, sıkıştır, dönüştür, ayır ve paftanı ölçeklendir.",
    href: "/pdf-tools",
    detail: "10 araç",
    className: "",
  },
  {
    code: "B-01",
    title: "Revit Merkezi",
    description: "Gerçek proje sorunları için adım adım Revit çözümleri.",
    href: "/revit",
    detail: "26 rehber",
    className: "",
  },
  {
    code: "B-02",
    title: "BIM Merkezi",
    description: "LOD, IFC, koordinasyon ve model yönetimi.",
    href: "/bim",
    detail: "26 rehber",
    className: "",
  },
  {
    code: "B-03",
    title: "Yapı Malzemeleri",
    description: "27 malzemeyi özellikleriyle incele ve karşılaştır.",
    href: "/yapi-malzemeleri",
    detail: "7 kategori",
    className: "",
  },
  {
    code: "C-01",
    title: "Mimarlık Rehberi",
    description: "Akımlar, kavramlar, mimarlar ve ikonik yapılar.",
    href: "/mimarlik",
    detail: "17 içerik",
    className: "",
  },
  {
    code: "C-02",
    title: "Proje Rehberleri",
    description: "Çizimden jüriye, proje sürecinin temel başlıkları.",
    href: "/rehberler",
    detail: "70 başlık",
    className: "md:col-span-2",
  },
  {
    code: "C-03",
    title: "Öğrenci Araçları",
    description: "GNO, ders notu, devamsızlık ve öğrenci takvimi.",
    href: "/student-tools",
    detail: "6 araç",
    className: "",
  },
  {
    code: "D-01",
    title: "Teslim Araçları",
    description: "Pafta ve portfolyonu kontrol et, teknik sorunları teslimden önce düzelt.",
    href: "/teslim-araclari",
    detail: "Kontrol + düzeltme",
    className: "md:col-span-2",
  },
];

export default function Categories() {
  return (
    <section className="px-4 py-12 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              PAFTA / Bölüm Planı
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Çalışma alanını seç
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Her bölüm kendi araçları, içerikleri ve rehberleriyle ayrı bir
            çalışma alanı olarak düzenlendi.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {spaces.map((space) => (
            <Link
              key={space.href}
              href={space.href}
              className={`group relative min-h-44 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400/50 ${space.className}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-400">{space.code}</span>
                <span className="text-xs text-slate-500">{space.detail}</span>
              </div>
              <h3 className="mt-7 text-xl font-bold group-hover:text-cyan-300">
                {space.title}
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                {space.description}
              </p>
              <span className="absolute bottom-5 right-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                →
              </span>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
