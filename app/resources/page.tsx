import Link from "next/link";

const resources = [
  {
    title: "Revit Family Kaynakları",
    description:
      "Kapı, pencere, mobilya ve mimari elemanlar için güvenilir family kaynakları.",
    href: "/resources/revit-family-kaynaklari",
    status: "Hazır",
  },
  {
    title: "CAD Blok Kaynakları",
    description:
      "Plan, kesit ve görünüşlerde kullanılabilecek ücretsiz CAD blok siteleri.",
    href: "/resources/cad-blok-kaynaklari",
    status: "Hazır",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Kaynaklar
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Mimarlık Kaynakları
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Mimarlık öğrencileri için Revit family, CAD blok, yazılım ve proje
            üretim kaynakları.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={resource.href}
              className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-cyan-400">
                  Kaynak
                </span>

                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {resource.status}
                </span>
              </div>

              <h2 className="text-xl font-semibold leading-8">
                {resource.title}
              </h2>

              <p className="mt-3 flex-1 leading-7 text-slate-400">
                {resource.description}
              </p>

              <Link
                href={resource.href}
                className="mt-6 inline-flex font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Kaynağı incele →
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
          <h2 className="text-2xl font-semibold">
            Yeni kaynaklar düzenli olarak eklenecek
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            Family, blok, şablon, doku, yazılım ve öğrenci araçları bu bölümde
            düzenli şekilde kategorize edilecek.
          </p>

          <Link
            href="/tools"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Hesap araçlarına git
          </Link>
        </section>
      </div>
    </main>
  );
}