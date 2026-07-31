import type { Metadata } from "next";
import ApplicationGuideHub from "./ApplicationGuideHub";

export const metadata: Metadata = {
  title: "Mimari Uygulama Rehberi: CAD, BIM, Render ve Pafta",
  description:
    "Mimari çizim, Revit, AutoCAD, SketchUp, Rhino, Grasshopper, BIM, detay ve proje üretimi için aranabilir kapsamlı rehber merkezi.",
  alternates: { canonical: "/rehberler" },
};

export default function GuidesPage() {
  return <ApplicationGuideHub />;
}
