import Link from "next/link";
import type { Metadata } from "next";
import { ContentMeta } from "@/app/components/ContentNavigation";

export const metadata: Metadata = {
  title: "Güvenilir Revit Family ve BIM Obje Kaynakları",
  description: "Revit family kaynaklarını sürüm uyumluluğu, parametre kalitesi, dosya ağırlığı ve üretici güvenilirliğiyle değerlendirin.",
  alternates: { canonical: "/resources/revit-family-kaynaklari" },
};

const familySources = [
  {
    name: "BIMobject",
    description:
      "Üretici firmalara ait çok sayıda Revit family ve BIM objesi içerir.",
    note: "Ürün bazlı ve geniş arşiv",
    href: "https://www.bimobject.com/",
  },
  {
    name: "RevitCity",
    description:
      "Kullanıcılar tarafından yüklenen ücretsiz Revit family dosyalarının bulunduğu eski ve geniş bir arşivdir.",
    note: "Dosyaları kullanmadan önce kontrol et",
    href: "https://www.revitcity.com/",
  },
  {
    name: "BIMsmith Market",
    description:
      "Malzeme, yapı ürünü ve Revit family kaynaklarını bir arada sunar.",
    note: "Üretici içerikleri ağırlıklı",
    href: "https://market.bimsmith.com/",
  },
  {
    name: "ARCAT",
    description:
      "Yapı ürünleri, teknik dokümanlar ve bazı BIM içerikleri sunar.",
    note: "Teknik ürün araştırmaları için",
    href: "https://www.arcat.com/",
  },
  {
    name: "Üretici web siteleri",
    description:
      "Kapı, pencere, armatür, mobilya ve yapı malzemesi üreticilerinin kendi BIM dosyaları bulunabilir.",
    note: "En güvenilir ürün verisi",
    href: "https://www.nbsinternational.com/",
  },
];

export default function RevitFamilyKaynaklariPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
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

          <span className="text-slate-200">Revit Family Kaynakları</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Kaynak Rehberi
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Revit Family Nereden İndirilir?
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Kapı, pencere, mobilya, armatür ve diğer mimari elemanlar için Revit
            family bulabileceğin kaynakları ve dosya indirirken dikkat etmen
            gereken noktaları inceleyelim.
          </p>
        </header>
        <ContentMeta sourceNote="Family kaynağı, sürüm, parametre ve model performansı kontrolü" />

        <section className="mt-10 space-y-10 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Revit family nedir?
            </h2>

            <p className="mt-3">
              Revit family; kapı, pencere, kolon, mobilya, aydınlatma elemanı
              veya sıhhi tesisat ürünü gibi model elemanlarının geometrisini ve
              parametrelerini içeren dosyalardır.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="font-semibold text-cyan-300">
              Dosya uzantısı
            </p>

            <p className="mt-3">
              Revit family dosyaları çoğunlukla <strong>.rfa</strong> uzantısına
              sahiptir. Proje dosyaları ise genellikle <strong>.rvt</strong>
              uzantılıdır.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Kullanılabilecek kaynaklar
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {familySources.map((source) => (
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
                  <a href={source.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">Kaynağın resmî sitesini aç ↗</a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Family indirirken nelere dikkat edilmeli?
            </h2>

            <ul className="mt-5 space-y-4">
              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                Dosyanın kullandığın Revit sürümüyle uyumlu olup olmadığını
                kontrol et.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                Gereğinden fazla detaylı ve ağır family dosyaları modeli
                yavaşlatabilir.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                Ölçülerin, malzemelerin ve parametrelerin doğru olup olmadığını
                kontrol et.
              </li>

              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                Rastgele kaynaklardan indirilen dosyaları doğrudan ana projeye
                eklemek yerine boş bir Revit dosyasında test et.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Revit’e family nasıl yüklenir?
            </h2>

            <p className="mt-3">
              Revit içinde Insert sekmesine gir ve Load Family komutunu seç.
              İndirdiğin .rfa dosyasını bulup açtıktan sonra family projeye
              yüklenir. Ardından Architecture veya Systems sekmesindeki uygun
              araç üzerinden modele yerleştirilebilir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Neden üretici family’leri tercih edilmeli?
            </h2>

            <p className="mt-3">
              Üretici tarafından hazırlanan family dosyalarında gerçek ürün
              ölçüleri, model numarası, malzeme ve teknik bilgiler bulunabilir.
              Ancak bu dosyaların da gereğinden fazla ayrıntılı olup olmadığını
              kontrol etmek gerekir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Sonuç
            </h2>

            <p className="mt-3">
              Revit family indirirken yalnızca görsel kaliteye değil; dosya
              boyutuna, parametre düzenine, sürüm uyumluluğuna ve model
              performansına da dikkat etmek gerekir.
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
