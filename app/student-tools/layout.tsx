import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({ title: "Mimarlık Öğrencisi Araçları", description: "GNO, ders notu, devamsızlık, teslim kontrolü, dosya adı ve öğrenci takvimi araçlarını ücretsiz kullanın.", path: "/student-tools", keywords: ["öğrenci araçları", "gno hesaplama", "devamsızlık", "ders notu", "mimarlık öğrencisi"] });

export default function StudentToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
