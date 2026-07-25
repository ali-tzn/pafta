import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PDF Sıkıştırma – PDF Boyutunu Ücretsiz Küçült",
  description:
    "PDF dosya boyutunu hafif, dengeli veya güçlü sıkıştırma seçenekleriyle ücretsiz küçült. İşlem güvenli biçimde tarayıcında yapılır.",
  alternates: { canonical: "/pdf-tools/compress" },
  openGraph: {
    title: "Ücretsiz PDF Sıkıştırma | PAFTA",
    description:
      "PDF dosyanı cihazından ayrılmadan sıkıştır ve boyut kazancını karşılaştır.",
    type: "website",
  },
};

export default function CompressLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PAFTA PDF Sıkıştırma",
            url: "https://paftaedu.com/pdf-tools/compress",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
            featureList:
              "Üç sıkıştırma seviyesi, dosya boyutu karşılaştırması, tarayıcıda yerel işlem",
          }).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
