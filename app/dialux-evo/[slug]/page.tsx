import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SoftwareGuideArticle from "@/app/components/SoftwareGuideArticle";
import { getSoftwareCatalog } from "@/app/software-guide-data";
import { createSeoMetadata } from "@/lib/seo";
const catalog = getSoftwareCatalog("dialux-evo")!;
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return catalog.guides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const guide = catalog.guides.find((item) => item.slug === slug); return guide ? createSeoMetadata({ title: guide.title, description: guide.description, path: `/dialux-evo/${slug}`, keywords: ["DIALux evo", "aydınlatma hesabı", "lux", guide.category, ...guide.keyPoints] }) : {}; }
export default async function Page({ params }: Props) { const { slug } = await params; const guide = catalog.guides.find((item) => item.slug === slug); if (!guide) notFound(); return <SoftwareGuideArticle catalog={catalog} guide={guide} />; }
