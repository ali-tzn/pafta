import type { Metadata } from "next";

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
  return children;
}
