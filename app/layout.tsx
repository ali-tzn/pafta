import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ConsentManager from "./components/ConsentManager";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | PAFTA",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "PAFTA" }],
  creator: "PAFTA",
  publisher: "PAFTA",
  category: "education",
  keywords: [
    "mimarlık",
    "mimarlık öğrencisi",
    "Revit",
    "BIM",
    "mimari hesaplama",
    "PDF araçları",
    "ölçek hesaplama",
    "merdiven hesaplama",
    "mimarlık kaynakları",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/pafta-logo-blue.png",
        alt: "PAFTA — Mimarlık Öğrencilerinin Dijital Kampüsü",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/pafta-logo-blue.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              inLanguage: "tr-TR",
            }).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        {children}
        <Footer />
        <ConsentManager />
      </body>
    </html>
  );
}
