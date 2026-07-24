import Link from "next/link";

export default function WallSweepGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-400">
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <Link href="/revit" className="hover:text-cyan-400">
            Revit
          </Link>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Revit Rehberi
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          Revit’te Wall Sweep Neden Seçilemiyor?
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          Wall Sweep komutunun pasif görünmesinin en yaygın nedenlerini ve doğru
          kullanım yöntemlerini inceleyelim.
        </p>

        <section className="mt-10 space-y-8 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              1. Uygun bir duvar seçili olmayabilir
            </h2>

            <p className="mt-3">
              Wall Sweep komutu genellikle bir duvar elemanı seçildiğinde veya
              duvar tipi düzenlenirken kullanılabilir. Kolon, döşeme veya family
              gibi başka bir eleman seçiliyse komut pasif görünebilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              2. Curtain Wall seçili olabilir
            </h2>

            <p className="mt-3">
              Curtain Wall sistemleri klasik duvarlardan farklı çalışır.
              Bu nedenle Wall Sweep her durumda kullanılamaz. Önce seçili
              elemanın Basic Wall olduğundan emin ol.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              3. Yanlış görünüşte çalışıyor olabilirsin
            </h2>

            <p className="mt-3">
              Plan görünüşünde sweep yerleşimi zorlaşabilir. Cephe, kesit veya
              3B görünüşte çalışmak genellikle daha kontrollü sonuç verir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              4. Duvar tipi düzenleme yöntemi gerekebilir
            </h2>

            <p className="mt-3">
              Bazı durumlarda Architecture sekmesindeki bağımsız Wall Sweep
              yerine duvar tipini düzenleyip Structure bölümündeki Sweeps
              seçeneğini kullanmak gerekir. Bu yöntem sweep elemanını duvar
              tipinin kalıcı bir parçası yapar.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="font-semibold text-cyan-300">
              Önemli not
            </p>

            <p className="mt-3">
              Wall Sweep; süpürgelik, silme, kuşak ve profil gibi çizgisel
              elemanlar içindir. Bir yüzeyin tamamına sıva veya kaplama eklemek
              için genellikle ince bir finish duvar kullanmak daha doğrudur.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Sonuç
            </h2>

            <p className="mt-3">
              Komut pasifse önce seçili elemanın Basic Wall olup olmadığını,
              görünüş türünü ve doğru Wall Sweep yöntemini kullandığını kontrol
              et. Yüzey kaplaması için ise sweep yerine ayrı bir finish katmanı
              düşün.
            </p>
          </div>
        </section>

        <Link
          href="/revit"
          className="mt-12 inline-flex rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400 hover:text-cyan-400"
        >
          ← Revit rehberlerine dön
        </Link>
      </article>
    </main>
  );
}