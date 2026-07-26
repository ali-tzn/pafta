import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Teslim Dosyası Ön Kontrolü",
  alternates: { canonical: "/teslim-araclari/kontrol-merkezi" },
  robots: { index: false, follow: true },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
