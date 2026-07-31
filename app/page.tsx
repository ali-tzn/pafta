import type { Metadata } from "next";
import Hero from "./components/Hero";
import Categories from "./components/Categories";

export const metadata: Metadata = {
  title: {
    absolute: "PAFTA – Mimarlık Öğrencileri İçin Araçlar ve Rehberler",
  },
  description:
    "Ücretsiz PDF araçları, mimari hesaplamalar, Revit, AutoCAD, SketchUp, Rhino ve BIM rehberleriyle mimarlık öğrencilerinin dijital kampüsü.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Hero />
      <Categories />
    </main>
  );
}
