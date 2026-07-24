import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ücretsiz PDF Araçları",
  description:
    "PDF birleştirme, sıkıştırma, ayırma, sayfa düzenleme, filigran ve PDF’den PNG’ye dönüştürme araçları.",
};

export default function PdfToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
