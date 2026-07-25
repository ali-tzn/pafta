import type { Metadata } from "next";
import AiToolFinder from "./AiToolFinder";

export const metadata: Metadata = {
  title: "Mimarlık AI Araç Bulucu – İşine En Uygun Yapay Zekâyı Bul",
  description: "Yapmak istediğin mimari işi, elindeki girdiyi, önceliğini ve bütçeni seç; sana en uygun AI aracını ve güçlü alternatiflerini öğren.",
  alternates: { canonical: "/mimarlik-yapay-zeka/arac-bulucu" },
};

export default function AiToolFinderPage() {
  return <AiToolFinder />;
}
