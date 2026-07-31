import type { Metadata } from "next";
import SoftwareGuideIndex from "@/app/components/SoftwareGuideIndex";
import { getSoftwareCatalog } from "@/app/software-guide-data";
const catalog = getSoftwareCatalog("d5-render")!;
export const metadata: Metadata = { title: "D5 Render Rehberleri: Malzeme, Işık ve Animasyon", description: catalog.description, alternates: { canonical: "/d5-render" } };
export default function Page() { return <SoftwareGuideIndex catalog={catalog} />; }
