import Link from "next/link";

const topics = [
  {
    title: "BIM Nedir?",
    description:
      "BIM’in temel mantığı, mimarlık öğrencileri ve ofis süreçleri için neden önemli olduğu.",
    href: "/bim/bim-nedir",
    status: "Hazır",
  },
  {
    title: "LOD Seviyeleri",
    description:
      "LOD 100, 200, 300, 350 ve 400 seviyelerinin proje sürecindeki karşılıkları.",
    href: "/bim/lod-seviyeleri",
    status: "Hazır",
  },
  {
    title: "BIM Koordinasyonu",
    description:
      "Mimari, statik ve mekanik modellerin çakışma kontrolü ve koordinasyon süreci.",
    href: "/bim/koordinasyon",
    status: "Hazır",
  },
];

export default function BimPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA BIM
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            BIM Rehberleri
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            BIM süreçleri, model koordinasyonu, LOD seviyeleri ve dijital proje
            yönetimi hakkında öğrenci odaklı içerikler.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <article
              key={topic.href}
              className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-cyan-400">
                  BIM
                </span>

                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {topic.status}
                </span>
              </div>

              <h2 className="text-xl font-semibold leading-8">
                {topic.title}
              </h2>

              <p className="mt-3 flex-1 leading-7 text-slate-400">
                {topic.description}
              </p>

              <Link
                href={topic.href}
                className="mt-6 inline-flex font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Rehberi incele →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}