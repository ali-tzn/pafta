import type { Metadata } from "next";
import CategoryHub, { type CategoryHubItem } from "@/app/components/CategoryHub";

export const metadata: Metadata = {
  title: "Mimari Detay ve Yapı Malzemeleri",
  description: "Mimari detay çizimleri, yapı malzemeleri, teknik değerler, katmanlar ve malzeme karşılaştırmaları.",
  alternates: { canonical: "/kutuphaneler" },
};

const libraries: CategoryHubItem[] = [
  { title: "Mimari Detay Kütüphanesi", description: "Cephe, çatı, temel, ıslak hacim ve doğrama birleşimlerini şematik katmanlarla incele.", href: "/mimari-detaylar", icon: "D", group: "Teknik", badge: "12 detay", featured: true },
  { title: "Yapı Malzemeleri", description: "Malzemelerin özelliklerini, kullanım yerlerini, avantajlarını ve alternatiflerini karşılaştır.", href: "/yapi-malzemeleri", icon: "M", group: "Teknik", badge: "27 malzeme", featured: true },
  { title: "Malzeme Karşılaştırma", description: "Aynı kategorideki malzemelerin teknik ve pratik özelliklerini yan yana karşılaştır.", href: "/yapi-malzemeleri/karsilastir", icon: "↔", group: "Malzeme", badge: "Karşılaştır", featured: true },
  { title: "Yalıtım Malzemeleri", description: "Isı ve su yalıtımı seçeneklerini kullanım alanı, kalınlık ve teknik değerleriyle incele.", href: "/yapi-malzemeleri/yalitim", icon: "Y", group: "Malzeme", badge: "Teknik" },
  { title: "Duvar Malzemeleri", description: "Tuğla, gazbeton ve bims gibi duvar seçeneklerini proje ihtiyacına göre değerlendir.", href: "/yapi-malzemeleri/duvar", icon: "D", group: "Malzeme", badge: "Teknik" },
  { title: "Detay Kesit ve U-Değeri Tasarımcısı", description: "Duvar, çatı ve döşeme katmanlarını kurarak kesiti ve ısıl performansı karşılaştır.", href: "/proje-araclari/u-degeri-tasarimcisi", icon: "U", group: "Katman", badge: "Araç" },
];

export default function LibrariesPage() {
  return (
    <CategoryHub
      eyebrow="PAFTA / Mimari Detay ve Malzemeler"
      title="Detayı ve malzemeyi birlikte çöz"
      description="Mimari detayları, yapı malzemelerini, teknik değerleri ve katman kararlarını tek merkezden incele."
      items={libraries}
      searchPlaceholder="Detay, yalıtım, duvar, U-değeri..."
      footerTitle="Okumayı proje üretimine bağla"
      footerText="Bir malzemeyi seçmeden önce özelliklerini, bir detayı çizmeden önce katmanlarını, bir yazılım adımını uygulamadan önce proje üzerindeki etkisini birlikte değerlendir."
      faqs={[
        { question: "Kütüphane içerikleri kimler için hazırlandı?", answer: "Öncelikle mimarlık öğrencileri için hazırlanmıştır; tasarım ve uygulama sürecinde hızlı başvuru arayanlar da yararlanabilir." },
        { question: "Mimari detaylar uygulama çizimi yerine geçer mi?", answer: "Hayır. Şemalar katman mantığını anlatır; proje, ürün, iklim ve mevzuat koşullarına göre uzman tarafından geliştirilmelidir." },
        { question: "Malzemeleri karşılaştırabilir miyim?", answer: "Yapı Malzemeleri bölümündeki karşılaştırma aracıyla aynı kategorideki seçenekleri ortak özellikler üzerinden inceleyebilirsin." },
      ]}
      related={[
        { title: "Proje geliştirme", href: "/proje-araclari" },
        { title: "Uygulama rehberi", href: "/rehberler" },
      ]}
    />
  );
}
