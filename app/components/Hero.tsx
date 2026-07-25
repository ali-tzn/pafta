import Link from "next/link";

const diagramLinks = [
  ["01", "Hesapla", "Ölçek, alan ve imar", "/tools"],
  ["02", "Düzenle", "PDF ve pafta işlemleri", "/pdf-tools"],
  ["03", "Modelle", "Revit ve BIM", "/revit"],
  ["04", "Araştır", "Rehber ve malzemeler", "/mimarlik"],
];

export default function Hero() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative flex flex-col justify-center border-b border-slate-700 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <span className="absolute left-0 top-10 h-px w-5 bg-cyan-400 sm:w-8" />
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              PAFTA / Dijital Kampüs
            </p>
            <h1 className="mt-5 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">
              Mimarlık üretimin için tek çalışma alanı.
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              Hesap araçlarından PDF düzenlemeye, Revit sorunlarından mimarlık
              kültürüne kadar stüdyoda ihtiyaç duyduğun kaynaklara doğrudan ulaş.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Araçlara başla
              </Link>
              <Link
                href="/rehberler"
                className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                Rehberleri incele
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-800 pt-5 text-xs text-slate-500">
              <span>28+ ücretsiz araç</span>
              <span>100+ rehber başlığı</span>
              <span>Üyelik gerektirmez</span>
            </div>
          </div>

          <div className="relative bg-slate-950 p-5 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-slate-500">ANA ÇALIŞMA ŞEMASI</p>
                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    Bir başlangıç noktası seç
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-xs text-cyan-300">
                  P
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {diagramLinks.map(([number, title, detail, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="group relative min-h-32 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 p-5 transition hover:border-cyan-400/60"
                  >
                    <span className="font-mono text-xs text-cyan-400">{number}</span>
                    <h2 className="mt-4 text-lg font-bold group-hover:text-cyan-300">
                      {title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{detail}</p>
                    <span className="absolute right-4 top-4 text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                      →
                    </span>
                    <span className="absolute -bottom-5 -right-2 font-mono text-6xl font-black text-white/[0.025]">
                      {number}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mx-auto h-5 w-px bg-cyan-400/30" />
              <Link
                href="/mimarlik-yapay-zeka"
                className="group flex items-center justify-between rounded-2xl border border-dashed border-violet-400/35 bg-violet-400/10 px-5 py-4"
              >
                <span>
                  <strong className="text-violet-200">Mimarlık AI Merkezi</strong>
                  <span className="ml-3 text-sm text-slate-500">
                    Araç bulucu + prompt oluşturucu
                  </span>
                </span>
                <span className="text-violet-300 transition group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
