import type { Metadata } from "next";
import { ToolSeo } from "@/lib/seo";

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
  return <ToolSeo title="Mimarlık Birim Dönüştürücü" description="Uzunluk, alan, hacim ve mimari ölçek birimlerini dönüştürün." path="/tools/architecture-unit-converter" category="DesignApplication" features={["Uzunluk dönüşümü", "Alan dönüşümü", "Hacim dönüşümü", "Mimari ölçek"]}>{children}</ToolSeo>;
}
