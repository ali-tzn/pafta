import type { Metadata } from "next";
import SoftwareGuideIndex from "@/app/components/SoftwareGuideIndex";
import { getSoftwareCatalog } from "@/app/software-guide-data";

const catalog = getSoftwareCatalog("autocad")!;
export const metadata: Metadata = {
  title: "AutoCAD Rehberleri: Çizim, Ölçek, Xref ve PDF",
  description: catalog.description,
  alternates: { canonical: "/autocad" },
};
export default function AutoCadPage() { return <SoftwareGuideIndex catalog={catalog} />; }

