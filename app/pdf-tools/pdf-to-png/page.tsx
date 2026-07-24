import type { Metadata } from "next";
import PdfToPngClient from "./PdfToPngClient";

export const metadata: Metadata = {
  title: "PDF’den PNG’ye Dönüştürme – Ücretsiz ve Yüksek Kaliteli",
  description:
    "PDF sayfalarını ücretsiz ve yüksek kaliteli PNG görsellerine dönüştür. İstediğin sayfaları seç, ayrı indir veya tek ZIP dosyası oluştur.",
  alternates: {
    canonical: "/pdf-tools/pdf-to-png",
  },
  keywords: [
    "PDF PNG çevirme",
    "PDF PNG dönüştürücü",
    "PDF sayfalarını PNG yapma",
    "ücretsiz PDF PNG",
    "mimari paftayı PNG yapma",
  ],
};

const frequentlyAskedQuestions = [
  {
    question: "PDF’den PNG’ye dönüştürme ücretsiz mi?",
    answer:
      "Evet. PAFTA PDF’den PNG’ye dönüştürme aracı ücretsiz olarak kullanılabilir.",
  },
  {
    question: "PDF dosyam sunucuya yükleniyor mu?",
    answer:
      "Hayır. Uygun tarayıcılarda PDF ve PNG işlemleri doğrudan cihazında gerçekleştirilir.",
  },
  {
    question: "Birden fazla PDF sayfasını dönüştürebilir miyim?",
    answer:
      "Evet. Tüm sayfaları veya 1-3, 5, 8 gibi özel bir sayfa aralığını seçebilirsin.",
  },
  {
    question: "Mimari pafta için hangi çözünürlüğü seçmeliyim?",
    answer:
      "Ekran sunumu için Yüksek, çizgi ve yazıların daha keskin olması gereken büyük paftalar için Çok yüksek seçeneği uygundur.",
  },
];

export default function PdfToPngPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PAFTA PDF’den PNG’ye Dönüştürücü",
    url: "https://paftaedu.com/pdf-tools/pdf-to-png",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    featureList: [
      "PDF sayfalarını PNG formatına dönüştürme",
      "Sayfa aralığı seçme",
      "Yüksek çözünürlüklü çıktı",
      "PNG dosyalarını ZIP olarak indirme",
      "Tarayıcıda yerel dosya işleme",
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: frequentlyAskedQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData).replace(/</g, "\\u003c"),
        }}
      />
      <PdfToPngClient frequentlyAskedQuestions={frequentlyAskedQuestions} />
    </>
  );
}
