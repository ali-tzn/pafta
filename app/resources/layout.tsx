import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mimarlık Kaynakları",
  description:
    "CAD blokları, Revit family kaynakları, proje dosyaları ve mimarlık öğrencileri için seçilmiş dijital kaynaklar.",
};

export default function ResourcesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
