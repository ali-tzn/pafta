import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mimari Hesaplama Araçları",
  description:
    "Ölçek, alan, merdiven, rampa, TAKS–KAKS, beton, çatı ve diğer mimari hesaplamaları ücretsiz yapın.",
};

export default function ToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
