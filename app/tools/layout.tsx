import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({ title: "Mimari Hesaplama Araçları", description: "Ölçek, alan, merdiven, rampa, TAKS–KAKS, beton, çatı ve diğer mimari hesaplamaları ücretsiz yapın.", path: "/tools", keywords: ["mimari hesaplama", "mimarlık araçları", "ölçek hesaplama", "metraj", "imar hesabı"] });

export default function ToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
