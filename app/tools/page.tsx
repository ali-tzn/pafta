import CategoryHub, { type CategoryHubItem } from "@/app/components/CategoryHub";
import { tools } from "@/lib/tools";

const extraTools: CategoryHubItem[] = [
  {
    title: "Katman ve U-Değeri Tasarımcısı",
    description: "Duvar, çatı ve döşeme katmanlarını kur; ısıl direnci ve U-değerini hesapla.",
    href: "/proje-araclari/u-degeri-tasarimcisi",
    icon: "▤",
    group: "Yapı Fiziği",
    badge: "Gelişmiş",
    featured: true,
  },
  {
    title: "Yönetmelik Kontrol Asistanı",
    description: "Parsel ve proje verilerinden imar, çekme, oturum ve belge ön kontrol raporu oluştur.",
    href: "/proje-araclari/yonetmelik-kontrol",
    icon: "§",
    group: "İmar",
    badge: "Gelişmiş",
    featured: true,
  },
];

const featuredHrefs = new Set([
  "/tools/taks-kaks",
  "/tools/scale-calculator",
]);

const allTools: CategoryHubItem[] = [
  ...extraTools,
  ...tools.map((tool) => ({
    title: tool.title,
    description: tool.description,
    href: tool.href,
    icon: tool.icon,
    group: normalizeGroup(tool.category),
    badge: featuredHrefs.has(tool.href) ? "Popüler" : undefined,
    featured: featuredHrefs.has(tool.href),
  })),
];

function normalizeGroup(category: string) {
  if (category.includes("İmar")) return "İmar";
  if (category.includes("Temel")) return "Ölçek ve Birim";
  if (category.includes("Uygulama")) return "Metraj";
  return "Mimari Hesap";
}

export default function ToolsPage() {
  return (
    <CategoryHub
      eyebrow="PAFTA / Hesap Araçları"
      title="Mimari hesap araçları"
      description="İmar, ölçek, yapı fiziği, merdiven, rampa ve metraj hesaplarını konuya göre filtrele; ihtiyacın olan araca doğrudan ulaş."
      items={allTools}
      searchPlaceholder="Ölçek, emsal, merdiven, beton..."
      footerTitle="Hesabı proje kararıyla birlikte değerlendir"
      footerText="Araçlar hızlı ön hesap üretir. Uygulama ve ruhsat kararlarında proje koşulları, yürürlükteki mevzuat ve yetkili kurum verileri ayrıca kontrol edilmelidir."
      faqs={[
        { question: "Mimari hesap araçları ücretsiz mi?", answer: "Evet. PAFTA’daki mevcut hesap araçları tarayıcı üzerinden ücretsiz kullanılabilir." },
        { question: "Sonuçlar uygulama projesinde doğrudan kullanılabilir mi?", answer: "Araçlar ön hesap ve kontrol içindir. Uygulama kararları yürürlükteki mevzuat, proje koşulları ve uzman hesaplarıyla doğrulanmalıdır." },
        { question: "Ondalık sayıları virgülle yazabilir miyim?", answer: "Gelişmiş araçların çoğu Türkçe ondalık virgülünü kabul eder. Her giriş alanındaki örneği izleyebilirsin." },
      ]}
      related={[
        { title: "Tasarım araçları", href: "/proje-araclari" },
        { title: "Yapı malzemeleri", href: "/yapi-malzemeleri" },
      ]}
    />
  );
}
