import TrackedHomeLink from "./TrackedHomeLink";

const paths = [
  { code: "01", title: "Hesap yapmak istiyorum", detail: "Ölçek, emsal, merdiven ve metraj", href: "/tools", icon: "∑" },
  { code: "02", title: "PDF düzenlemek istiyorum", detail: "Birleştir, dönüştür, sıkıştır", href: "/pdf-tools", icon: "▤" },
  { code: "03", title: "Projeye başlıyorum", detail: "Program, ilişki ve yerleşim", href: "/proje-araclari", icon: "◇" },
  { code: "04", title: "Pafta teslim edeceğim", detail: "Kontrol, okunabilirlik ve düzeltme", href: "/teslim-araclari", icon: "✓" },
  { code: "05", title: "Mimari bilgi arıyorum", detail: "Detay, malzeme, Revit ve BIM", href: "/kutuphaneler", icon: "▥" },
  { code: "06", title: "Yapay zekâ aracı arıyorum", detail: "Araç seçimi ve prompt oluşturma", href: "/mimarlik-yapay-zeka", icon: "✦" },
];

export default function Hero() {
  return (
    <section className="px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 sm:p-7 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
              PAFTA / Mimarlık çalışma alanı
            </p>
            <h1 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
              İhtiyacını seç, doğrudan çalışmaya başla.
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-slate-300">
              Mimari hesaplardan PDF işlemlerine, tasarım kararlarından teknik
              bilgiye kadar araç ve kaynaklar tek bir düzen içinde.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2">Ücretsiz araçlar</span>
              <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2">Üyelik gerektirmez</span>
              <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2">Dosyalar cihazında işlenir</span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-300">
              Ne yapmak istiyorsun?
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {paths.map((item) => (
                <TrackedHomeLink
                  key={item.href}
                  href={item.href}
                  label={item.title}
                  className="group flex min-h-20 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3.5 transition hover:border-cyan-400/60 hover:bg-slate-900"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-base font-bold text-cyan-300">
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-white group-hover:text-cyan-300">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {item.detail}
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
