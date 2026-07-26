"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { materialSearchItems } from "@/app/yapi-malzemeleri/materials";
import { revitGuides } from "@/app/revit/guides";
import { bimGuides } from "@/app/bim/guides";
import { architectureArticles } from "@/app/mimarlik/articles";
import { guideCollections } from "@/app/rehberler/guides";
import { tools as calculationTools } from "@/lib/tools";
import { architecturalDetails } from "@/app/mimari-detaylar/details";

type SearchItem = {
  title: string;
  href: string;
  keywords?: string[];
};

const tools: SearchItem[] = [
  ...calculationTools.map((tool) => ({
    title: tool.title,
    href: tool.href,
    keywords: [tool.category, tool.description],
  })),
  ...[
    ["Tasarım Araçları", "/proje-araclari"],
    ["Mimari Proje Başlangıç Merkezi", "/proje-araclari/proje-baslangic"],
    ["Mimari İhtiyaç Programı Oluşturucu", "/proje-araclari/proje-baslangic"],
    ["Mimari İlişki ve Balon Diyagramı", "/proje-araclari/balon-diyagrami"],
    ["Bubble Diagram Generator", "/proje-araclari/balon-diyagrami"],
    ["Güneş, Yönlenme ve Cephe Karar Asistanı", "/proje-araclari/gunes-yonlenme"],
    ["Vaziyet Yerleşimi ve Yapı Oturumu Simülatörü", "/proje-araclari/vaziyet-simulatoru"],
    ["Duvar, Çatı ve Döşeme U-Değeri Hesaplama", "/proje-araclari/u-degeri-tasarimcisi"],
    ["Katman ve U-Değeri Tasarımcısı", "/proje-araclari/u-degeri-tasarimcisi"],
    ["Mekân Ölçüleri Kütüphanesi", "/proje-araclari/mekan-olculeri"],
    ["Pafta Yerleşim Oluşturucu", "/proje-araclari/pafta-yerlesimi"],
    ["Mimari Emsal Proje Atlası", "/proje-araclari/emsal-atlasi"],
    ["Yönetmelik Kontrol Asistanı", "/proje-araclari/yonetmelik-kontrol"],
    ["Teslim Araçları", "/teslim-araclari"],
    ["Mimari Teslim Kontrol Merkezi", "/teslim-araclari/kontrol-merkezi"],
    ["Jüri Gözü – Pafta Okunabilirlik Simülatörü", "/teslim-araclari/juri-gozu"],
    ["PDF Araçları", "/pdf-tools"],
    ["PDF Birleştirme", "/pdf-tools/merge"],
    ["PDF Sıkıştırma", "/pdf-tools/compress"],
    ["PDF’den PNG veya JPG’ye", "/pdf-tools/pdf-to-png"],
    ["Görsellerden PDF", "/pdf-tools/images-to-pdf"],
    ["PDF Sayfalarını Ayır", "/pdf-tools/split"],
    ["PDF Sayfalarını Düzenle", "/pdf-tools/organize"],
    ["PDF Sayfa Numarası", "/pdf-tools/page-numbers"],
    ["PDF Filigran", "/pdf-tools/watermark"],
  ].map(([title, href]) => ({ title, href })),
  ...materialSearchItems,
  ...revitGuides.map((guide) => ({
    title: guide.title,
    href: `/revit/${guide.slug}`,
    keywords: [guide.category],
  })),
  ...bimGuides.map((guide) => ({
    title: guide.title,
    href: `/bim/${guide.slug}`,
    keywords: [guide.category],
  })),
  ...architectureArticles.map((article) => ({
    title: article.shortTitle,
    href: `/mimarlik/${article.slug}`,
    keywords: article.keywords,
  })),
  ...guideCollections.map((guide) => ({
    title: guide.name,
    href: `/rehberler/${guide.slug}`,
    keywords: guide.keywords,
  })),
  ...architecturalDetails.map((detail) => ({
    title: detail.title,
    href: `/mimari-detaylar/${detail.slug}`,
    keywords: [detail.category, ...detail.tags],
  })),
  {
    title: "Mimarlık Bilgi Kütüphaneleri",
    href: "/kutuphaneler",
    keywords: ["detay", "malzeme", "rehber", "revit", "bim"],
  },
  {
    title: "Mimari Detay Kütüphanesi",
    href: "/mimari-detaylar",
    keywords: ["yapı detayı", "cephe", "çatı", "temel", "doğrama"],
  },
  {
    title: "Mimarlık Yapay Zekâ Merkezi",
    href: "/mimarlik-yapay-zeka",
    keywords: ["mimarlık ai", "yapay zeka"],
  },
  {
    title: "Mimari Prompt Oluşturucu",
    href: "/mimarlik-yapay-zeka/prompt-olusturucu",
    keywords: ["render prompt"],
  },
  {
    title: "Mimarlık AI Araç Bulucu",
    href: "/mimarlik-yapay-zeka/arac-bulucu",
    keywords: ["ai araç önerisi"],
  },
  {
    title: "Mimarlık Rehberi",
    href: "/mimarlik",
  },
  {
    title: "Mimarlık Akımları",
    href: "/mimarlik/kategori/akimlar",
  },
  {
    title: "Mimari Kavramlar",
    href: "/mimarlik/kategori/kavramlar",
  },
  {
    title: "Önemli Mimarlar",
    href: "/mimarlik/kategori/mimarlar",
  },
  {
    title: "İkonik Yapılar",
    href: "/mimarlik/kategori/yapilar",
  },
  {
    title: "Modernizm Nedir?",
    href: "/mimarlik/modernizm-nedir",
  },
  {
    title: "Bauhaus Nedir?",
    href: "/mimarlik/bauhaus-nedir",
  },
  {
    title: "Brutalizm Nedir?",
    href: "/mimarlik/brutalizm-nedir",
  },
  {
    title: "Postmodernizm Nedir?",
    href: "/mimarlik/postmodernizm-nedir",
  },
  {
    title: "Dekonstrüktivizm Nedir?",
    href: "/mimarlik/dekonstruktivizm-nedir",
  },
  {
    title: "Ölçek Hesaplayıcı",
    href: "/tools/scale-calculator",
  },
  {
    title: "TAKS–KAKS ve Emsal Hesaplama",
    href: "/tools/taks-kaks",
    keywords: ["taks", "kaks", "emsal", "imar", "parsel", "taban oturumu"],
  },
  {
    title: "PDF Pafta Boyutu ve Ölçek Ayarlama",
    href: "/pdf-tools/resize-pages",
  },
  {
    title: "Merdiven Hesaplayıcı",
    href: "/tools/stair-calculator",
  },
  {
    title: "Alan Hesaplayıcı",
    href: "/tools/area-calculator",
  },
];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const results = tools
    .filter((tool) =>
      [tool.title, ...("keywords" in tool && tool.keywords ? tool.keywords : [])]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalizedQuery)
    )
    .filter(
      (tool, index, items) =>
        items.findIndex((candidate) => candidate.href === tool.href) === index
    );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (query.trim() && results.length > 0) {
      router.push(results[0].href);
    }
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Araç, mimarlık akımı veya içerik ara..."
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 pr-28 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
        />

        <button
          type="submit"
          className="absolute bottom-2 right-2 top-2 rounded-xl bg-cyan-400 px-5 font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Ara
        </button>
      </form>

      {query.trim() !== "" && (
        <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-left shadow-2xl">
          {results.length > 0 ? (
            results.map((tool) => (
              <button
                key={tool.href}
                type="button"
                onClick={() => router.push(tool.href)}
                className="block w-full border-b border-slate-800 px-5 py-4 text-left last:border-b-0 hover:bg-slate-800"
              >
                <span className="font-semibold text-white">
                  {tool.title}
                </span>
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-slate-400">
              Sonuç bulunamadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
