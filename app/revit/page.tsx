import Link from "next/link";

const articles = [
  {
    title: "Revit’te Kolon Yüzeyine Sıva Nasıl Eklenir?",
    description:
      "Duvar uzatmadan, kolonun açıkta kalan yüzeyine doğru ve profesyonel yöntemlerle sıva ekleme.",
    href: "/revit/kolon-yuzeyine-siva-ekleme",
    status: "Hazır",
  },
  {
    title: "Revit Wall Sweep Neden Seçilemiyor?",
    description:
      "Wall Sweep komutunun pasif görünmesinin nedenleri ve uygulanabilecek çözümler.",
    href: "/revit/wall-sweep-neden-secilmiyor",
    status: "Hazır",
  },
  {
    title: "Revit’ten D5 Render’a Malzeme Aktarma",
    description:
      "Revit malzemelerinin D5 Render içinde doğru şekilde ayrılması ve görünmesi.",
    href: "/revit/d5-render-malzeme-aktarma",
    status: "Yakında",
  },
];

export default function RevitPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Revit
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Revit Rehberleri
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Revit modelleme, malzeme, duvar, family, görünüş ve D5 Render
            entegrasyonu hakkında öğrenci odaklı rehberler.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.href}
              className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-cyan-400">
                  Revit
                </span>

                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {article.status}
                </span>
              </div>

              <h2 className="text-xl font-semibold leading-8">
                {article.title}
              </h2>

              <p className="mt-3 flex-1 leading-7 text-slate-400">
                {article.description}
              </p>

              <Link
                href={article.href}
                className="mt-6 inline-flex font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Rehberi incele →
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8">
          <h2 className="text-2xl font-semibold">
            Revit’te takıldığın bir konu mu var?
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            PAFTA’da duvar katmanları, sıva çözümleri, family kaynakları,
            malzeme atama ve render aktarımı gibi gerçek proje sorunlarına
            yönelik içerikler yayınlanacak.
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