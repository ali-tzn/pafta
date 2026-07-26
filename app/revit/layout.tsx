import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({ title: "Revit Rehberleri – Modelleme ve Sorun Çözümleri", description: "Mimarlık öğrencileri için Revit modelleme, duvar, malzeme, family ve uygulama sorunlarına yönelik Türkçe rehberler.", path: "/revit", keywords: ["Revit rehberi", "Revit modelleme", "Revit family", "Revit sorunları", "BIM"] });

export default function RevitLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
