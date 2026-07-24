import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revit Rehberleri",
  description:
    "Mimarlık öğrencileri için Revit modelleme, duvar, malzeme, family ve uygulama sorunlarına yönelik Türkçe rehberler.",
};

export default function RevitLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
