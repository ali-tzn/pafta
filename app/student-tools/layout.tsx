import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mimarlık Öğrencisi Araçları",
  description:
    "GNO, ders notu, devamsızlık, teslim kontrolü, dosya adı ve öğrenci takvimi araçlarını ücretsiz kullanın.",
};

export default function StudentToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
