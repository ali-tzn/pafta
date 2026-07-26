import type { Metadata } from "next";
import { ToolSeo } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mimari Teslim Kontrol Merkezi | Pafta ve Portfolyo Denetimi",
  description:
    "PDF, JPG veya PNG paftanın kâğıt ölçüsünü, yönünü, dosya boyutunu, sayfa sayısını, çözünürlüğünü ve dosya adını teslimden önce ücretsiz kontrol et.",
  alternates: {
    canonical: "/teslim-araclari/kontrol-merkezi",
  },
};

export default function SubmissionInspectorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ToolSeo title="Mimari Teslim Kontrol Merkezi" description="Pafta ve portfolyo dosyalarının ölçü, yön, DPI ve dosya bilgilerini denetleyin." path="/teslim-araclari/kontrol-merkezi" category="DesignApplication" features={["PDF ve görsel analizi", "Kâğıt ölçüsü", "DPI kontrolü", "Dosya adı denetimi"]}>{children}</ToolSeo>;
}
