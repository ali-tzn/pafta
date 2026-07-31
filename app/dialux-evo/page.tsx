import type { Metadata } from "next";
import SoftwareGuideIndex from "@/app/components/SoftwareGuideIndex";
import { getSoftwareCatalog } from "@/app/software-guide-data";
const catalog = getSoftwareCatalog("dialux-evo")!;
export const metadata: Metadata = { title: "DIALux evo Rehberleri: Lux, UGR ve Aydınlatma", description: catalog.description, alternates: { canonical: "/dialux-evo" } };
export default function Page() { return <SoftwareGuideIndex catalog={catalog} />; }
