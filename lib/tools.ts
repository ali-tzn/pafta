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
      "Döşeme, kolon, kiriş ve temel ölçülerinden toplam beton hacmini ve yaklaşık transmikser ihtiyacını hesapla.",
    href: "/tools/concrete-calculator",
    category: "Uygulama",
    status: "Hazır",
    icon: "🧱",
  },
  {
    title: "Eğim Hesaplayıcı",
    description:
      "Kot farkı ve yatay mesafeden yüzde eğimi, eğim oranını ve açıyı hesapla.",
    href: "/tools/slope-calculator",
    category: "Mimari",
    status: "Hazır",
    icon: "📈",
  },
  {
    title: "Otopark Hesaplayıcı",
    description:
      "Mevcut alandan araç kapasitesini veya hedef araç sayısı için gerekli yaklaşık otopark alanını hesapla.",
    href: "/tools/parking-calculator",
    category: "Mimari",
    status: "Hazır",
    icon: "🚗",
  },
  {
  title: "Çatı Hesaplayıcı",
  description:
    "Çatı eğimine göre mahya yüksekliğini, mertek uzunluğunu ve yaklaşık kaplama alanını hesapla.",
  href: "/tools/roof-calculator",
  category: "Mimari",
  status: "Hazır",
  icon: "🏠",
  },
  {
  title: "Seramik ve Karo Hesaplayıcı",
  description:
    "Alan, karo ölçüsü, derz ve fire payından gerekli karo ve kutu sayısını hesapla.",
  href: "/tools/tile-calculator",
  category: "Uygulama",
  status: "Hazır",
  icon: "◫",
 },
  {
    title: "Rampa Hesaplayıcı",
    description:
      "Kot farkı ve eğim oranına göre rampa uzunluğunu veya mevcut eğimi hesapla.",
    href: "/tools/ramp-calculator",
    icon: "📐",
    category: "Mimari Hesaplar",
    status: "Hazır",
  },
  {
  title: "Tuğla Hesaplayıcı",
  description:
    "Duvar alanı, tuğla ölçüsü ve fire payından gerekli tuğla ve paket sayısını hesapla.",
  href: "/tools/brick-calculator",
  category: "Uygulama",
  status: "Hazır",
  icon: "🧱",
  },
  {
  title: "Duvar ve Boya Hesaplayıcı",
  description:
    "Kapı ve pencere boşluklarını düşerek net duvar alanını ve gerekli boya miktarını hesapla.",
  href: "/tools/wall-paint-calculator",
  category: "Uygulama",
  status: "Hazır",
  icon: "🎨",
  },
];

