import type { Metadata } from "next";
import SoftwareGuideIndex from "@/app/components/SoftwareGuideIndex";
import { getSoftwareCatalog } from "@/app/software-guide-data";
const catalog = getSoftwareCatalog("grasshopper")!;
export const metadata: Metadata = { title: "Grasshopper Rehberleri: Parametrik Tasarım ve Data Tree", description: catalog.description, alternates: { canonical: "/grasshopper" } };
export default function Page() { return <SoftwareGuideIndex catalog={catalog} />; }
