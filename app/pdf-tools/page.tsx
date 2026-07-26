import CategoryHub, { type CategoryHubItem } from "@/app/components/CategoryHub";

const pdfTools: CategoryHubItem[] = [
  { title: "PDF Birleştirme", description: "Birden fazla PDF’yi istediğin sıra ve sayfa aralığıyla tek dosyada birleştir.", href: "/pdf-tools/merge", icon: "⧉", group: "Düzenleme", badge: "Popüler", featured: true },
  { title: "PDF Sıkıştırma", description: "PDF dosyasını daha kolay yüklenebilir ve paylaşılabilir boyuta getir.", href: "/pdf-tools/compress", icon: "⇲", group: "Optimizasyon", badge: "Popüler", featured: true },
  { title: "PDF → PNG / JPG", description: "PDF sayfalarını 96, 150 veya 300 DPI çözünürlükte görsellere dönüştür.", href: "/pdf-tools/pdf-to-png", icon: "▧", group: "Dönüştürme", badge: "Popüler", featured: true },
  { title: "Görsellerden PDF", description: "PNG ve JPG görsellerini sırala ve tek bir PDF dosyası oluştur.", href: "/pdf-tools/images-to-pdf", icon: "▤", group: "Dönüştürme" },
  { title: "PDF Sayfalarını Ayır", description: "Belirli sayfaları seçerek yeni ve ayrı bir PDF oluştur.", href: "/pdf-tools/split", icon: "✂", group: "Düzenleme" },
  { title: "PDF Sayfalarını Düzenle", description: "Sayfaları döndür, çıkar ve sürükleyerek farklı bir sıraya yerleştir.", href: "/pdf-tools/organize", icon: "↕", group: "Düzenleme" },
  { title: "Pafta Boyutu ve Ölçek", description: "Kâğıt boyutunu değiştir; içeriği sığdır veya çizim ölçeğini koru.", href: "/pdf-tools/resize-pages", icon: "↔", group: "Pafta", badge: "Mimarlık" },
  { title: "Sayfa Numarası Ekle", description: "PDF sayfalarına konumu ve biçimi ayarlanabilir numaralar yerleştir.", href: "/pdf-tools/page-numbers", icon: "№", group: "Düzenleme" },
  { title: "PDF’e Filigran Ekle", description: "Sayfalara konumu, açısı ve saydamlığı ayarlanabilir filigran ekle.", href: "/pdf-tools/watermark", icon: "WM", group: "Belge" },
  { title: "PDF Bilgilerini Görüntüle", description: "Sayfa sayısını, dosya boyutunu ve temel belge bilgilerini incele.", href: "/pdf-tools/info", icon: "i", group: "Belge" },
  { title: "Mimari Teslim Kontrol Merkezi", description: "Paftanın boyut, yön, dosya ağırlığı, sayfa ve DPI koşullarını kontrol et.", href: "/teslim-araclari/kontrol-merkezi", icon: "✓", group: "Pafta", badge: "Kontrol" },
];

export default function PdfToolsPage() {
  return (
    <CategoryHub
      eyebrow="PAFTA / PDF ve Dosya"
      title="PDF araçları"
      description="Pafta ve belgelerini birleştir, dönüştür, düzenle ve teslim için hazırla. İşlemlerin çoğu doğrudan tarayıcında gerçekleşir."
      items={pdfTools}
      searchPlaceholder="Birleştir, PNG, sıkıştır, filigran..."
      footerTitle="Dosyaların cihazında kalır"
      footerText="Uygun PDF işlemleri doğrudan tarayıcıda çalışır. Her araç sayfasında dosyanın nasıl işlendiği ve olası sınırlar ayrıca açıklanır."
      faqs={[
        { question: "PDF araçları ücretsiz mi?", answer: "Evet. Listelenen PDF araçları ücretsiz olarak kullanılabilir." },
        { question: "PDF dosyalarım sunucuya yükleniyor mu?", answer: "Uygun işlemler doğrudan tarayıcıda yapılır. Kesin işlem yöntemi her aracın kendi sayfasında açıklanır." },
        { question: "Mimari paftalar için hangi araçları kullanmalıyım?", answer: "Boyut ve ölçek düzenleme, PDF → PNG, sıkıştırma ve teslim kontrol merkezi pafta hazırlığında birlikte kullanılabilir." },
      ]}
      related={[
        { title: "Pafta ve teslim", href: "/teslim-araclari" },
        { title: "Dosya adı oluştur", href: "/student-tools/file-name-generator" },
      ]}
    />
  );
}
