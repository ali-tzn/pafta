import Link from "next/link";

export default function RevitKolonSivaPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
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
          Revit’te Kolonun Açıkta Kalan Yüzeyine Sıva Nasıl Eklenir?
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          Kolonun açıkta kalan yüzeyine sıva eklemek için en kontrollü yöntem,
          ince bir finish duvar tipi oluşturmaktır.
        </p>

        <section className="mt-10 space-y-8 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              1. İnce bir sıva duvar tipi oluştur
            </h2>

            <p className="mt-3">
              Mevcut bir duvar tipini Duplicate ile çoğalt. Edit Structure
              bölümünde taşıyıcı katmanları kaldır ve yalnızca 10–20 mm
              kalınlığında bir Finish katmanı bırak.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              2. Kolon yüzeyine hizala
            </h2>

            <p className="mt-3">
              Yeni ince duvarı kolonun açıkta kalan yüzeyi boyunca çiz.
              Location Line ayarını uygun finish yüzeyine getirerek sıvayı
              kolona oturt.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              3. Finish malzemesi ata
            </h2>

            <p className="mt-3">
              Hazır plaster malzemesi yoksa yeni bir malzeme oluştur ve bu
              malzemeyi duvarın Finish katmanına ata.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Wall Sweep neden uygun değil?
            </h2>

            <p className="mt-3">
              Wall Sweep daha çok süpürgelik, silme ve profil gibi duvar boyunca
              devam eden elemanlar içindir. Tüm yüzeyi kaplayan sıva için ince
              duvar yöntemi daha uygundur.
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