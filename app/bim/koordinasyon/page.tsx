import Link from "next/link";

const coordinationSteps = [
  {
    number: "01",
    title: "Modellerin hazırlanması",
    description:
      "Mimari, statik, mekanik ve elektrik modelleri kendi disiplin standartlarına göre hazırlanır.",
  },
  {
    number: "02",
    title: "Ortak koordinat sistemi",
    description:
      "Tüm modellerin aynı konum, kot ve koordinat sisteminde çalışması sağlanır.",
  },
  {
    number: "03",
    title: "Modellerin birleştirilmesi",
    description:
      "Disiplin modelleri federatif bir model içinde bir araya getirilir.",
  },
  {
    number: "04",
    title: "Çakışma kontrolü",
    description:
      "Elemanların fiziksel veya işlevsel olarak birbirleriyle çakışıp çakışmadığı incelenir.",
  },
  {
    number: "05",
    title: "Sorunların çözülmesi",
    description:
      "Tespit edilen problemler ilgili disiplinlere atanır ve model üzerinde düzeltilir.",
  },
];

const clashExamples = [
  "Havalandırma kanalının kiriş içinden geçmesi",
  "Boru hattının kolonla çakışması",
  "Asma tavan içinde tesisat için yeterli boşluk kalmaması",
  "Kapı açılımının sabit bir elemanla kesişmesi",
  "Mekanik şaft ölçülerinin tesisat elemanları için yetersiz olması",
];

export default function BimKoordinasyonuPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <article className="mx-auto max-w-5xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <Link href="/bim" className="transition hover:text-cyan-400">
            BIM
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">BIM Koordinasyonu</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            BIM Rehberi
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            BIM Koordinasyonu Nedir?
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            BIM koordinasyonu; mimari, statik, mekanik ve elektrik modellerinin
            birlikte incelenerek proje sorunlarının uygulamadan önce tespit
            edilmesi ve çözülmesi sürecidir.
          </p>
        </header>

        <section className="mt-10 space-y-10 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Koordinasyon neden gereklidir?
            </h2>

            <p className="mt-3">
              Bir yapının farklı disiplinleri ayrı ekipler tarafından
              geliştirilebilir. Bu modeller tek başlarına doğru görünse bile bir
              araya getirildiklerinde çakışmalar ortaya çıkabilir. BIM
              koordinasyonu bu sorunları şantiyeye ulaşmadan önce görünür hâle
              getirir.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="font-semibold text-cyan-300">
              Temel amaç
            </p>

            <p className="mt-3">
              Koordinasyonun amacı yalnızca çakışma bulmak değil; disiplinler
              arasında uygulanabilir, tutarlı ve ortak bir proje çözümü
              oluşturmaktır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              BIM koordinasyon süreci
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {coordinationSteps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                >
                  <p className="text-sm font-semibold text-cyan-400">
                    {step.number}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Clash detection nedir?
            </h2>

            <p className="mt-3">
              Clash detection, model elemanları arasındaki çakışmaların
              yazılımlar yardımıyla kontrol edilmesidir. Bu kontrol fiziksel
              kesişmelerin yanında bakım alanı, erişim mesafesi ve çalışma
              boşluğu gibi kuralları da kapsayabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Yaygın çakışma örnekleri
            </h2>

            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {clashExamples.map((example) => (
                <li
                  key={example}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  {example}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Hard clash ve soft clash farkı
            </h2>

            <p className="mt-3">
              Hard clash, iki model elemanının fiziksel olarak birbirinin
              içinden geçmesidir. Soft clash ise elemanlar kesişmese bile bakım,
              montaj veya kullanım için gerekli boşluğun sağlanmamasıdır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Revit tek başına yeterli mi?
            </h2>

            <p className="mt-3">
              Revit içinde bağlı modeller üzerinden temel koordinasyon
              yapılabilir. Daha kapsamlı çakışma analizi ve raporlama için
              Navisworks gibi yazılımlar da kullanılabilir. Ancak koordinasyon
              yalnızca yazılım değil, ekipler arası karar ve takip sürecidir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Mimarlık öğrencileri için önemi
            </h2>

            <p className="mt-3">
              BIM koordinasyonunu anlamak, bir mimari kararın taşıyıcı sistem ve
              tesisat üzerindeki etkisini görmeyi sağlar. Bu yaklaşım projeyi
              yalnızca çizim olarak değil, uygulanacak bütüncül bir yapı sistemi
              olarak değerlendirmeye yardımcı olur.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Sonuç
            </h2>

            <p className="mt-3">
              BIM koordinasyonu, farklı disiplin modellerinin ortak bir sistem
              içinde değerlendirilmesini sağlar. Erken tespit edilen
              çakışmalar; zaman kaybını, uygulama hatalarını ve maliyet
              artışlarını azaltabilir.
            </p>
          </div>
        </section>

        <footer className="mt-14 border-t border-slate-800 pt-8">
          <Link
            href="/bim"
            className="inline-flex rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
          >
            ← BIM rehberlerine dön
          </Link>
        </footer>
      </article>
    </main>
  );
}