import CategoryHub, { type CategoryHubItem } from "@/app/components/CategoryHub";

const studentTools: CategoryHubItem[] = [
  { title: "GNO Hesaplayıcı", description: "Ders kredileri ve harf notlarından genel not ortalamanı hesapla.", href: "/student-tools/gno-calculator", icon: "G", group: "Not ve Ders", badge: "Popüler", featured: true },
  { title: "Ders Notu Hesaplayıcı", description: "Vize, final, ödev ve proje yüzdelerinden dönem sonu notunu hesapla.", href: "/student-tools/grade-calculator", icon: "%", group: "Not ve Ders" },
  { title: "Devamsızlık Hesaplayıcı", description: "Ders saati ve katılım durumuna göre kalan devamsızlık hakkını gör.", href: "/student-tools/attendance-calculator", icon: "D", group: "Not ve Ders" },
  { title: "Öğrenci Takvimi", description: "Teslim, sınav ve jüri tarihlerini kaydet; yaklaşan işleri birlikte gör.", href: "/student-tools/calendar", icon: "31", group: "Planlama", featured: true },
  { title: "Teslim Kontrol Listesi", description: "Pafta, model, sunum ve teslim dosyalarını göndermeden önce kontrol et.", href: "/student-tools/submission-checklist", icon: "✓", group: "Teslim" },
  { title: "Dosya Adı Oluşturucu", description: "Ders, proje, tarih ve revizyon bilgileriyle düzenli dosya adları oluştur.", href: "/student-tools/file-name-generator", icon: "Aa", group: "Teslim" },
];

export default function StudentToolsPage() {
  return (
    <CategoryHub
      eyebrow="PAFTA / Öğrenci Araçları"
      title="Okul ve teslim işlerini düzenle"
      description="Not hesabından teslim planına, devamsızlıktan dosya düzenine kadar günlük öğrenci işlerini tek merkezden yönet."
      items={studentTools}
      searchPlaceholder="GNO, takvim, devamsızlık, teslim..."
      footerTitle="Teslim sürecini son güne bırakma"
      footerText="Takvim, kontrol listesi ve dosya adı araçlarını birlikte kullanarak teslim sürecini daha düzenli ve kontrol edilebilir hâle getir."
      faqs={[
        { question: "Öğrenci araçları bilgileri kaydediyor mu?", answer: "Araçların büyük bölümü tarayıcıda çalışır. Kalıcı veya yerel kayıt kullanılan sayfalarda bu davranış ayrıca belirtilir." },
        { question: "Teslim araçları hangi bilgileri düzenler?", answer: "Takvim, teslim kontrol listesi ve dosya adı araçları tarihleri ve teslim dosyalarını daha düzenli yönetmene yardımcı olur." },
      ]}
      related={[
        { title: "Pafta ve teslim", href: "/teslim-araclari" },
        { title: "Mimari AI", href: "/mimarlik-yapay-zeka" },
      ]}
    />
  );
}
