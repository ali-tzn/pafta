import Link from "next/link";

export default function BimNedirPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <article className="mx-auto max-w-4xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <Link href="/bim" className="transition hover:text-cyan-400">
            BIM
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">BIM Nedir?</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            BIM Rehberi
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            BIM Nedir?
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            BIM yalnızca üç boyutlu model çizmek değildir. Bir yapıya ait
            geometrik ve teknik bilgilerin ortak bir dijital model üzerinden
            üretilmesi, yönetilmesi ve paylaşılması sürecidir.
          </p>
        </header>

        <section className="mt-10 space-y-8 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              BIM’in açılımı nedir?
            </h2>

            <p className="mt-3">
              BIM, Building Information Modeling yani Yapı Bilgi Modellemesi
              anlamına gelir. Bir binanın yalnızca biçimini değil; malzemesini,
              ölçülerini, katmanlarını, taşıyıcı sistemini ve diğer proje
              bilgilerini de dijital model içinde tutmayı amaçlar.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="font-semibold text-cyan-300">
              BIM ile 3B model arasındaki temel fark
            </p>

            <p className="mt-3">
              Sıradan bir 3B model çoğunlukla yalnızca geometriden oluşur. BIM
              modelindeki duvar, kapı, pencere ve döşeme gibi elemanlar ise
              kendilerine ait bilgi ve parametreleri taşır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              BIM nasıl çalışır?
            </h2>

            <p className="mt-3">
              Projedeki mimari, statik, mekanik ve elektrik modelleri aynı
              süreç içinde koordineli biçimde geliştirilir. Bir elemanda yapılan
              değişiklik; plan, kesit, görünüş, metraj ve paftalara
              yansıtılabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Revit bir BIM programı mıdır?
            </h2>

            <p className="mt-3">
              Evet. Revit, BIM tabanlı proje üretiminde kullanılan
              programlardan biridir. Ancak BIM yalnızca Revit kullanmak
              anlamına gelmez. BIM; yazılımın yanında çalışma yöntemi, bilgi
              yönetimi ve disiplinler arası koordinasyon sürecini de kapsar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Mimarlık öğrencileri için neden önemlidir?
            </h2>

            <p className="mt-3">
              BIM öğrenmek; plan, kesit, görünüş ve üç boyutlu modelin birbiriyle
              bağlantılı biçimde üretilmesini sağlar. Projede yapılan
              değişikliklerin farklı çizimlere aktarılmasını kolaylaştırır ve
              ofis çalışma süreçlerine hazırlık kazandırır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              BIM’in başlıca avantajları
            </h2>

            <ul className="mt-4 space-y-3">
              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                Çizimler ve model arasında daha güçlü tutarlılık sağlar.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                Mimari, statik ve mekanik projelerin koordinasyonunu kolaylaştırır.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                Metraj, mahal listesi ve eleman bilgilerinin modelden
                alınabilmesini sağlar.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                Projedeki olası çakışmaların uygulama öncesinde tespit
                edilmesine yardımcı olur.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              BIM yalnızca büyük projelerde mi kullanılır?
            </h2>

            <p className="mt-3">
              Hayır. Büyük ve karmaşık projelerde avantajları daha belirgin
              olsa da küçük ölçekli projelerde de düzenli modelleme,
              dokümantasyon ve malzeme yönetimi için kullanılabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Sonuç
            </h2>

            <p className="mt-3">
              BIM; yapının tasarımından uygulama ve işletme sürecine kadar
              kullanılan bilgilerin ortak bir dijital model üzerinden
              yönetilmesidir. Bu nedenle yalnızca bir çizim tekniği değil,
              kapsamlı bir proje üretim yöntemidir.
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