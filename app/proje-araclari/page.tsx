import type { Metadata } from "next";
import CategoryHub, { type CategoryHubItem } from "@/app/components/CategoryHub";

export const metadata: Metadata = {
  title: "Mimari Tasarım Araçları",
  description: "İhtiyaç programı, mekânsal ilişkiler, güneş, vaziyet, pafta, U-değeri ve emsal analizi için ücretsiz mimari tasarım araçları.",
  alternates: { canonical: "/proje-araclari" },
};

const projectTools: CategoryHubItem[] = [
  { title: "Mimari Proje Başlangıç Merkezi", description: "Yapı türüne göre ihtiyaç programı, alan dağılımı, komşuluk ve kat önerisi üret.", href: "/proje-araclari/proje-baslangic", icon: "01", group: "Program", badge: "Başlangıç", featured: true },
  { title: "İlişki ve Balon Diyagramı", description: "Mekânları alan ve yakınlık ilişkilerine göre yerleştir; diyagramı indir.", href: "/proje-araclari/balon-diyagrami", icon: "02", group: "Program", featured: true },
  { title: "Güneş, Yönlenme ve Cephe", description: "Konum, yön ve kullanım saatine göre güneş ve cephe kararlarını değerlendir.", href: "/proje-araclari/gunes-yonlenme", icon: "03", group: "Çevresel" },
  { title: "Vaziyet ve Yapı Oturumu", description: "Serbest parsel geometrisi, çekme sınırı ve yapı oturumunu görsel olarak kur.", href: "/proje-araclari/vaziyet-simulatoru", icon: "04", group: "Yerleşim", featured: true },
  { title: "Mekân Ölçüleri Kütüphanesi", description: "Farklı yapı türleri için başlangıç ve önerilen mekân ölçülerini incele.", href: "/proje-araclari/mekan-olculeri", icon: "05", group: "Program" },
  { title: "Emsal Proje Atlası", description: "Önemli yapıları program, dolaşım, strüktür ve mekânsal kararlarla karşılaştır.", href: "/proje-araclari/emsal-atlasi", icon: "06", group: "Referans" },
  { title: "Pafta Yerleşim Oluşturucu", description: "Pafta ölçüsü ve içeriklerine göre grid kur; blokları sürükleyerek yerleştir.", href: "/proje-araclari/pafta-yerlesimi", icon: "07", group: "Sunum" },
  { title: "Detay Kesit ve U-Değeri Tasarımcısı", description: "Duvar, çatı ve döşeme detay kesitlerini katmanlarla oluştur; U-değeri ve yoğuşma riskini incele.", href: "/proje-araclari/u-degeri-tasarimcisi", icon: "08", group: "Teknik" },
  { title: "Yönetmelik Kontrol Asistanı", description: "Parsel ve proje girdilerinden açıklamalı bir imar ve mevzuat ön raporu üret.", href: "/proje-araclari/yonetmelik-kontrol", icon: "09", group: "Teknik" },
];

export default function ProjectToolsPage() {
  return (
    <CategoryHub
      eyebrow="PAFTA / Proje Geliştirme"
      title="Mimari projeni adım adım geliştir"
      description="Programdan yerleşime, çevresel kararlardan teknik kontrole kadar proje sürecinin farklı aşamalarını konuya göre filtrele."
      items={projectTools}
      searchPlaceholder="Vaziyet, güneş, balon, U-değeri..."
      footerTitle="Araçları tek bir iş akışında kullan"
      footerText="Proje Başlangıç Merkezi ile programı kur; Balon Diyagramı ve Vaziyet Simülatörü ile ilişkileri sınayıp Pafta Yerleşimi ile sunuma taşı."
      faqs={[
        { question: "Mimari projeye hangi araçla başlamalıyım?", answer: "Yapı türü ve alan ihtiyaçları henüz belirlenmediyse Proje Başlangıç Merkezi en uygun ilk adımdır." },
        { question: "Araçların ürettiği tasarım kesin çözüm müdür?", answer: "Hayır. Araçlar seçenek üretmeye ve kararları görünür kılmaya yardım eder; mimari değerlendirme kullanıcıya aittir." },
        { question: "Vaziyet ve güneş araçları birlikte kullanılabilir mi?", answer: "Evet. Önce parsel ve oturumu kurup ardından yönlenme ve cephe kararlarını güneş aracıyla değerlendirebilirsin." },
      ]}
      related={[
        { title: "Hesap araçları", href: "/tools" },
        { title: "Mimari detaylar", href: "/mimari-detaylar" },
      ]}
    />
  );
}
