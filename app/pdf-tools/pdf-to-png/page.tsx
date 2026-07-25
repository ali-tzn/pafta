import type { Metadata } from "next";
import PdfToPngClient from "./PdfToPngClient";

export const metadata: Metadata = {
  title: "PDF’den PNG veya JPG’ye Dönüştürme – 300 DPI Ücretsiz",
  description:
    "PDF sayfalarını 96, 150 veya 300 DPI çözünürlükte PNG ve JPG görsellerine dönüştür. Sayfaları seç, ayrı indir veya ZIP oluştur.",
  alternates: {
    canonical: "/pdf-tools/pdf-to-png",
  },
  keywords: [
    "PDF PNG çevirme",
    "PDF PNG dönüştürücü",
    "PDF sayfalarını PNG yapma",
    "ücretsiz PDF PNG",
    "mimari paftayı PNG yapma",
    "PDF JPG dönüştürme",
    "PDF 300 DPI PNG",
  ],
};

const frequentlyAskedQuestions = [
  {
    question: "PDF’yi JPG formatına da dönüştürebilir miyim?",
    answer:
      "Evet. Çıktı formatından JPG seçebilir ve yüzde 50 ile 100 arasında görüntü kalitesini ayarlayabilirsin.",
  },
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
      "Hızlı ekran kullanımı için 96 DPI, sunum için 150 DPI, büyük pafta ve baskıya yakın kullanım için 300 DPI seçeneğini kullanabilirsin.",
  },
];

export default function PdfToPngPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PAFTA PDF’den PNG ve JPG’ye Dönüştürücü",
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
      "PDF sayfalarını JPG formatına dönüştürme",
      "96, 150 ve 300 DPI çözünürlük seçimi",
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
