import type { Metadata } from "next";
import { ToolSeo } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Jüri Gözü – Mimari Pafta Okunabilirlik Simülatörü",
  description:
    "Mimari paftanı jüri mesafesinden incele; küçük yazıları, kenar risklerini, yoğun bölgeleri, görsel hiyerarşiyi ve siyah-beyaz görünümü teslimden önce kontrol et.",
  keywords: [
    "jüri gözü",
    "mimari pafta kontrolü",
    "pafta okunabilirlik",
    "mimari jüri",
    "pafta yoğunluk analizi",
    "pafta yazı boyutu",
  ],
  alternates: {
    canonical: "/teslim-araclari/juri-gozu",
  },
  openGraph: {
    title: "Jüri Gözü – Mimari Pafta Okunabilirlik Simülatörü",
    description:
      "Paftanı 1, 2 ve 3 metre jüri görünümünde incele; okunabilirlik ve görsel hiyerarşi sorunlarını teslimden önce bul.",
    url: "/teslim-araclari/juri-gozu",
    type: "website",
  },
};

export default function JuryEyeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ToolSeo title="Jüri Gözü – Mimari Pafta Okunabilirlik Simülatörü" description="Paftayı jüri mesafelerinde inceleyerek okunabilirlik ve yoğunluk sorunlarını bulun." path="/teslim-araclari/juri-gozu" category="DesignApplication" features={["1–3 metre görünümü", "Küçük yazı analizi", "Yoğunluk haritası", "Siyah-beyaz kontrol"]}>{children}</ToolSeo>;
}
