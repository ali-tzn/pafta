import TrackedHomeLink from "./TrackedHomeLink";

const quickActions = [
  {
    title: "Hesap yapmak istiyorum",
    detail: "Ölçek, emsal, merdiven ve metraj",
    href: "/tools",
    icon: "∑",
  },
  {
    title: "PDF düzenlemek istiyorum",
    detail: "Birleştir, dönüştür, sıkıştır",
    href: "/pdf-tools",
    icon: "▤",
  },
  {
    title: "Projeye başlıyorum",
    detail: "Program, ilişki ve yerleşim",
    href: "/proje-araclari",
    icon: "◇",
  },
  {
    title: "Pafta teslim edeceğim",
    detail: "Kontrol, okunabilirlik ve düzeltme",
    href: "/teslim-araclari",
    icon: "✓",
  },
  {
    title: "Mimari bilgi arıyorum",
    detail: "Detay, malzeme, Revit ve BIM",
    href: "/kutuphaneler",
    icon: "◫",
  },
  {
    title: "Yapay zekâ aracı arıyorum",
    detail: "Araç seçimi ve prompt oluşturma",
    href: "/mimarlik-yapay-zeka",
    icon: "✦",
  },
] as const;

export default function Hero() {
  return (
    <section className="px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-800 bg-slate-900/55 px-5 py-7 sm:px-8 sm:py-8">
        <div className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400">
              PAFTA / Mimarlık çalışma alanı
            </p>
            <h1 className="mt-4 max-w-xl text-[clamp(2.25rem,4vw,3.55rem)] font-black leading-[1.02] tracking-[-0.045em] text-white">
              İhtiyacını seç, doğrudan çalışmaya başla.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Mimari hesaplardan PDF işlemlerine, tasarım kararlarından teknik
              bilgiye kadar araç ve kaynaklar tek bir düzen içinde.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-slate-400">
              <span className="rounded-full border border-slate-700 px-3 py-2">
                Ücretsiz araçlar
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-2">
                Üyelik gerektirmez
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-2">
                Dosyalar cihazında işlenir
              </span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold text-slate-300">
              Ne yapmak istiyorsun?
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {quickActions.map((action) => (
                <TrackedHomeLink
                  key={action.href}
                  href={action.href}
                  label={action.title}
                  className="group flex min-h-[5rem] items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/75 p-3.5 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-slate-950"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-base font-black text-cyan-400">
                    {action.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-white sm:text-base">
                      {action.title}
                    </span>
                    <span className="mt-1 block text-xs leading-4 text-slate-500">
                      {action.detail}
                    </span>
                  </span>
                  <span className="ml-auto text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300">
                    →
                  </span>
                </TrackedHomeLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
