import TrackedHomeLink from "./TrackedHomeLink";

const sections = [
  {
    title: "Proje Geliştirme",
    detail: "Program, yerleşim ve tasarım kararları",
    href: "/proje-araclari",
    icon: "◇",
  },
  {
    title: "Hesap Araçları",
    detail: "Ölçek, emsal, alan ve yapı hesapları",
    href: "/tools",
    icon: "∑",
  },
  {
    title: "PDF Araçları",
    detail: "Dönüştürme, birleştirme ve düzenleme",
    href: "/pdf-tools",
    icon: "▤",
  },
  {
    title: "Jüri ve Teslim Araçları",
    detail: "Sunum, kontrol ve teslim hazırlığı",
    href: "/teslim-araclari",
    icon: "✓",
  },
  {
    title: "Mimari Detay ve Malzemeler",
    detail: "Detay kesitleri ve yapı malzemeleri",
    href: "/kutuphaneler",
    icon: "◫",
  },
  {
    title: "Mimari Uygulama Rehberi",
    detail: "Revit, BIM ve uygulama çözümleri",
    href: "/rehberler",
    icon: "R",
  },
  {
    title: "Mimarlık Kültürü Rehberi",
    detail: "Akımlar, kavramlar, mimarlar ve yapılar",
    href: "/mimarlik",
    icon: "M",
  },
  {
    title: "Öğrenci Araçları",
    detail: "Not, devamsızlık, takvim ve okul düzeni",
    href: "/student-tools",
    icon: "Ö",
  },
  {
    title: "Mimari AI",
    detail: "Yapay zekâ araçları ve prompt yardımcıları",
    href: "/mimarlik-yapay-zeka",
    icon: "✦",
  },
] as const;

const popularTools = [
  {
    title: "PDF Birleştirme",
    detail: "Dosyalarını sırala ve tek PDF olarak indir.",
    href: "/pdf-tools/merge",
    label: "PDF",
  },
  {
    title: "Jüri Gözü",
    detail: "Paftanın uzaktan okunabilirliğini değerlendir.",
    href: "/teslim-araclari/juri-gozu",
    label: "JÜRİ",
  },
  {
    title: "TAKS–KAKS",
    detail: "Oturum ve emsale esas inşaat alanını hesapla.",
    href: "/tools/taks-kaks",
    label: "İMAR",
  },
  {
    title: "Proje Başlangıç Merkezi",
    detail: "Yapı türüne göre ihtiyaç programını oluştur.",
    href: "/proje-araclari/proje-baslangic",
    label: "PROJE",
  },
] as const;

export default function Categories() {
  return (
    <>
      <section
        id="bolumler"
        className="scroll-mt-28 px-4 pb-8 pt-3 text-white sm:px-6 sm:pb-10 sm:pt-4"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
                Ana menü
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Tüm bölümler
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Aradığın içerik türüne doğrudan geç.
            </p>
          </div>

          <nav
            aria-label="PAFTA ana bölümleri"
            className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sections.map((section) => (
              <TrackedHomeLink
                key={section.href}
                href={section.href}
                label={section.title}
                className="group flex min-h-[4.55rem] items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3.5 transition hover:border-cyan-400/40 hover:bg-slate-800/90"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-cyan-400">
                  {section.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white transition group-hover:text-cyan-300 sm:text-base">
                    {section.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {section.detail}
                  </span>
                </span>
                <span className="ml-auto text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300">
                  →
                </span>
              </TrackedHomeLink>
            ))}
          </nav>

          <div className="mt-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
                Hızlı erişim
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                En çok kullanılan araçlar
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Günlük işlemlere tek adımda ulaş.
            </p>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {popularTools.map((tool) => (
              <TrackedHomeLink
                key={tool.href}
                href={tool.href}
                label={tool.title}
                className="group flex min-h-[4.5rem] items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 transition hover:border-cyan-400/40 hover:bg-slate-900"
              >
                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-cyan-400/10 px-2 text-[9px] font-black tracking-wider text-cyan-400">
                  {tool.label}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white group-hover:text-cyan-300">
                    {tool.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {tool.detail}
                  </span>
                </span>
                <span className="ml-auto text-slate-600 transition group-hover:text-cyan-300">
                  →
                </span>
              </TrackedHomeLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
