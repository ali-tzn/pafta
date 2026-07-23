import Link from "next/link";

const lodLevels = [
  {
    level: "LOD 100",
    title: "Kavramsal Seviye",
    description:
      "Elemanlar yaklaşık kütle, alan, hacim veya konum bilgisiyle temsil edilir. Erken tasarım ve yaklaşık analizler için kullanılır.",
  },
  {
    level: "LOD 200",
    title: "Yaklaşık Geometri",
    description:
      "Elemanın yaklaşık boyutu, şekli, konumu ve yönü belirlenmiştir. Ancak üretim veya uygulama için yeterli ayrıntıda değildir.",
  },
  {
    level: "LOD 300",
    title: "Doğru Geometri",
    description:
      "Elemanın boyutu, şekli, konumu ve yönü doğru şekilde modellenir. Proje dokümantasyonu ve koordinasyon için kullanılabilir.",
  },
  {
    level: "LOD 350",
    title: "Bağlantılar ve İlişkiler",
    description:
      "Elemanın diğer yapı elemanlarıyla bağlantıları, birleşimleri ve arayüzleri de model içinde gösterilir.",
  },
  {
    level: "LOD 400",
    title: "Üretim ve Montaj",
    description:
      "Eleman; üretim, imalat, montaj ve detaylandırma için gerekli bilgileri içerecek seviyede modellenir.",
  },
  {
    level: "LOD 500",
    title: "Mevcut Durum",
    description:
      "Sahada uygulanmış ve doğrulanmış elemanların mevcut durum bilgilerini temsil eder. İşletme ve bakım süreçlerinde kullanılabilir.",
  },
];

export default function LodSeviyeleriPage() {
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

          <span className="text-slate-200">LOD Seviyeleri</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            BIM Rehberi
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            BIM’de LOD Seviyeleri Nedir?
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            LOD seviyeleri, modeldeki bir elemanın hangi ayrıntı ve güvenilirlik
            düzeyinde geliştirildiğini ifade eder. Yalnızca modelin ne kadar
            detaylı göründüğünü değil, içindeki bilginin hangi amaçla
            kullanılabileceğini de açıklar.
          </p>
        </header>

        <section className="mt-10 space-y-8 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              LOD ne anlama gelir?
            </h2>

            <p className="mt-3">
              LOD çoğunlukla Level of Development, yani Gelişim Seviyesi
              anlamında kullanılır. Model elemanının geometrisinin ve
              bilgilerinin proje sürecinde ne kadar geliştirildiğini gösterir.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="font-semibold text-cyan-300">
              Önemli ayrım
            </p>

            <p className="mt-3">
              LOD yalnızca görsel detay seviyesi değildir. Çok ayrıntılı görünen
              bir model elemanı, güvenilir ölçü veya üretim bilgisi içermiyorsa
              yüksek LOD seviyesinde kabul edilmeyebilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              LOD seviyeleri
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {lodLevels.map((item) => (
                <div
                  key={item.level}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                >
                  <p className="text-sm font-semibold text-cyan-400">
                    {item.level}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              LOD 300 ile LOD 350 arasındaki fark
            </h2>

            <p className="mt-3">
              LOD 300 seviyesinde elemanın kendi geometrisi doğru kabul edilir.
              LOD 350 seviyesinde ise bu elemanın diğer elemanlarla bağlantıları
              ve birleşim ilişkileri de gösterilir. Örneğin bir duvarın döşeme,
              kolon veya cephe sistemiyle nasıl birleştiği daha belirgin hâle
              gelir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Her eleman aynı LOD seviyesinde olmak zorunda mı?
            </h2>

            <p className="mt-3">
              Hayır. Aynı proje içindeki farklı elemanlar farklı LOD
              seviyelerinde olabilir. Projenin amacı, teslim aşaması ve
              disiplinlerin ihtiyaçları hangi elemanın ne kadar geliştirilmesi
              gerektiğini belirler.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Mimarlık öğrencileri LOD seviyelerini neden bilmeli?
            </h2>

            <p className="mt-3">
              LOD kavramı, modelin hangi aşamada ne kadar detaylandırılması
              gerektiğini anlamayı kolaylaştırır. Böylece erken tasarım
              aşamasında gereksiz ayrıntıya girilmez, uygulama aşamasında ise
              gerekli bilgi eksik bırakılmaz.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Sonuç
            </h2>

            <p className="mt-3">
              LOD seviyeleri, BIM modelindeki elemanların hangi amaçla ve ne
              kadar güvenilir biçimde kullanılabileceğini tanımlar. Doğru LOD
              seçimi; zaman yönetimi, koordinasyon ve proje kalitesi açısından
              önemlidir.
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