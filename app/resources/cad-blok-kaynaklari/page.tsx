import Link from "next/link";

const cadSources = [
  {
    name: "Bibliocad",
    description:
      "Plan, kesit, görünüş, detay ve çeşitli mimari çizimler için geniş bir DWG arşivi sunar.",
    note: "İçerik kalitesi dosyaya göre değişebilir",
  },
  {
    name: "CADdetails",
    description:
      "Üretici ürünleri, teknik detaylar ve indirilebilir CAD çizimleri içerir.",
    note: "Ürün ve teknik detay arayanlar için",
  },
  {
    name: "Archweb",
    description:
      "Mimari plan, kesit, tefriş, detay ve kentsel tasarım blokları sunar.",
    note: "Mimarlık öğrencileri arasında yaygın",
  },
  {
    name: "DWGFree",
    description:
      "Mobilya, insan, araç, bitki ve çeşitli mimari blok kategorileri içerir.",
    note: "Hızlı tefriş aramaları için",
  },
  {
    name: "Üretici web siteleri",
    description:
      "Kapı, pencere, mutfak, banyo ve yapı ürünleri için teknik DWG dosyaları bulunabilir.",
    note: "Gerçek ürün ölçüleri için daha güvenilir",
  },
];

export default function CadBlokKaynaklariPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <article className="mx-auto max-w-5xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <Link href="/resources" className="transition hover:text-cyan-400">
            Kaynaklar
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">CAD Blok Kaynakları</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Kaynak Rehberi
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Ücretsiz CAD Blokları Nereden İndirilir?
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Plan, kesit ve görünüşlerde kullanabileceğin tefriş, insan, araç,
            bitki ve teknik detay bloklarını bulabileceğin kaynakları
            inceleyelim.
          </p>
        </header>

        <section className="mt-10 space-y-10 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              CAD blok nedir?
            </h2>

            <p className="mt-3">
              CAD blokları; mobilya, insan, araç, bitki, kapı, pencere ve teknik
              detay gibi tekrar kullanılabilen çizim elemanlarıdır. Genellikle
              DWG veya DXF formatında paylaşılır.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="font-semibold text-cyan-300">
              Dosya formatları
            </p>

            <p className="mt-3">
              AutoCAD çizimleri çoğunlukla <strong>.dwg</strong> uzantılıdır.
              Daha genel veri alışverişi için <strong>.dxf</strong> formatı da
              kullanılabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Kullanılabilecek CAD blok kaynakları
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {cadSources.map((source) => (
                <div
                  key={source.name}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {source.name}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {source.description}
                  </p>

                  <p className="mt-4 text-sm font-medium text-cyan-400">
                    {source.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Blok indirirken nelere dikkat edilmeli?
            </h2>

            <ul className="mt-5 space-y-4">
              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                Çizimin birimini kontrol et. Milimetre, santimetre veya metre
                farkı paftada ciddi ölçek sorunları oluşturabilir.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                Gereksiz katmanları, hatch alanlarını ve karmaşık çizgileri
                temizle.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                Blokların ölçülerinin gerçekçi olup olmadığını kontrol et.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                İndirdiğin çizimi doğrudan ana projeye eklemek yerine önce boş
                bir dosyada açıp incele.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              AutoCAD’e blok nasıl eklenir?
            </h2>

            <p className="mt-3">
              Blok dosyasını ayrı bir AutoCAD penceresinde açıp kopyalayabilir
              veya Insert komutuyla doğrudan projeye ekleyebilirsin. Ekledikten
              sonra ölçek, katman ve çizgi tiplerini kontrol etmen gerekir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Çok detaylı bloklar neden sorun olabilir?
            </h2>

            <p className="mt-3">
              Fazla sayıda çizgi, hatch ve spline içeren bloklar dosyayı
              ağırlaştırabilir. Özellikle büyük projelerde sade ve temiz bloklar
              kullanmak performansı artırır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Sonuç
            </h2>

            <p className="mt-3">
              CAD blok seçerken yalnızca görsel kaliteye değil; ölçek, dosya
              temizliği, katman düzeni ve proje performansına da dikkat etmek
              gerekir.
            </p>
          </div>
        </section>

        <footer className="mt-14 border-t border-slate-800 pt-8">
          <Link
            href="/resources"
            className="inline-flex rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
          >
            ← Kaynaklara dön
          </Link>
        </footer>
      </article>
    </main>
  );
}