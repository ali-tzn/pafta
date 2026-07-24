import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Revit’ten D5 Render’a Malzeme Aktarma ve Ayrıştırma",
  description:
    "Revit malzemelerini D5 Render’a doğru aktarma, aynı görünen yüzeyleri ayırma ve malzeme değişikliklerini senkronize etme adımları.",
  alternates: {
    canonical: "/revit/d5-render-malzeme-aktarma",
  },
};

export default function RevitD5MaterialPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/revit" className="transition hover:text-cyan-400">
            Revit
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">D5 Render malzeme aktarımı</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Revit ve D5 Render
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Revit’ten D5 Render’a Malzeme Aktarma ve Ayrıştırma
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Revit’te iki elemanı farklı malzemelerle tanımladığın hâlde D5
            Render’da ikisi birlikte değişiyorsa sorun çoğunlukla eleman tipini
            çoğaltmakla malzeme varlığını çoğaltmak arasındaki farktan
            kaynaklanır.
          </p>
        </header>

        <section className="mt-10 space-y-9 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Önce sorunun kaynağını belirle
            </h2>
            <p className="mt-3">
              Bir döşeme, duvar veya toposolid tipini <strong>Duplicate</strong>{" "}
              ile çoğaltmak tek başına yeni bir render malzemesi oluşturmaz.
              Çoğalttığın iki tip hâlâ aynı Revit malzemesini veya aynı
              Appearance varlığını kullanıyorsa D5 bunları tek malzeme olarak
              algılayabilir. Sonuç olarak D5 içinde yaptığın değişiklik iki
              yüzeye birden uygulanır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              1. Eleman tipini çoğalt
            </h2>
            <p className="mt-3">
              Değiştirmek istediğin elemanı seç, <strong>Edit Type</strong>{" "}
              bölümüne gir ve <strong>Duplicate</strong> ile yeni bir tip
              oluştur. Yeni tipe, kullanımını açıkça anlatan bir ad ver. Örneğin
              “Döşeme – Asfalt” ve “Döşeme – Beton” gibi adlar modelin ilerleyen
              aşamalarında karışıklığı azaltır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              2. Doğru katmanı değiştir
            </h2>
            <p className="mt-3">
              <strong>Edit Structure</strong> ekranında render’da görünen dış
              yüzeye karşılık gelen katmanı bul. Yatay elemanlarda genellikle
              üstteki yüzey katmanı, duvarlarda ise iç veya dış{" "}
              <strong>Finish</strong> katmanı değiştirilir.{" "}
              <strong>Substrate</strong> çoğunlukla kaplamayı taşıyan alt
              katmandır; yalnızca yüzey görünümünü değiştirmek için doğru seçim
              olmayabilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              3. Bağımsız bir Revit malzemesi oluştur
            </h2>
            <p className="mt-3">
              Material Browser’da mevcut malzemeyi çoğalt ve yeni bir ad ver.
              Ardından <strong>Appearance</strong> sekmesindeki görünüm varlığını
              da bağımsızlaştır. Yalnızca malzemenin adını değiştirmek yeterli
              değildir; iki malzeme aynı Appearance varlığını paylaşmaya devam
              ederse birinde yapılan görünüm değişikliği diğerini de
              etkileyebilir.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <h2 className="text-xl font-semibold text-cyan-300">
              Kısa kontrol
            </h2>
            <ul className="mt-4 space-y-2">
              <li>• Eleman tipi farklı mı?</li>
              <li>• Katmana atanan Revit malzemesi farklı mı?</li>
              <li>• Appearance varlığı bağımsız mı?</li>
              <li>• Malzeme adları açık ve birbirinden farklı mı?</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              4. D5 Sync ile modeli güncelle
            </h2>
            <p className="mt-3">
              Revit’teki değişiklikleri kaydettikten sonra D5 Sync eklentisindeki
              senkronizasyon veya güncelleme komutunu kullan. D5’in resmî Revit
              iş akışında model ve malzeme değişikliklerinin Sync komutuyla
              aktarılabildiği belirtilir. Eski görünüm devam ederse Revit
              malzeme adını yeniden kontrol et ve modeli tekrar güncelle.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              5. D5 içindeki malzemeyi düzenle
            </h2>
            <p className="mt-3">
              Yüzeyler D5 içinde ayrı seçilebiliyorsa aktarım doğru yapılmıştır.
              Bundan sonra D5 malzeme kütüphanesinden kaplama atayabilir veya
              renk, pürüzlülük, normal haritası ve doku ölçeği gibi değerleri
              düzenleyebilirsin. Senkronizasyon sırasında Revit geometrisini
              güncellerken D5’te yaptığın malzeme düzenlemelerinin korunup
              korunmadığını proje kopyasında test etmek güvenli olur.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Malzemeler hâlâ birlikte değişiyorsa
            </h2>
            <p className="mt-3">
              İki yüzeyin gerçekten farklı Revit malzemeleri kullandığını,
              Appearance varlıklarının paylaşılmadığını ve D5’te doğru yüzeyin
              seçildiğini yeniden kontrol et. Autodesk Material Library eksik
              veya bozuksa Revit görünüm malzemeleri aktarılırken sorun
              yaşanabilir. Böyle bir durumda kütüphanenin kurulumunu onarmak ve
              D5 Sync eklentisini güncellemek gerekebilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Sonuç</h2>
            <p className="mt-3">
              D5 Render’da yüzeyleri bağımsız yönetmenin anahtarı yalnızca Revit
              eleman tipini değil, katmana atanmış malzemeyi ve gerekiyorsa
              Appearance varlığını da bağımsızlaştırmaktır. Bu yapı doğru
              kurulduğunda aynı kategorideki elemanlara farklı D5 malzemeleri
              atamak mümkün olur.
            </p>
          </div>
        </section>

        <aside className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Resmî kaynaklar</h2>
          <div className="mt-3 flex flex-col gap-2 text-cyan-400">
            <a
              href="https://docs.d5render.com/workflow/revit/workflow-or-d5-sync-for-revit"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300"
            >
              D5 Sync for Revit iş akışı ↗
            </a>
            <a
              href="https://help.autodesk.com/cloudhelp/2019/ENU/Revit-Customize/files/GUID-8D1A49AB-849C-49DF-A7B9-34C596E0C6F2.htm"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300"
            >
              Autodesk Material Properties and Assets ↗
            </a>
          </div>
        </aside>

        <Link
          href="/revit"
          className="mt-12 inline-flex rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
        >
          ← Revit rehberlerine dön
        </Link>
      </article>
    </main>
  );
}
