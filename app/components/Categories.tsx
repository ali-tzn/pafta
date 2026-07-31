import TrackedHomeLink from "./TrackedHomeLink";

const sections = [
  { title: "Proje Geliştirme", detail: "Program, yerleşim ve tasarım", href: "/proje-araclari", mark: "01" },
  { title: "Hesap Araçları", detail: "Ölçek, emsal ve metraj", href: "/tools", mark: "02" },
  { title: "PDF Araçları", detail: "Birleştir, dönüştür, düzenle", href: "/pdf-tools", mark: "03" },
  { title: "Jüri ve Teslim", detail: "Kontrol ve sunum hazırlığı", href: "/teslim-araclari", mark: "04" },
  { title: "Detay ve Malzemeler", detail: "Kesitler ve malzeme bilgisi", href: "/kutuphaneler", mark: "05" },
  { title: "Uygulama Rehberi", detail: "Revit, CAD, Rhino ve BIM", href: "/rehberler", mark: "06" },
  { title: "Mimarlık Kültürü", detail: "Akımlar, mimarlar ve yapılar", href: "/mimarlik", mark: "07" },
  { title: "Öğrenci Araçları", detail: "Not, takvim ve okul düzeni", href: "/student-tools", mark: "08" },
  { title: "Mimari AI", detail: "AI seçimi ve prompt araçları", href: "/mimarlik-yapay-zeka", mark: "09" },
] as const;

const popular = [
  { title: "PDF Birleştirme", href: "/pdf-tools/merge", label: "PDF" },
  { title: "TAKS–KAKS Hesabı", href: "/tools/taks-kaks", label: "İMAR" },
  { title: "Jüri Gözü", href: "/teslim-araclari/juri-gozu", label: "TESLİM" },
  { title: "Detay Kesit ve U-Değeri", href: "/proje-araclari/u-degeri-tasarimcisi", label: "TEKNİK" },
] as const;

export default function Categories() {
  return (
    <section id="bolumler" className="scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6 border-b border-slate-800 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-400">Kategoriler</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Nereye gitmek istiyorsun?</h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">9 ana bölüm</p>
        </div>

        <nav aria-label="PAFTA ana bölümleri" className="grid sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <TrackedHomeLink
              key={section.href}
              href={section.href}
              label={section.title}
              className="group flex min-h-28 items-start gap-4 border-b border-slate-800 px-1 py-6 transition sm:px-5 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-child(3n+1)]:pl-1 lg:[&:nth-child(3n)]:pr-1"
            >
              <span className="mt-0.5 text-xs font-bold text-slate-600 transition group-hover:text-cyan-400">{section.mark}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-slate-100 transition group-hover:text-cyan-300 sm:text-lg">{section.title}</span>
                <span className="mt-1.5 block text-sm text-slate-500">{section.detail}</span>
              </span>
              <span className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-400">→</span>
            </TrackedHomeLink>
          ))}
        </nav>

        <div className="mt-14">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Sık kullanılanlar</h2>
            <span className="text-xs text-slate-600">Tek tıkla başla</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((item) => (
              <TrackedHomeLink key={item.href} href={item.href} label={item.title} className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/45 px-4 py-3.5 transition hover:border-cyan-400/35 hover:bg-slate-900">
                <span className="text-[9px] font-black tracking-wider text-cyan-500">{item.label}</span>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white">{item.title}</span>
                <span className="ml-auto text-slate-700 group-hover:text-cyan-400">→</span>
              </TrackedHomeLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
