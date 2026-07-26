import type { Metadata } from "next";
import DetailLibrary from "./DetailLibrary";

export const metadata: Metadata = {
  title: "Mimari Detay Kütüphanesi – Yapı Detayları",
  description: "Cephe, çatı, temel, ıslak hacim ve doğrama birleşimlerini katmanları, kontrol noktaları ve yaygın hatalarıyla inceleyin.",
  alternates: { canonical: "/mimari-detaylar" },
};

export default function ArchitecturalDetailsPage() {
  return <DetailLibrary />;
}
