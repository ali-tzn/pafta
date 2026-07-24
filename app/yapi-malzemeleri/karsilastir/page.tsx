import type { Metadata } from "next";
import MaterialComparison from "./MaterialComparison";

export const metadata: Metadata = {
  title: "Yapı Malzemesi Karşılaştırma Aracı",
  description:
    "Tuğla, gazbeton, bims, yalıtım, cam, ahşap, sıva, beton ve zemin malzemelerini temel performans ölçütleriyle yan yana karşılaştır.",
  alternates: { canonical: "/yapi-malzemeleri/karsilastir" },
};

export default function MaterialComparisonPage() {
  return <MaterialComparison />;
}
