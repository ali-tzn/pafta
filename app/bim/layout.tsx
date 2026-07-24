import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BIM Rehberleri",
  description:
    "BIM temelleri, LOD seviyeleri, koordinasyon ve model yönetimi hakkında mimarlık öğrencilerine yönelik Türkçe içerikler.",
};

export default function BimLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
