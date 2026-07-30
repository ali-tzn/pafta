import type { Metadata } from "next";
import SoftwareGuideIndex from "@/app/components/SoftwareGuideIndex";
import { getSoftwareCatalog } from "@/app/software-guide-data";

const catalog = getSoftwareCatalog("rhino")!;
export const metadata: Metadata = {
  title: "Rhino Rehberleri: NURBS, Grasshopper ve Modelleme",
  description: catalog.description,
  alternates: { canonical: "/rhino" },
};
export default function RhinoPage() { return <SoftwareGuideIndex catalog={catalog} />; }

