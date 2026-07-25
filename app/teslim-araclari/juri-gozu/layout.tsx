import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jüri Gözü | Pafta Okunabilirlik ve Jüri Mesafesi Simülatörü",
  description:
    "Mimari paftandaki küçük yazıları, baskı kenarı risklerini ve yoğun bölgeleri bul; paftanın 1, 2 ve 3 metre jüri mesafesinden görünümünü ücretsiz simüle et.",
  alternates: {
    canonical: "/teslim-araclari/juri-gozu",
  },
};

export default function JuryEyeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
