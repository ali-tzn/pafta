import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "PAFTA’nın dosya işleme, yerel depolama ve kişisel verilerle ilgili mevcut uygulamalarını inceleyin.",
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    title: "1. Genel yaklaşım",
    content:
      "PAFTA, mümkün olan işlemleri kullanıcının tarayıcısında gerçekleştirecek şekilde tasarlanır. Bu politika, platformun mevcut sürümündeki veri işleme uygulamalarını açıklar.",
  },
  {
    title: "2. PDF ve görsel dosyaları",
    content:
      "PDF birleştirme, ayırma, sıkıştırma, dönüştürme ve benzeri dosya araçlarında seçtiğin dosyalar mevcut sürümde tarayıcının içinde işlenir. Dosyalar PAFTA sunucusuna yüklenmez ve tarafımızca saklanmaz. Tarayıcı sekmesini kapattığında oluşturulan geçici önizlemeler sona erer.",
  },
  {
    title: "3. Cihazda saklanan bilgiler",
    content:
      "Öğrenci takvimi ve teslim kontrol listesi gibi bazı araçlar, girdilerini korumak için tarayıcının yerel depolama özelliğini kullanabilir. Bu bilgiler kullandığın cihazda kalır. Tarayıcı verilerini temizlediğinde veya farklı bir cihaz kullandığında bu kayıtlar kaybolabilir.",
  },
  {
    title: "4. İletişim",
    content:
      "E-posta ile bizimle iletişime geçtiğinde gönderdiğin ad, e-posta adresi ve mesaj içeriği yalnızca talebini değerlendirmek ve yanıtlamak amacıyla kullanılır. Yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.",
  },
  {
    title: "5. Teknik kayıtlar ve üçüncü taraf hizmetleri",
    content:
      "Site yayımlandığında barındırma sağlayıcısı güvenlik, hata tespiti ve hizmetin çalışması için IP adresi, tarayıcı türü ve erişim zamanı gibi standart teknik kayıtlar tutabilir. Google Analytics veya Google AdSense etkinleştirildiğinde bu hizmetlerin kodları yalnızca ziyaretçinin açık tercihinden sonra yüklenir. Kullanıcı çerez tercihlerini daha sonra sayfanın altındaki bağlantıdan değiştirebilir.",
  },
  {
    title: "6. Güvenlik ve değişiklikler",
    content:
      "Makul teknik önlemler alınsa da internet üzerinden çalışan hiçbir sistem için mutlak güvenlik garantisi verilemez. PAFTA geliştikçe bu politika değişebilir. Güncel metin her zaman bu sayfada yayımlanır.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Yasal
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Gizlilik Politikası
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          Son güncelleme: 24 Temmuz 2026
        </p>

        <div className="mt-10 space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 leading-7 text-slate-300">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-8 leading-7 text-slate-400">
          Gizlilikle ilgili soruların için{" "}
          <a
            href="mailto:iletisim@paftaedu.com"
            className="text-cyan-400 hover:text-cyan-300"
          >
            iletisim@paftaedu.com
          </a>{" "}
          adresine ulaşabilirsin.
        </p>
      </article>
    </main>
  );
}
