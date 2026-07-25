import Link from "next/link";

const steps = [
  ["01", "Analiz", "/rehberler/proje-yapi-analizi"],
  ["02", "Hesap", "/tools"],
  ["03", "Model", "/revit"],
  ["04", "Pafta", "/pdf-tools"],
  ["05", "Teslim", "/teslim-araclari"],
];

const quickTools = [
  ["Jüri Gözü", "/teslim-araclari/juri-gozu"],
  ["PDF → PNG", "/pdf-tools/pdf-to-png"],
  ["PDF Birleştirme", "/pdf-tools/merge"],
  ["Pafta Ölçeği", "/pdf-tools/resize-pages"],
];

export default function HomeHighlights() {
  return (
    <section className="border-t border-slate-800 bg-slate-900/30 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Proje akışı
          </p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
            {steps.map(([number, label, href], index) => (
              <div key={href} className="flex flex-1 items-center">
                <Link
                  href={href}
                  className="group flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 hover:border-cyan-400/50"
                >
                  <span className="font-mono text-xs text-cyan-400">{number}</span>
                  <span className="font-medium group-hover:text-cyan-300">{label}</span>
                </Link>
                {index < steps.length - 1 && (
                  <span className="hidden px-1 text-slate-700 sm:block">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Hızlı araçlar
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {quickTools.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300"
              >
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
