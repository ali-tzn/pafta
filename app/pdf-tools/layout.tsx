import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({ title: "Ücretsiz PDF Araçları – Birleştir, Sıkıştır ve Dönüştür", description: "PDF birleştirme, sıkıştırma, ayırma, sayfa düzenleme, filigran ve PDF’den PNG’ye dönüştürme araçlarını ücretsiz kullanın.", path: "/pdf-tools", keywords: ["ücretsiz pdf araçları", "pdf birleştirme", "pdf sıkıştırma", "pdf dönüştürme", "pdf düzenleme"] });

export default function PdfToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
