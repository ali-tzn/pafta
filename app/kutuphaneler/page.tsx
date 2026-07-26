import type { Metadata } from "next";
import CategoryHub, { type CategoryHubItem } from "@/app/components/CategoryHub";

export const metadata: Metadata = {
  title: "Mimarlık Bilgi Kütüphaneleri",
  description: "Mimari detaylar, yapı malzemeleri, mimarlık kültürü, proje rehberleri, BIM, Revit ve kaynak içerikleri.",
  alternates: { canonical: "/kutuphaneler" },
};

const libraries: CategoryHubItem[] = [
  { title: "Mimari Detay Kütüphanesi", description: "Cephe, çatı, temel, ıslak hacim ve doğrama birleşimlerini şematik katmanlarla incele.", href: "/mimari-detaylar", icon: "D", group: "Teknik", badge: "12 detay", featured: true },
  { title: "Yapı Malzemeleri", description: "Malzemelerin özelliklerini, kullanım yerlerini, avantajlarını ve alternatiflerini karşılaştır.", href: "/yapi-malzemeleri", icon: "M", group: "Teknik", badge: "27 malzeme", featured: true },
  { title: "Mimarlık Rehberi", description: "Mimari akımlar, kavramlar, önemli mimarlar ve ikonik yapılar hakkında bilgi edin.", href: "/mimarlik", icon: "A", group: "Kültür", badge: "Kültür", featured: true },
  { title: "Tasarım ve Proje Rehberleri", description: "Çizim anlatımı, ihtiyaç programı, detay çözümü, portfolyo ve jüri hazırlığını öğren.", href: "/rehberler", icon: "R", group: "Tasarım", badge: "70 başlık" },
  { title: "Revit Merkezi", description: "Modelleme, görünüm, family, pafta, çıktı ve koordinasyon sorunlarına çözüm bul.", href: "/revit", icon: "R", group: "Yazılım", badge: "26 rehber" },
  { title: "BIM Merkezi", description: "LOD, IFC, koordinasyon, bilgi yönetimi ve teslim süreçlerini kavra.", href: "/bim", icon: "B", group: "Yazılım", badge: "26 rehber" },
  { title: "CAD ve Revit Kaynakları", description: "CAD blok ve Revit family kaynaklarını seçerken kalite ve güvenlik ölçütlerini incele.", href: "/resources", icon: "+", group: "Kaynak" },
];

export default function LibrariesPage() {
  return (
    <CategoryHub
      eyebrow="PAFTA / Bilgi Kütüphaneleri"
      title="Mimarlık bilgisini düzenli biçimde keşfet"
      description="Araştırma ve teknik başvuru içeriklerini konuya göre filtrele; detaydan malzemeye, kültürden BIM ve Revit’e doğrudan ilerle."
      items={libraries}
      searchPlaceholder="Detay, malzeme, Revit, modernizm..."
      footerTitle="Okumayı proje üretimine bağla"
      footerText="Bir malzemeyi seçmeden önce özelliklerini, bir detayı çizmeden önce katmanlarını, bir yazılım adımını uygulamadan önce proje üzerindeki etkisini birlikte değerlendir."
      faqs={[
        { question: "Kütüphane içerikleri kimler için hazırlandı?", answer: "Öncelikle mimarlık öğrencileri için hazırlanmıştır; tasarım ve uygulama sürecinde hızlı başvuru arayanlar da yararlanabilir." },
        { question: "Mimari detaylar uygulama çizimi yerine geçer mi?", answer: "Hayır. Şemalar katman mantığını anlatır; proje, ürün, iklim ve mevzuat koşullarına göre uzman tarafından geliştirilmelidir." },
        { question: "Malzemeleri karşılaştırabilir miyim?", answer: "Yapı Malzemeleri bölümündeki karşılaştırma aracıyla aynı kategorideki seçenekleri ortak özellikler üzerinden inceleyebilirsin." },
      ]}
      related={[
        { title: "Tasarım araçları", href: "/proje-araclari" },
        { title: "Mimarlık AI", href: "/mimarlik-yapay-zeka" },
      ]}
    />
  );
}
