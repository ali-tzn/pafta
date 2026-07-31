import type { Metadata } from "next";
import SoftwareGuideIndex from "@/app/components/SoftwareGuideIndex";
import { getSoftwareCatalog } from "@/app/software-guide-data";
const catalog = getSoftwareCatalog("blender")!;
export const metadata: Metadata = { title: "Blender Mimarlık Rehberleri: Modelleme ve Render", description: catalog.description, alternates: { canonical: "/blender" } };
export default function Page() { return <SoftwareGuideIndex catalog={catalog} />; }
