export const siteConfig = {
  name: "PAFTA",
  title: "PAFTA — Mimarlık Öğrencilerinin Dijital Kampüsü",
  description:
    "Mimarlık öğrencileri için ücretsiz hesaplama araçları, PDF araçları, Revit ve BIM rehberleri ile proje kaynakları.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  locale: "tr_TR",
} as const;
