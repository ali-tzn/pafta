import type { Metadata } from "next";
import ResizePdfPages from "./ResizePdfPages";

export const metadata: Metadata = {
  title: "PDF Pafta Ölçeği Değiştirme – 1/100, 1/50 ve Kâğıt Boyutu",
  description:
    "PDF paftayı 1/100'den 1/50 veya 1/200 ölçeğe dönüştür; A0, A1, A2, A3 ve A4 kâğıt boyutlarını ayarla. Ücretsiz ve tarayıcıda güvenli.",
  alternates: {
    canonical: "/pdf-tools/resize-pages",
  },
};

export default function ResizePdfPagesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PDF Pafta Boyutu ve Ölçek Dönüştürme",
            url: "https://paftaedu.com/pdf-tools/resize-pages",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "TRY",
            },
            featureList:
              "PDF ölçek dönüştürme, ölçeği koruma, sayfaya sığdırma, A0-A5 ve özel kâğıt boyutu",
          }).replace(/</g, "\\u003c"),
        }}
      />
      <ResizePdfPages />
    </>
  );
}
