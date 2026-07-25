import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teslim Araçları | Pafta, Portfolyo ve Jüri Hazırlığı",
  description:
    "Mimari pafta, portfolyo ve jüri teslimlerini teknik şartlara göre kontrol et; dosya boyutu, ölçü, çözünürlük ve adlandırma sorunlarını düzelt.",
  alternates: {
    canonical: "/teslim-araclari",
  },
};

export default function DeliveryToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
