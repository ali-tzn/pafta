import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({ title: "Teslim Araçları – Pafta, Portfolyo ve Jüri Hazırlığı", description: "Mimari pafta, portfolyo ve jüri teslimlerini teknik şartlara göre kontrol et; ölçü, çözünürlük ve okunabilirlik sorunlarını düzelt.", path: "/teslim-araclari", keywords: ["mimari teslim", "pafta kontrolü", "jüri hazırlığı", "portfolyo kontrolü"] });

export default function DeliveryToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
