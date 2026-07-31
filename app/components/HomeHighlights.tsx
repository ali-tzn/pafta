import TrackedHomeLink from "./TrackedHomeLink";

const stages = [
  { number: "01", title: "Araştır", detail: "Emsal ve ihtiyaçları incele", href: "/proje-araclari/emsal-atlasi" },
  { number: "02", title: "Programla", detail: "Alanları ve ilişkileri kur", href: "/proje-araclari/proje-baslangic" },
  { number: "03", title: "Tasarla", detail: "Yerleşim ve çevresel kararları sına", href: "/proje-araclari" },
  { number: "04", title: "Teknikleştir", detail: "Hesap, detay ve malzemeyi kontrol et", href: "/tools" },
  { number: "05", title: "Teslim et", detail: "Paftayı hazırla ve denetle", href: "/teslim-araclari" },
];

const newContent = [
  { title: "Detay Kesit ve U-Değeri Tasarımcısı", href: "/proje-araclari/u-degeri-tasarimcisi", label: "Teknik araç" },
  { title: "Vaziyet Yerleşimi Simülatörü", href: "/proje-araclari/vaziyet-simulatoru", label: "Tasarım aracı" },
  { title: "Mimari Detay Kütüphanesi", href: "/mimari-detaylar", label: "Kütüphane" },
  { title: "Mimarlık AI Araç Bulucu", href: "/mimarlik-yapay-zeka/arac-bulucu", label: "Yapay zekâ" },
];

export default function HomeHighlights() {
  return (
    <>
      <section className="border-y border-slate-800 bg-slate-900/35 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Projen hangi aşamada?
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Bulunduğun aşamadan devam et
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Araçları tek tek aramak yerine proje sürecindeki ihtiyacına göre ilerle.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stages.map((stage) => (
              <TrackedHomeLink
                key={stage.number}
                href={stage.href}
                label={`Proje aşaması: ${stage.title}`}
                className="group relative rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-400/50"
              >
                <span className="text-xs font-bold text-cyan-400">{stage.number}</span>
                <h3 className="mt-4 font-bold group-hover:text-cyan-300">{stage.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{stage.detail}</p>
                <span className="absolute right-4 top-4 text-slate-700 group-hover:text-cyan-300">→</span>
              </TrackedHomeLink>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Keşfet
                </p>
                <h2 className="mt-2 text-2xl font-bold">Yeni ve gelişmiş bölümler</h2>
              </div>
              <TrackedHomeLink
                href="/kutuphaneler"
                label="Tüm kütüphaneler"
                className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Tümünü gör →
              </TrackedHomeLink>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {newContent.map((item) => (
                <TrackedHomeLink
                  key={item.href}
                  href={item.href}
                  label={item.title}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/50"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </span>
                  <h3 className="mt-3 font-bold group-hover:text-cyan-300">{item.title}</h3>
                  <span className="mt-4 inline-block text-sm text-cyan-300">İncele →</span>
                </TrackedHomeLink>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Güvenli çalışma
            </p>
            <h2 className="mt-3 text-2xl font-bold">Dosyan önce sana ait kalır</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Uygun PDF ve görsel araçları işlemleri doğrudan tarayıcıda yapar.
              Üyelik gerekmez; kullandığın aracın dosya işleme yöntemi kendi
              sayfasında ayrıca açıklanır.
            </p>
            <div className="mt-6 grid gap-2 text-sm text-slate-300">
              <span className="rounded-xl bg-slate-950/60 px-4 py-3">✓ Ücretsiz kullanım</span>
              <span className="rounded-xl bg-slate-950/60 px-4 py-3">✓ Üyelik zorunluluğu yok</span>
              <span className="rounded-xl bg-slate-950/60 px-4 py-3">✓ Yerel dosya işleme önceliği</span>
            </div>
            <TrackedHomeLink
              href="/privacy"
              label="Gizlilik politikasını incele"
              className="mt-6 inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Gizlilik politikasını incele →
            </TrackedHomeLink>
          </aside>
        </div>
      </section>
    </>
  );
}
