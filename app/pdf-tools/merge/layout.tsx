import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PDF Birleştirme – Ücretsiz ve Güvenli PDF Birleştir",
  description:
    "Birden fazla PDF dosyasını istediğin sıraya koyarak ücretsiz birleştir. Dosyalar yüklenmeden, doğrudan tarayıcında işlenir.",
  alternates: { canonical: "/pdf-tools/merge" },
  openGraph: {
    title: "Ücretsiz PDF Birleştirme | PAFTA",
    description:
      "PDF dosyalarını sırala ve cihazından yüklemeden tek dosyada birleştir.",
    type: "website",
  },
};

export default function MergeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PAFTA PDF Birleştirme",
            url: "https://paftaedu.com/pdf-tools/merge",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
            featureList:
              "PDF sıralama, sayfa sayısı görüntüleme, tarayıcıda güvenli birleştirme",
          }).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
