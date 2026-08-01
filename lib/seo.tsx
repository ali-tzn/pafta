import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

type ToolSeoInput = SeoInput & {
  category: string;
  features: string[];
};

export function createSeoMetadata({
  title,
  description,
  path,
  keywords = [],
}: SeoInput): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: "/pafta-logo-blue.png", alt: `${title} — PAFTA` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/pafta-logo-blue.png"],
    },
  };
}

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function StructuredData({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}

export function ToolSeo({
  title,
  description,
  path,
  category,
  features,
  children,
}: ToolSeoInput & { children: ReactNode }) {
  const url = `${siteConfig.url}${path}`;
  const breadcrumbCategory =
    path.startsWith("/pdf-tools") ? ["PDF Araçları", "/pdf-tools"] :
    path.startsWith("/student-tools") ? ["Öğrenci Araçları", "/student-tools"] :
    path.startsWith("/teslim-araclari") ? ["Pafta ve Teslim", "/teslim-araclari"] :
    path.startsWith("/proje-araclari") ? ["Tasarım Araçları", "/proje-araclari"] :
    ["Teknik Proje ve Hesap", "/tools"];

  return (
    <>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: title,
            description,
            url,
            applicationCategory: category,
            operatingSystem: "Web",
            browserRequirements: "JavaScript etkin modern bir web tarayıcısı",
            inLanguage: "tr-TR",
            isAccessibleForFree: true,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "TRY",
            },
            featureList: features,
            provider: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Ana Sayfa",
                item: siteConfig.url,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: breadcrumbCategory[0],
                item: `${siteConfig.url}${breadcrumbCategory[1]}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: title,
                item: url,
              },
            ],
          },
        ]}
      />
      {children}
    </>
  );
}

export function ArticleSeo({
  title,
  description,
  path,
  section,
  sectionPath,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  section: string;
  sectionPath: string;
  keywords?: string[];
}) {
  const url = `${siteConfig.url}${path}`;
  return (
    <StructuredData
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          url,
          mainEntityOfPage: url,
          inLanguage: "tr-TR",
          articleSection: section,
          keywords,
          dateModified: "2026-08-01",
          author: {
            "@type": "Organization",
            name: "PAFTA Editoryal Ekibi",
            url: `${siteConfig.url}/about`,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` },
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: section, item: `${siteConfig.url}${sectionPath}` },
            { "@type": "ListItem", position: 3, name: title, item: url },
          ],
        },
      ]}
    />
  );
}
