import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: "PAFTA | Mimarlık Öğrencilerinin Dijital Kampüsü",
    template: "%s | PAFTA",
  },
  description:
    "Mimarlık öğrencileri için hesap araçları, Revit rehberleri, CAD kaynakları ve dijital mimarlık içerikleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-white antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
