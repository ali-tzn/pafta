import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({ title: "Mimarlık Kaynakları – CAD, Revit ve Proje Arşivleri", description: "CAD blokları, Revit family kaynakları, proje dosyaları ve mimarlık öğrencileri için seçilmiş dijital kaynaklar.", path: "/resources", keywords: ["mimarlık kaynakları", "CAD blok", "Revit family", "mimari proje kaynakları"] });

export default function ResourcesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
