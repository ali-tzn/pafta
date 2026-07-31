import type { Metadata } from "next";
import SoftwareGuideIndex from "@/app/components/SoftwareGuideIndex";
import { getSoftwareCatalog } from "@/app/software-guide-data";
const catalog = getSoftwareCatalog("photoshop")!;
export const metadata: Metadata = { title: "Photoshop Mimarlık Rehberleri: Pafta, Plan ve Kolaj", description: catalog.description, alternates: { canonical: "/photoshop" } };
export default function Page() { return <SoftwareGuideIndex catalog={catalog} />; }
