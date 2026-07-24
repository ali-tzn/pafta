import type { Metadata } from "next";
import ResizePdfPages from "./ResizePdfPages";

export const metadata: Metadata = {
  title: "PDF Pafta Boyutu ve Ölçek Ayarlama",
  description:
    "PDF paftaları A0, A1, A2, A3, A4, A5 veya özel sayfa boyutuna dönüştür. Çizim ölçeğini koru ya da içeriği yeni sayfaya sığdır.",
  alternates: {
    canonical: "/pdf-tools/resize-pages",
  },
};

export default function ResizePdfPagesPage() {
  return <ResizePdfPages />;
}
