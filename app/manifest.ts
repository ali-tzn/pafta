import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PAFTA — Mimarlık Öğrencilerinin Dijital Kampüsü",
    short_name: "PAFTA",
    description:
      "Mimarlık öğrencileri için hesaplama, PDF, Revit ve BIM araçları.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "tr",
    icons: [
      {
        src: "/pafta-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pafta-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
