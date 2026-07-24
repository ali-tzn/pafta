import type { Metadata } from "next";
import AiToolFinder from "./AiToolFinder";

export const metadata: Metadata = {
  title: "Mimarlık AI Araç Bulucu – Doğru Yapay Zekâ İş Akışını Seç",
  description: "Mimari proje aşamasını ve yapmak istediğin işi seç; uygun yapay zekâ araç kategorisini, iş akışını ve kontrol listesini öğren.",
  alternates: { canonical: "/mimarlik-yapay-zeka/arac-bulucu" },
};

export default function AiToolFinderPage() {
  return <AiToolFinder />;
}
