import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mimarlık Birim Dönüştürücü | Uzunluk, Alan, Hacim ve Ölçek",
  description:
    "Mimarlar ve mimarlık öğrencileri için ücretsiz birim dönüştürücü. mm, cm, m, inç, feet; m², cm²; m³, litre ve pafta ölçeği dönüşümleri.",
  alternates: {
    canonical: "/tools/architecture-unit-converter",
  },
};

export default function ArchitectureUnitConverterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
