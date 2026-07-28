import type { Metadata } from "next";
import ApplicationGuideHub from "./ApplicationGuideHub";

export const metadata: Metadata = {
  title: "Mimari Uygulama Rehberi: Revit, BIM ve Proje Bilgisi",
  description:
    "Mimari çizim, uygulama, Revit, BIM, yapı programı, detay, yönetmelik ve proje üretimi için aranabilir kapsamlı rehber merkezi.",
  alternates: { canonical: "/rehberler" },
};

export default function GuidesPage() {
  return <ApplicationGuideHub />;
}
