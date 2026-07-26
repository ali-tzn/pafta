import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({ title: "BIM Rehberleri – LOD, IFC ve Koordinasyon", description: "BIM temelleri, LOD seviyeleri, IFC, koordinasyon ve model yönetimi hakkında mimarlık öğrencilerine yönelik Türkçe içerikler.", path: "/bim", keywords: ["BIM rehberi", "LOD", "IFC", "BIM koordinasyonu", "yapı bilgi modellemesi"] });

export default function BimLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
