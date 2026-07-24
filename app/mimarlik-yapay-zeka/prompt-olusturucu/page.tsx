import type { Metadata } from "next";
import PromptBuilder from "./PromptBuilder";

export const metadata: Metadata = {
  title: "Mimari Prompt Oluşturucu – Ücretsiz AI Prompt Aracı",
  description: "Mimari görselleştirme için yapı, bağlam, malzeme, ışık ve kamera bilgileriyle ayrıntılı Türkçe ve İngilizce prompt oluştur.",
  alternates: { canonical: "/mimarlik-yapay-zeka/prompt-olusturucu" },
};

export default function PromptBuilderPage() {
  return <PromptBuilder />;
}
