import Link from "next/link";

const categories = [
  {
    title: "Hesap Araçları",
    description:
      "Ölçek, alan, merdiven ve mimari projelerde sık kullanılan hesaplamalar.",
    href: "/tools",
  },
  {
    title: "Öğrenci Araçları",
    description:
      "GNO, ders notu, devamsızlık ve üniversite hayatını kolaylaştıran öğrenci araçları.",
    href: "/student-tools",
  },
  {
    title: "PDF Araçları",
    description:
      "PDF dosyalarını birleştir, sıkıştır, dönüştür, ayır ve teslim için düzenle.",
    href: "/pdf-tools",
  },
  {
    title: "Revit",
    description:
      "Modelleme, malzeme, duvar, family ve D5 Render rehberleri.",
    href: "/revit",
  },
  {
    title: "BIM",
    description:
      "BIM süreçleri, koordinasyon, model yönetimi ve çalışma yöntemleri.",
    href: "/bim",
  },
  {
    title: "Mimarlık Rehberi",
    description:
      "Mimarlık akımları, önemli mimarlar, ikonik yapılar ve temel kavramlar.",
    href: "/mimarlik",
  },
  {
    title: "Kaynaklar",
    description:
      "Mimarlık öğrencileri için dosyalar, bloklar, şablonlar ve yararlı içerikler.",
    href: "/resources",
  },
];

export default function Categories() {
  return (
    <section className="bg-slate-950 px-4 pb-12 pt-2 text-white sm:px-6 sm:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 sm:mb-10">
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl md:text-4xl">
            İhtiyacın olan bölümü keşfet
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-slate-800 sm:rounded-3xl sm:p-6"
            >
              <h3 className="text-xl font-semibold transition group-hover:text-cyan-400">
                {category.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                {category.description}
              </p>

              <span className="mt-6 inline-flex font-semibold text-cyan-400">
                Bölüme git →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
