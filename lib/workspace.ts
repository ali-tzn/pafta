export type WorkspaceItem = {
  title: string;
  href: string;
  category: string;
  icon: string;
};

export type RecentWorkspaceItem = {
  href: string;
  visitedAt: number;
  title?: string;
  category?: string;
};

export const RECENT_STORAGE_KEY = "pafta_recent_tools_v1";
export const FAVORITE_STORAGE_KEY = "pafta_favorite_tools_v1";
export const WORKSPACE_EVENT = "pafta-workspace-updated";

export const workspaceItems: WorkspaceItem[] = [
  { title: "Mimarlık Birim Dönüştürücü", href: "/tools/architecture-unit-converter", category: "Hesap", icon: "↔" },
  { title: "TAKS–KAKS ve Emsal", href: "/tools/taks-kaks", category: "Hesap", icon: "m²" },
  { title: "Ölçek Hesaplayıcı", href: "/tools/scale-calculator", category: "Hesap", icon: "1:n" },
  { title: "Pafta Ölçek Dönüştürücü", href: "/tools/sheet-scale-converter", category: "Hesap", icon: "A" },
  { title: "Merdiven Hesaplayıcı", href: "/tools/stair-calculator", category: "Hesap", icon: "⌁" },
  { title: "Rampa Hesaplayıcı", href: "/tools/ramp-calculator", category: "Hesap", icon: "/" },
  { title: "Alan Hesaplayıcı", href: "/tools/area-calculator", category: "Hesap", icon: "□" },
  { title: "Eğim Hesaplayıcı", href: "/tools/slope-calculator", category: "Hesap", icon: "%" },
  { title: "Otopark Hesaplayıcı", href: "/tools/parking-calculator", category: "Hesap", icon: "P" },
  { title: "Çatı Hesaplayıcı", href: "/tools/roof-calculator", category: "Hesap", icon: "⌃" },
  { title: "Beton Hacmi", href: "/tools/concrete-calculator", category: "Metraj", icon: "m³" },
  { title: "Tuğla Hesaplayıcı", href: "/tools/brick-calculator", category: "Metraj", icon: "▦" },
  { title: "Seramik ve Karo", href: "/tools/tile-calculator", category: "Metraj", icon: "▦" },
  { title: "Duvar ve Boya", href: "/tools/wall-paint-calculator", category: "Metraj", icon: "▥" },
  { title: "PDF Birleştirme", href: "/pdf-tools/merge", category: "PDF", icon: "⧉" },
  { title: "PDF Sıkıştırma", href: "/pdf-tools/compress", category: "PDF", icon: "⇲" },
  { title: "PDF → PNG / JPG", href: "/pdf-tools/pdf-to-png", category: "PDF", icon: "▧" },
  { title: "Görsellerden PDF", href: "/pdf-tools/images-to-pdf", category: "PDF", icon: "▤" },
  { title: "PDF Sayfalarını Ayır", href: "/pdf-tools/split", category: "PDF", icon: "✂" },
  { title: "PDF Sayfalarını Düzenle", href: "/pdf-tools/organize", category: "PDF", icon: "↕" },
  { title: "Pafta Boyutu ve Ölçek", href: "/pdf-tools/resize-pages", category: "PDF", icon: "↔" },
  { title: "PDF Sayfa Numarası", href: "/pdf-tools/page-numbers", category: "PDF", icon: "№" },
  { title: "PDF Filigran", href: "/pdf-tools/watermark", category: "PDF", icon: "W" },
  { title: "PDF Bilgileri", href: "/pdf-tools/info", category: "PDF", icon: "i" },
  { title: "Proje Başlangıç Merkezi", href: "/proje-araclari/proje-baslangic", category: "Tasarım", icon: "01" },
  { title: "Balon Diyagramı", href: "/proje-araclari/balon-diyagrami", category: "Tasarım", icon: "○" },
  { title: "Güneş ve Cephe", href: "/proje-araclari/gunes-yonlenme", category: "Tasarım", icon: "☼" },
  { title: "Vaziyet Simülatörü", href: "/proje-araclari/vaziyet-simulatoru", category: "Tasarım", icon: "◇" },
  { title: "Mekân Ölçüleri", href: "/proje-araclari/mekan-olculeri", category: "Tasarım", icon: "↔" },
  { title: "Emsal Proje Atlası", href: "/proje-araclari/emsal-atlasi", category: "Tasarım", icon: "◎" },
  { title: "Pafta Yerleşimi", href: "/proje-araclari/pafta-yerlesimi", category: "Tasarım", icon: "▦" },
  { title: "Detay Kesit ve U-Değeri Tasarımcısı", href: "/proje-araclari/u-degeri-tasarimcisi", category: "Teknik", icon: "U" },
  { title: "Yönetmelik Kontrolü", href: "/proje-araclari/yonetmelik-kontrol", category: "Teknik", icon: "§" },
  { title: "Jüri Gözü", href: "/teslim-araclari/juri-gozu", category: "Teslim", icon: "◉" },
  { title: "Teslim Kontrol Merkezi", href: "/teslim-araclari/kontrol-merkezi", category: "Teslim", icon: "✓" },
  { title: "Teslim Kontrol Listesi", href: "/student-tools/submission-checklist", category: "Teslim", icon: "☑" },
  { title: "Dosya Adı Oluşturucu", href: "/student-tools/file-name-generator", category: "Öğrenci", icon: "Aa" },
  { title: "GNO Hesaplayıcı", href: "/student-tools/gno-calculator", category: "Öğrenci", icon: "G" },
  { title: "Ders Notu Hesaplayıcı", href: "/student-tools/grade-calculator", category: "Öğrenci", icon: "%" },
  { title: "Devamsızlık Hesaplayıcı", href: "/student-tools/attendance-calculator", category: "Öğrenci", icon: "D" },
  { title: "Öğrenci Takvimi", href: "/student-tools/calendar", category: "Öğrenci", icon: "31" },
  { title: "Mimarlık AI Araç Bulucu", href: "/mimarlik-yapay-zeka/arac-bulucu", category: "AI", icon: "AI" },
  { title: "Mimari Prompt Oluşturucu", href: "/mimarlik-yapay-zeka/prompt-olusturucu", category: "AI", icon: "✦" },
];

export const workspaceItemMap = new Map(
  workspaceItems.map((item) => [item.href, item])
);
