import CategoryHub, { type CategoryHubItem } from "@/app/components/CategoryHub";

const deliveryTools: CategoryHubItem[] = [
  { title: "Mimari Teslim Kontrol Merkezi", description: "PDF, JPG veya PNG paftanın ölçü, yön, dosya boyutu, sayfa ve DPI koşullarını denetle.", href: "/teslim-araclari/kontrol-merkezi", icon: "✓", group: "Kontrol", badge: "Ana araç", featured: true },
  { title: "Jüri Gözü", description: "Paftayı farklı izleme mesafelerinde gör; küçük metinleri, kenar ve yoğunluk risklerini bul.", href: "/teslim-araclari/juri-gozu", icon: "◉", group: "Kontrol", badge: "Analiz", featured: true },
  { title: "Pafta Yerleşim Oluşturucu", description: "Kâğıt boyutu ve içerik listesine göre grid kur; blokları sürükleyerek düzenle.", href: "/proje-araclari/pafta-yerlesimi", icon: "▦", group: "Hazırlık", badge: "Tasarım", featured: true },
  { title: "Teslim Kontrol Listesi", description: "Pafta, çizim, model, sunum ve gönderim adımlarını işaretleyerek tamamla.", href: "/student-tools/submission-checklist", icon: "☑", group: "Kontrol" },
  { title: "Dosya Adı Oluşturucu", description: "Ders, proje, tarih ve revizyon bilgileriyle düzenli teslim dosyası adı oluştur.", href: "/student-tools/file-name-generator", icon: "Aa", group: "Hazırlık" },
  { title: "PDF Pafta Boyutu ve Ölçek", description: "Paftanın kâğıt boyutunu değiştir; içeriği sığdır veya çizim ölçeğini koru.", href: "/pdf-tools/resize-pages", icon: "↔", group: "Düzeltme" },
  { title: "PDF Sıkıştırma", description: "Teslim yükleme sınırını aşan PDF’nin dosya boyutunu azalt.", href: "/pdf-tools/compress", icon: "⇲", group: "Düzeltme" },
  { title: "PDF → PNG / JPG", description: "PDF paftalarını seçilebilir çözünürlükte görsellere dönüştür.", href: "/pdf-tools/pdf-to-png", icon: "▧", group: "Dönüştürme" },
  { title: "PDF Birleştirme", description: "Kapak, pafta ve rapor PDF’lerini doğru sırayla tek teslim dosyasında birleştir.", href: "/pdf-tools/merge", icon: "⧉", group: "Hazırlık" },
];

export default function DeliveryToolsPage() {
  return (
    <CategoryHub
      eyebrow="PAFTA / Jüri ve Teslim Araçları"
      title="Jüri ve teslimden önce kontrol et"
      description="Pafta ve portfolyonu teknik şartlara göre hazırla; sorunları baskıdan veya yüklemeden önce doğru araçla tespit et."
      items={deliveryTools}
      searchPlaceholder="Jüri, DPI, kontrol, sıkıştır..."
      footerTitle="Önerilen teslim sırası"
      footerText="Önce yerleşimi oluştur, ardından Teslim Kontrol Merkezi ve Jüri Gözü ile denetle. Son olarak dosya adını, PDF boyutunu ve açılan nihai dosyayı doğrula."
      faqs={[
        { question: "Teslimden önce ilk hangi kontrolü yapmalıyım?", answer: "Önce pafta ölçüsü, yönü ve içeriğini; ardından okunabilirlik, dosya boyutu, adlandırma ve açılabilirlik kontrollerini yap." },
        { question: "Jüri Gözü neyi kontrol eder?", answer: "Paftanın farklı izleme mesafelerindeki okunabilirliğini, küçük metinleri, kenar risklerini ve yoğun bölgeleri görmene yardım eder." },
        { question: "Teslim Kontrol Merkezi kesin onay verir mi?", answer: "Hayır. Teknik bir ön kontrol sağlar; ders yürütücüsünün veya kurumun güncel teslim şartları ayrıca esas alınmalıdır." },
      ]}
      related={[
        { title: "Tüm PDF araçları", href: "/pdf-tools" },
        { title: "Öğrenci araçları", href: "/student-tools" },
      ]}
    />
  );
}
