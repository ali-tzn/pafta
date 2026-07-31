import TrackedHomeLink from "./TrackedHomeLink";

const shortcuts = [
  { title: "Projeye başla", href: "/proje-araclari/proje-baslangic" },
  { title: "Hesap yap", href: "/tools" },
  { title: "PDF düzenle", href: "/pdf-tools" },
] as const;

export default function Hero() {
  return (
    <section className="px-4 pb-9 pt-7 sm:px-6 sm:pb-12 sm:pt-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/60 px-6 py-9 sm:px-9 sm:py-11 lg:px-11">
          <div aria-hidden className="absolute -right-24 -top-40 h-96 w-96 rounded-full bg-cyan-400/[0.06] blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-400">
              Mimarlık için dijital çalışma alanı
            </p>
            <h1 className="mt-4 text-3xl font-black leading-[1.06] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Fikirden teslime,
              <span className="block text-slate-400">ihtiyacın olan her şey.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Mimari hesaplar, proje araçları, PDF işlemleri ve uygulama
              rehberleri. Ücretsiz, üyelik gerektirmeyen ve kolay bulunan tek
              bir çalışma alanı.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {shortcuts.map((item, index) => (
                <TrackedHomeLink
                  key={item.href}
                  href={item.href}
                  label={item.title}
                  className={`rounded-xl px-5 py-3 text-sm font-bold transition ${index === 0 ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300" : "border border-slate-700 bg-slate-950/40 text-slate-200 hover:border-slate-500 hover:bg-slate-900"}`}
                >
                  {item.title}{index === 0 ? " →" : ""}
                </TrackedHomeLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
