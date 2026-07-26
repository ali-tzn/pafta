import CategoryHub, { type CategoryHubItem } from "@/app/components/CategoryHub";

const studentAndAiTools: CategoryHubItem[] = [
  { title: "GNO Hesaplayıcı", description: "Ders kredileri ve harf notlarından genel not ortalamanı hesapla.", href: "/student-tools/gno-calculator", icon: "G", group: "Not ve Ders", badge: "Popüler", featured: true },
  { title: "Ders Notu Hesaplayıcı", description: "Vize, final, ödev ve proje yüzdelerinden dönem sonu notunu hesapla.", href: "/student-tools/grade-calculator", icon: "%", group: "Not ve Ders" },
  { title: "Devamsızlık Hesaplayıcı", description: "Ders saati ve katılım durumuna göre kalan devamsızlık hakkını gör.", href: "/student-tools/attendance-calculator", icon: "D", group: "Not ve Ders" },
  { title: "Öğrenci Takvimi", description: "Teslim, sınav ve jüri tarihlerini kaydet; yaklaşan işleri birlikte gör.", href: "/student-tools/calendar", icon: "31", group: "Planlama", featured: true },
  { title: "Teslim Kontrol Listesi", description: "Pafta, model, sunum ve teslim dosyalarını göndermeden önce kontrol et.", href: "/student-tools/submission-checklist", icon: "✓", group: "Teslim" },
  { title: "Dosya Adı Oluşturucu", description: "Ders, proje, tarih ve revizyon bilgileriyle düzenli dosya adları oluştur.", href: "/student-tools/file-name-generator", icon: "Aa", group: "Teslim" },
  { title: "Mimarlık AI Araç Bulucu", description: "Yapmak istediğin işe ve proje aşamasına göre uygun yapay zekâ aracını bul.", href: "/mimarlik-yapay-zeka/arac-bulucu", icon: "AI", group: "Yapay Zekâ", badge: "AI", featured: true },
  { title: "Mimari Prompt Oluşturucu", description: "Yapı, bağlam, malzeme, atmosfer ve kamera seçimlerinden ayrıntılı prompt üret.", href: "/mimarlik-yapay-zeka/prompt-olusturucu", icon: "✦", group: "Yapay Zekâ", badge: "AI" },
  { title: "Mimarlık Yapay Zekâ Merkezi", description: "AI araçlarını, iş akışlarını, hata kontrollerini ve güvenli kullanım ilkelerini incele.", href: "/mimarlik-yapay-zeka", icon: "◇", group: "Yapay Zekâ", badge: "Rehber" },
];

export default function StudentToolsPage() {
  return (
    <CategoryHub
      eyebrow="PAFTA / Öğrenci ve AI"
      title="Okul, teslim ve yapay zekâ araçları"
      description="Not hesabından teslim planına, dosya düzeninden mimarlık için doğru AI aracını seçmeye kadar günlük öğrenci işlerini tek merkezden yönet."
      items={studentAndAiTools}
      searchPlaceholder="GNO, takvim, teslim, AI..."
      footerTitle="Yapay zekâyı kontrol ederek kullan"
      footerText="AI çıktıları mimari doğruluk, ölçek, strüktür, yönetmelik, kaynak ve telif açısından kontrol edilmelidir. Üretilen görsel veya metin uzman kararı yerine geçmez."
      faqs={[
        { question: "Öğrenci araçları bilgileri kaydediyor mu?", answer: "Araçların büyük bölümü tarayıcıda çalışır. Kalıcı veya yerel kayıt kullanılan sayfalarda bu davranış ayrıca belirtilir." },
        { question: "AI Araç Bulucu ne önerir?", answer: "Yapmak istediğin iş, proje aşaması ve çıktı türüne göre uygun yapay zekâ araçlarını ve iş akışını önerir." },
        { question: "AI çıktısını projede doğrudan kullanabilir miyim?", answer: "Çıktı önce mimari doğruluk, kaynak, telif ve ders kuralları açısından kontrol edilmeli; gerekiyorsa kullanım açıkça belirtilmelidir." },
      ]}
      related={[
        { title: "Pafta ve teslim", href: "/teslim-araclari" },
        { title: "Mimarlık AI merkezi", href: "/mimarlik-yapay-zeka" },
      ]}
    />
  );
}
