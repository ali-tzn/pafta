import type { Metadata } from "next";
import SiteLayoutSimulator from "./SiteLayoutSimulator";

export const metadata: Metadata = {
  title: "Vaziyet Yerleşimi ve Yapı Oturumu Simülatörü | PAFTA",
  description:
    "Parsel ölçüleri, çekme mesafeleri ve yapı oturumunu görsel olarak düzenleyin; yerleşim, açık alan ve yönlenme kararlarını karşılaştırın.",
  alternates: { canonical: "/proje-araclari/vaziyet-simulatoru" },
};

export default function SiteLayoutPage() {
  return <SiteLayoutSimulator />;
}
