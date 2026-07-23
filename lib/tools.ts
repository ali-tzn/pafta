export type Tool = {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
  status: "Hazır" | "Yakında";
};

export const tools: Tool[] = [
  {
    title: "Ölçek Hesaplayıcı",
    description:
      "Gerçek ölçüyü seçtiğin ölçeğe göre çizim ölçüsüne dönüştür.",
    href: "/tools/scale-calculator",
    icon: "📐",
    category: "Temel Hesaplar",
    status: "Hazır",
  },
  {
    title: "Merdiven Hesaplayıcı",
    description:
      "Kat yüksekliğine göre rıht sayısını, basamak genişliğini ve yatay uzunluğu hesapla.",
    href: "/tools/stair-calculator",
    icon: "🪜",
    category: "Mimari Hesaplar",
    status: "Hazır",
  },
  {
    title: "Alan Hesaplayıcı",
    description:
      "Dikdörtgen ve kare alanların metrekare hesabını hızlıca yap.",
    href: "/tools/area-calculator",
    icon: "📏",
    category: "Temel Hesaplar",
    status: "Hazır",
  },
  {
    title: "Beton Hacmi Hesaplayıcı",
    description:
      "Kolon, kiriş, döşeme ve temel için yaklaşık beton hacmini hesapla.",
    href: "/tools/concrete-calculator",
    icon: "🧱",
    category: "Yapı Hesapları",
    status: "Yakında",
  },
  {
    title: "Rampa Hesaplayıcı",
    description:
      "Kot farkı ve eğim yüzdesine göre gerekli rampa uzunluğunu hesapla.",
    href: "/tools/ramp-calculator",
    icon: "♿",
    category: "Mimari Hesaplar",
    status: "Yakında",
  },
  {
    title: "Otopark Hesaplayıcı",
    description:
      "Alan ve kullanım türüne göre yaklaşık otopark ihtiyacını hesapla.",
    href: "/tools/parking-calculator",
    icon: "🚗",
    category: "Yerleşim Hesapları",
    status: "Yakında",
  },
];

