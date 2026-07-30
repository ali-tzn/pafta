import type { Metadata } from "next";
import SoftwareGuideIndex from "@/app/components/SoftwareGuideIndex";
import { getSoftwareCatalog } from "@/app/software-guide-data";

const catalog = getSoftwareCatalog("sketchup")!;
export const metadata: Metadata = {
  title: "SketchUp Rehberleri: Modelleme, LayOut ve Performans",
  description: catalog.description,
  alternates: { canonical: "/sketchup" },
};
export default function SketchUpPage() { return <SoftwareGuideIndex catalog={catalog} />; }

