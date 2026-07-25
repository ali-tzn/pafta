import type { Metadata } from "next";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import HomeHighlights from "./components/HomeHighlights";

export const metadata: Metadata = {
  title: "PAFTA – Mimarlık Öğrencileri İçin Araçlar ve Rehberler",
  description:
    "Ücretsiz PDF araçları, mimari hesaplamalar, Revit ve BIM rehberleri, yapı malzemeleri ve proje kaynaklarıyla mimarlık öğrencilerinin dijital kampüsü.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Hero />
      <Categories />
      <HomeHighlights />
    </main>
  );
}
