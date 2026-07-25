import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TAKS KAKS Hesaplama – Emsal ve Taban Alanı Hesapla",
  description:
    "Parsel alanı, TAKS ve KAKS değerleriyle maksimum taban oturumunu, toplam emsale esas alanı ve yaklaşık kat alanını ücretsiz hesapla.",
  alternates: { canonical: "/tools/taks-kaks" },
  openGraph: {
    title: "TAKS–KAKS ve Emsal Hesaplama | PAFTA",
    description:
      "Parsel verilerini gir; taban oturumu, emsal alanı ve yaklaşık yapı sonuçlarını anında gör.",
    type: "website",
  },
};

export default function TaksKaksLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PAFTA TAKS–KAKS ve Emsal Hesaplama",
            url: "https://paftaedu.com/tools/taks-kaks",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
            featureList:
              "TAKS hesabı, KAKS ve emsal hesabı, yaklaşık kat alanı, yapı yüksekliği ve kopyalanabilir sonuç özeti",
          }).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
