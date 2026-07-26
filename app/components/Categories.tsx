import TrackedHomeLink from "./TrackedHomeLink";

const mainSections = [
  { title: "Tasarım ve Proje", href: "/proje-araclari", icon: "◇", detail: "Program, yerleşim ve tasarım kararları" },
  { title: "Teknik ve Hesap", href: "/tools", icon: "∑", detail: "Ölçek, imar, yapı ve metraj hesapları" },
  { title: "PDF ve Dosya", href: "/pdf-tools", icon: "▤", detail: "Birleştirme, dönüştürme ve düzenleme" },
  { title: "Pafta ve Teslim", href: "/teslim-araclari", icon: "✓", detail: "Sunum, kontrol ve teslim hazırlığı" },
  { title: "Bilgi Kütüphaneleri", href: "/kutuphaneler", icon: "▥", detail: "Detay, malzeme, Revit, BIM ve kültür" },
  { title: "Öğrenci ve AI", href: "/student-tools", icon: "✦", detail: "Okul, planlama ve yapay zekâ araçları" },
];

const popularTools = [
  { title: "PDF Birleştirme", detail: "Dosyaları sırala ve tek PDF indir", href: "/pdf-tools/merge", icon: "⧉", group: "PDF" },
  { title: "PDF → PNG / JPG", detail: "Paftayı 96, 150 veya 300 DPI dönüştür", href: "/pdf-tools/pdf-to-png", icon: "▧", group: "PDF" },
  { title: "TAKS–KAKS / Emsal", detail: "Taban oturumu ve emsal alanını hesapla", href: "/tools/taks-kaks", icon: "m²", group: "İmar" },
  { title: "Ölçek Hesaplama", detail: "Gerçek ölçüyü çizim ölçüsüne dönüştür", href: "/tools/scale-calculator", icon: "1:n", group: "Hesap" },
  { title: "Proje Başlangıç Merkezi", detail: "Program, alan ve komşuluk önerisi üret", href: "/proje-araclari/proje-baslangic", icon: "◇", group: "Tasarım" },
  { title: "Jüri Gözü", detail: "Pafta okunabilirliğini uzaktan sınayarak kontrol et", href: "/teslim-araclari/juri-gozu", icon: "◉", group: "Teslim" },
];

export default function Categories() {
  return (
    <section className="px-4 pb-9 pt-4 text-white sm:px-6 sm:pb-11 sm:pt-5">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Ana menü
            </p>
            <h2 className="mt-1.5 text-xl font-bold sm:text-2xl">
              Tüm bölümler
            </h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">
            Aradığın içerik türüne doğrudan geç.
          </p>
        </div>

        <nav aria-label="Ana sayfa bölüm kısayolları" className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {mainSections.map((section) => (
            <TrackedHomeLink
              key={section.href}
              href={section.href}
              label={`Ana bölüm: ${section.title}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3.5 transition hover:border-cyan-400/50 hover:bg-slate-900/80"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 font-bold text-cyan-300">
                {section.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-white group-hover:text-cyan-300">
                  {section.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {section.detail}
                </span>
              </span>
              <span className="ml-auto text-slate-600 group-hover:text-cyan-300">→</span>
            </TrackedHomeLink>
          ))}
        </nav>

        <div className="mt-9 flex flex-col justify-between gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Hızlı erişim
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              En çok kullanılan araçlar
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            En sık yapılan işlemlere ana sayfadan tek adımda ulaş.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((tool) => (
            <TrackedHomeLink
              key={tool.href}
              href={tool.href}
              label={tool.title}
              className="group flex min-h-32 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-4.5 transition hover:-translate-y-0.5 hover:border-cyan-400/50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-slate-950 px-2 text-sm font-bold text-cyan-300">
                  {tool.icon}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {tool.group}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-cyan-300">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{tool.detail}</p>
              <span className="mt-auto pt-4 text-sm font-semibold text-cyan-300">
                Aracı aç →
              </span>
            </TrackedHomeLink>
          ))}
        </div>
      </div>
    </section>
  );
}
