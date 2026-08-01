import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import {
  materialCategories,
  materials,
} from "@/app/yapi-malzemeleri/materials";
import { architectureArticles } from "@/app/mimarlik/articles";
import { architectureCategories } from "@/app/mimarlik/categories";
import { revitGuides } from "@/app/revit/guides";
import { bimGuides } from "@/app/bim/guides";
import { guideCollections } from "@/app/rehberler/guides";
import { caseStudies, spaceStandards } from "@/app/proje-araclari/data";
import { architecturalDetails } from "@/app/mimari-detaylar/details";
import { softwareCatalogs } from "@/app/software-guide-data";

const materialRoutes = [
  "/yapi-malzemeleri",
  "/yapi-malzemeleri/karsilastir",
  ...materialCategories.map(
    (category) => `/yapi-malzemeleri/${category.slug}`
  ),
  ...materials.map(
    (material) =>
      `/yapi-malzemeleri/${material.category}/${material.slug}`
  ),
];

const expandedContentRoutes = [
  ...architectureArticles.map((article) => `/mimarlik/${article.slug}`),
  ...architectureCategories
    .filter((category) =>
      architectureArticles.some((article) => article.category === category.label)
    )
    .map((category) => `/mimarlik/kategori/${category.slug}`),
  ...revitGuides.map((guide) => `/revit/${guide.slug}`),
  ...bimGuides.map((guide) => `/bim/${guide.slug}`),
  ...softwareCatalogs.flatMap((catalog) => [
    `/${catalog.slug}`,
    ...catalog.guides.map((guide) => `/${catalog.slug}/${guide.slug}`),
  ]),
  "/mimarlik-yapay-zeka",
  "/mimarlik-yapay-zeka/prompt-olusturucu",
  "/mimarlik-yapay-zeka/arac-bulucu",
  "/rehberler",
  ...guideCollections.map((guide) => `/rehberler/${guide.slug}`),
];

const routes = [
  "",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/mimarlik",
  "/mimarlik/modernizm-nedir",
  "/mimarlik/bauhaus-nedir",
  "/mimarlik/brutalizm-nedir",
  "/mimarlik/postmodernizm-nedir",
  "/mimarlik/dekonstruktivizm-nedir",
  "/mimarlik/kategori/akimlar",
  ...materialRoutes,
  ...expandedContentRoutes,
  "/tools",
  "/kutuphaneler",
  "/mimari-detaylar",
  ...architecturalDetails.map((detail) => `/mimari-detaylar/${detail.slug}`),
  "/proje-araclari",
  "/proje-araclari/proje-baslangic",
  "/proje-araclari/balon-diyagrami",
  "/proje-araclari/gunes-yonlenme",
  "/proje-araclari/vaziyet-simulatoru",
  "/proje-araclari/u-degeri-tasarimcisi",
  "/proje-araclari/mekan-olculeri",
  ...spaceStandards.map((space) => `/proje-araclari/mekan-olculeri/${space.slug}`),
  "/proje-araclari/pafta-yerlesimi",
  "/proje-araclari/emsal-atlasi",
  ...caseStudies.map((item) => `/proje-araclari/emsal-atlasi/${item.slug}`),
  "/proje-araclari/yonetmelik-kontrol",
  "/tools/architecture-unit-converter",
  "/tools/area-calculator",
  "/tools/brick-calculator",
  "/tools/concrete-calculator",
  "/tools/parking-calculator",
  "/tools/ramp-calculator",
  "/tools/roof-calculator",
  "/tools/scale-calculator",
  "/tools/sheet-scale-converter",
  "/tools/slope-calculator",
  "/tools/stair-calculator",
  "/tools/taks-kaks",
  "/tools/tile-calculator",
  "/tools/wall-paint-calculator",
  "/student-tools",
  "/teslim-araclari",
  "/teslim-araclari/kontrol-merkezi",
  "/teslim-araclari/juri-gozu",
  "/student-tools/attendance-calculator",
  "/student-tools/calendar",
  "/student-tools/file-name-generator",
  "/student-tools/gno-calculator",
  "/student-tools/grade-calculator",
  "/student-tools/submission-checklist",
  "/pdf-tools",
  "/pdf-tools/compress",
  "/pdf-tools/images-to-pdf",
  "/pdf-tools/info",
  "/pdf-tools/merge",
  "/pdf-tools/organize",
  "/pdf-tools/page-numbers",
  "/pdf-tools/pdf-to-png",
  "/pdf-tools/split",
  "/pdf-tools/resize-pages",
  "/pdf-tools/watermark",
  "/revit",
  "/revit/kolon-yuzeyine-siva-ekleme",
  "/revit/d5-render-malzeme-aktarma",
  "/revit/indirilen-family-nasil-yuklenir",
  "/revit/wall-sweep-neden-secilmiyor",
  "/bim",
  "/bim/bim-nedir",
  "/bim/koordinasyon",
  "/bim/lod-seviyeleri",
  "/resources",
  "/resources/cad-blok-kaynaklari",
  "/resources/revit-family-kaynaklari",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return Array.from(new Set(routes)).map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: "2026-08-01",
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.split("/").length === 2 ? 0.9 : 0.8,
  }));
}
