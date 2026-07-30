"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { materialSearchItems } from "@/app/yapi-malzemeleri/materials";
import { revitGuides } from "@/app/revit/guides";
import { bimGuides } from "@/app/bim/guides";
import { softwareCatalogs } from "@/app/software-guide-data";
import { architectureArticles } from "@/app/mimarlik/articles";
import { guideCollections } from "@/app/rehberler/guides";
import { architecturalDetails } from "@/app/mimari-detaylar/details";
import { tools as calculationTools } from "@/lib/tools";
import {
  getSearchCategory,
  scoreSearchItem,
  type SearchableItem,
} from "@/lib/site-search";
import { trackToolEvent } from "@/lib/analytics";

const searchableItems = [
  ...calculationTools.map((tool) => ({
    title: tool.title,
    description: tool.description,
    href: tool.href,
    keywords: [tool.category],
  })),
  ...materialSearchItems,
  ...revitGuides.map((guide) => ({
    title: guide.title,
    href: `/revit/${guide.slug}`,
    keywords: [guide.category, ...guide.keyPoints],
  })),
  ...bimGuides.map((guide) => ({
    title: guide.title,
    href: `/bim/${guide.slug}`,
    keywords: [guide.category, ...guide.keyPoints],
  })),
  ...softwareCatalogs.flatMap((catalog) =>
    catalog.guides.map((guide) => ({
      title: guide.title,
      description: guide.description,
      href: `/${catalog.slug}/${guide.slug}`,
      keywords: [catalog.name, guide.category, ...guide.keyPoints],
    }))
  ),
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
    keywords: ["mimari detay", "yapı malzemeleri", "rehber", "revit", "bim"],
  },
  {
    title: "Mimari Detay Kütüphanesi",
    href: "/mimari-detaylar",
    keywords: ["yapı detayı", "cephe detayı", "çatı detayı", "temel detayı", "birleşim"],
  },
  {
    title: "Proje Araçları",
    href: "/proje-araclari",
    keywords: ["ihtiyaç programı", "mekan ölçüleri", "pafta yerleşimi", "emsal proje", "yönetmelik"],
  },
  {
    title: "Mimari Proje Başlangıç Merkezi",
    href: "/proje-araclari/proje-baslangic",
    keywords: ["ihtiyaç programı", "alan dağılımı", "komşuluk matrisi", "kat dağılımı"],
  },
  {
    title: "Mimari İlişki ve Balon Diyagramı",
    href: "/proje-araclari/balon-diyagrami",
    keywords: ["balon diyagramı", "ilişki şeması", "bubble diagram", "yakınlık matrisi", "zonlama"],
  },
  {
    title: "Güneş, Yönlenme ve Cephe Karar Asistanı",
    href: "/proje-araclari/gunes-yonlenme",
    keywords: ["güneş analizi", "cephe yönü", "gölgeleme", "saçak", "gün ışığı"],
  },
  {
    title: "Vaziyet Yerleşimi ve Yapı Oturumu Simülatörü",
    href: "/proje-araclari/vaziyet-simulatoru",
    keywords: ["vaziyet planı", "parsel", "çekme mesafesi", "yapı oturumu", "yerleşim"],
  },
  {
    title: "Duvar, Çatı ve Döşeme U-Değeri Tasarımcısı",
    href: "/proje-araclari/u-degeri-tasarimcisi",
    keywords: ["u değeri", "ısı yalıtımı", "duvar katmanları", "çatı katmanları", "ısıl direnç", "lambda"],
  },
  {
    title: "Mekân Ölçüleri Kütüphanesi",
    href: "/proje-araclari/mekan-olculeri",
    keywords: ["derslik ölçüsü", "ofis ölçüsü", "otel odası", "koridor", "wc", "otopark"],
  },
  {
    title: "Pafta Yerleşim Oluşturucu",
    href: "/proje-araclari/pafta-yerlesimi",
    keywords: ["a0", "a1", "grid", "jüri paftası", "sunum"],
  },
  {
    title: "Mimari Emsal Proje Atlası",
    href: "/proje-araclari/emsal-atlasi",
    keywords: ["örnek proje", "yapı analizi", "mimar", "dolaşım", "strüktür"],
  },
  {
    title: "Yönetmelik Kontrol Asistanı",
    href: "/proje-araclari/yonetmelik-kontrol",
    keywords: ["imar", "yangın", "erişilebilirlik", "otopark", "mevzuat"],
  },
  {
    title: "Tasarım ve Proje Rehberleri",
    href: "/rehberler",
    keywords: ["çizim", "detay", "yönetmelik", "portfolyo", "jüri"],
  },
  {
    title: "Mimarlık Yapay Zekâ Merkezi",
    href: "/mimarlik-yapay-zeka",
    keywords: ["mimarlık ai", "yapay zeka", "ai araçları"],
  },
  {
    title: "Mimari Prompt Oluşturucu",
    href: "/mimarlik-yapay-zeka/prompt-olusturucu",
    keywords: ["render prompt", "yapay zeka prompt"],
  },
  {
    title: "Mimarlık AI Araç Bulucu",
    href: "/mimarlik-yapay-zeka/arac-bulucu",
    keywords: ["ai aracı", "yapay zeka araç önerisi"],
  },
  {
    title: "Mimarlık Rehberi",
    href: "/mimarlik",
    keywords: ["mimarlık kültürü", "mimarlık tarihi", "mimarlık akımları"],
  },
  {
    title: "Mimarlık Akımları",
    href: "/mimarlik/kategori/akimlar",
    keywords: ["modernizm", "bauhaus", "brutalizm", "postmodernizm"],
  },
  {
    title: "Mimari Kavramlar",
    href: "/mimarlik/kategori/kavramlar",
    keywords: ["bağlam", "tipoloji", "tektonik", "mekân", "işlev"],
  },
  {
    title: "Önemli Mimarlar",
    href: "/mimarlik/kategori/mimarlar",
    keywords: ["le corbusier", "mies", "aalto", "tadao ando"],
  },
  {
    title: "İkonik Yapılar",
    href: "/mimarlik/kategori/yapilar",
    keywords: ["villa savoye", "farnsworth", "fallingwater"],
  },
  {
    title: "Modernizm Nedir?",
    href: "/mimarlik/modernizm-nedir",
    keywords: ["modern mimarlık", "modernist", "le corbusier", "mies"],
  },
  {
    title: "Bauhaus Nedir?",
    href: "/mimarlik/bauhaus-nedir",
    keywords: ["bauhaus mimarlık", "walter gropius", "dessau"],
  },
  {
    title: "Brutalizm Nedir?",
    href: "/mimarlik/brutalizm-nedir",
    keywords: ["brüt beton", "brutalist mimarlık", "beton"],
  },
  {
    title: "Postmodernizm Nedir?",
    href: "/mimarlik/postmodernizm-nedir",
    keywords: ["postmodern mimarlık", "robert venturi"],
  },
  {
    title: "Dekonstrüktivizm Nedir?",
    href: "/mimarlik/dekonstruktivizm-nedir",
    keywords: ["dekonstrüksiyon", "zaha hadid", "frank gehry"],
  },
  {
    title: "Ölçek Hesaplayıcı",
    href: "/tools/scale-calculator",
  },
  {
    title: "PDF Pafta Boyutu ve Ölçek Ayarlama",
    href: "/pdf-tools/resize-pages",
  },
  {
    title: "PDF Araçları",
    href: "/pdf-tools",
  },
  {
    title: "PDF Birleştirme",
    href: "/pdf-tools/merge",
  },
  {
    title: "Rampa Hesaplayıcı",
    href: "/tools/ramp-calculator",
  },
  {
  title: "TAKS–KAKS ve Emsal Hesaplama",
  description:
    "Parsel alanı, TAKS ve KAKS değerlerine göre taban oturumunu ve toplam emsale esas inşaat alanını hesapla.",
  href: "/tools/taks-kaks",
  category: "Hesap Araçları",
  keywords: [
    "taks",
    "kaks",
    "emsal",
    "imar",
    "parsel",
    "parsel alanı",
    "taban oturumu",
    "inşaat alanı",
    "emsal hesabı",
    "taks hesaplama",
    "kaks hesaplama",
    "imar hesaplama",
  ],
  },
  {
  title: "PDF Sayfalarını Ayır",
  href: "/pdf-tools/split",
  },
  {
  title: "PDF’e Filigran Ekle",
  href: "/pdf-tools/watermark",
  },
  {
  title: "PDF Bilgilerini Görüntüle",
  href: "/pdf-tools/info",
  },
  {
  title: "PDF’e Sayfa Numarası Ekle",
  href: "/pdf-tools/page-numbers",
  },
  {
  title: "PDF Sayfalarını Düzenle",
  href: "/pdf-tools/organize",
  },
  {
    title: "Seramik ve Karo Hesaplayıcı",
    href: "/tools/tile-calculator",
  },
  {
  title: "Görsellerden PDF",
  href: "/pdf-tools/images-to-pdf",
  },
  {
  title: "PDF Sıkıştırma",
  href: "/pdf-tools/compress",
 },
  {
    title: "Çatı Hesaplayıcı",
    href: "/tools/roof-calculator",
  },
  {
  title: "PDF’den PNG’ye",
  href: "/pdf-tools/pdf-to-png",
  },
  {
    title: "Tuğla Hesaplayıcı",
    href: "/tools/brick-calculator",
  },
  {
    title: "Teslim Araçları",
    href: "/teslim-araclari",
    keywords: ["pafta teslim", "portfolyo", "jüri", "dosya kontrol"],
  },
  {
    title: "Mimari Teslim Kontrol Merkezi",
    href: "/teslim-araclari/kontrol-merkezi",
    keywords: ["pafta kontrol", "dpi", "kağıt ölçüsü", "teslim kontrol"],
  },
  {
    title: "Jüri Gözü – Pafta Okunabilirlik Simülatörü",
    href: "/teslim-araclari/juri-gozu",
    keywords: ["pafta okunabilirlik", "jüri görünümü", "metin boyutu", "pafta analizi"],
  },
  {
    title: "Teslim Kontrol Listesi",
    href: "/student-tools/submission-checklist",
  },
  {
    title: "Dosya Adı Oluşturucu",
    href: "/student-tools/file-name-generator",
  },
  {
    title: "Beton Hacmi Hesaplayıcı",
    href: "/tools/concrete-calculator",
  },
  {
    title: "Otopark Hesaplayıcı",
    href: "/tools/parking-calculator",
  },
  {
    title: "Eğim Hesaplayıcı",
    href: "/tools/slope-calculator",
  },
  {
    title: "Duvar ve Boya Hesaplayıcı",
    href: "/tools/wall-paint-calculator",
  },
  {
    title: "Merdiven Hesaplayıcı",
    href: "/tools/stair-calculator",
  },
  {
    title: "Alan Hesaplayıcı",
    href: "/tools/area-calculator",
  },
  {
    title: "GNO Hesaplayıcı",
    href: "/student-tools/gno-calculator",
  },
  {
    title: "Ders Notu Hesaplayıcı",
    href: "/student-tools/grade-calculator",
  },
  {
    title: "Devamsızlık Hesaplayıcı",
    href: "/student-tools/attendance-calculator",
  },
  {
    title: "Öğrenci Takvimi",
    href: "/student-tools/calendar",
  },
];

export const uniqueSearchItems: SearchableItem[] = searchableItems.filter(
  (item, index, items) =>
    items.findIndex((candidate) => candidate.href === item.href) === index
);

export const navigationGroups = [
  {
    title: "Proje Araçları",
    shortTitle: "Proje",
    description: "Program, yerleşim ve tasarım kararları",
    icon: "◇",
    href: "/proje-araclari",
    items: [
      ["Tüm Tasarım Araçları", "/proje-araclari"],
      ["Proje Başlangıç Merkezi", "/proje-araclari/proje-baslangic"],
      ["Balon Diyagramı", "/proje-araclari/balon-diyagrami"],
      ["Güneş ve Cephe", "/proje-araclari/gunes-yonlenme"],
      ["Vaziyet Simülatörü", "/proje-araclari/vaziyet-simulatoru"],
      ["Emsal Proje Atlası", "/proje-araclari/emsal-atlasi"],
      ["Mekân Ölçüleri", "/proje-araclari/mekan-olculeri"],
      ["Pafta Yerleşimi", "/proje-araclari/pafta-yerlesimi"],
      ["U-Değeri Tasarımcısı", "/proje-araclari/u-degeri-tasarimcisi"],
      ["Yönetmelik Asistanı", "/proje-araclari/yonetmelik-kontrol"],
    ],
  },
  {
    title: "Hesap Araçları",
    shortTitle: "Hesap",
    description: "Ölçek, imar, metraj ve yapı hesapları",
    icon: "∑",
    href: "/tools",
    items: [
      ["Tüm Hesap Araçları", "/tools"],
      ["Mimarlık Birim Dönüştürücü", "/tools/architecture-unit-converter"],
      ["TAKS–KAKS / Emsal", "/tools/taks-kaks"],
      ["Ölçek Hesaplama", "/tools/scale-calculator"],
      ["Pafta Ölçek Dönüştürücü", "/tools/sheet-scale-converter"],
      ["Merdiven Hesaplama", "/tools/stair-calculator"],
      ["Rampa Hesaplama", "/tools/ramp-calculator"],
      ["Alan Hesaplama", "/tools/area-calculator"],
      ["Eğim Hesaplama", "/tools/slope-calculator"],
      ["Otopark Hesaplama", "/tools/parking-calculator"],
      ["Çatı Hesaplama", "/tools/roof-calculator"],
      ["Beton Hacmi", "/tools/concrete-calculator"],
      ["Tuğla Hesaplama", "/tools/brick-calculator"],
      ["Seramik ve Karo", "/tools/tile-calculator"],
      ["Duvar ve Boya", "/tools/wall-paint-calculator"],
    ],
  },
  {
    title: "PDF Araçları",
    shortTitle: "PDF",
    description: "Pafta ve belgeleri tarayıcıda düzenle",
    icon: "▤",
    href: "/pdf-tools",
    items: [
      ["Tüm PDF Araçları", "/pdf-tools"],
      ["PDF → PNG / JPG", "/pdf-tools/pdf-to-png"],
      ["Görsellerden PDF", "/pdf-tools/images-to-pdf"],
      ["PDF Birleştir", "/pdf-tools/merge"],
      ["PDF Sıkıştır", "/pdf-tools/compress"],
      ["Sayfaları Ayır", "/pdf-tools/split"],
      ["Sayfaları Düzenle", "/pdf-tools/organize"],
      ["Pafta Boyutu ve Ölçek", "/pdf-tools/resize-pages"],
      ["Sayfa Numarası Ekle", "/pdf-tools/page-numbers"],
      ["Filigran Ekle", "/pdf-tools/watermark"],
      ["PDF Bilgilerini Gör", "/pdf-tools/info"],
    ],
  },
  {
    title: "Pafta ve Teslim",
    shortTitle: "Teslim",
    description: "Sunum, jüri ve teslim öncesi kontroller",
    icon: "▦",
    href: "/teslim-araclari",
    items: [
      ["Tüm Teslim Araçları", "/teslim-araclari"],
      ["Pafta Yerleşimi", "/proje-araclari/pafta-yerlesimi"],
      ["Jüri Gözü", "/teslim-araclari/juri-gozu"],
      ["Teslim Kontrol Merkezi", "/teslim-araclari/kontrol-merkezi"],
      ["Teslim Kontrol Listesi", "/student-tools/submission-checklist"],
      ["Dosya Adı Oluşturucu", "/student-tools/file-name-generator"],
    ],
  },
  {
    title: "Mimari Detaylar",
    shortTitle: "Detaylar",
    description: "Duvar, çatı, döşeme ve birleşim detayları",
    icon: "▥",
    href: "/mimari-detaylar",
    items: [
      ["Tüm Mimari Detaylar", "/mimari-detaylar"],
      ["Dış Duvar ve Cephe", "/mimari-detaylar/dis-duvar-mantolama-subasman"],
      ["Havalandırmalı Cephe", "/mimari-detaylar/havalandirmali-cephe-duvar-birlesimi"],
      ["Pencere ve Denizlik", "/mimari-detaylar/pencere-denizlik-damlalik"],
      ["Çatı Detayları", "/mimari-detaylar"],
      ["Temel ve Su Yalıtımı", "/mimari-detaylar"],
    ],
  },
  {
    title: "Yapı Malzemeleri",
    shortTitle: "Malzemeler",
    description: "Teknik değer, kalınlık ve malzeme seçimi",
    icon: "▦",
    href: "/yapi-malzemeleri",
    items: [
      ["Tüm Yapı Malzemeleri", "/yapi-malzemeleri"],
      ["Duvar Malzemeleri", "/yapi-malzemeleri/duvar"],
      ["Yalıtım Malzemeleri", "/yapi-malzemeleri/yalitim"],
      ["Cam Türleri", "/yapi-malzemeleri/cam"],
      ["Ahşap ve Levhalar", "/yapi-malzemeleri/ahsap"],
      ["Sıva Malzemeleri", "/yapi-malzemeleri/siva"],
      ["Beton Türleri", "/yapi-malzemeleri/beton"],
      ["Zemin Kaplamaları", "/yapi-malzemeleri/zemin-kaplama"],
      ["Malzeme Karşılaştır", "/yapi-malzemeleri/karsilastir"],
    ],
  },
  {
    title: "Revit",
    shortTitle: "Revit",
    description: "Modelleme, görünürlük ve hata çözümleri",
    icon: "R",
    href: "/revit",
    items: [
      ["Revit Merkezi", "/revit"],
      ["Duvar Katmanları", "/revit/duvar-katmanlari"],
      ["Toposolid ve Arazi", "/revit/toposolid"],
      ["Toposolid Excavate", "/revit/toposolid-excavate"],
      ["Pafta ve Viewport", "/revit/pafta-yerlestirme"],
      ["Material ve Appearance", "/revit/malzeme-appearance"],
      ["Family Yükleme", "/revit/indirilen-family-nasil-yuklenir"],
      ["D5 Render Aktarımı", "/revit/d5-render-malzeme-aktarma"],
    ],
  },
  {
    title: "BIM",
    shortTitle: "BIM",
    description: "Bilgi yönetimi, LOD ve koordinasyon",
    icon: "B",
    href: "/bim",
    items: [
      ["BIM Merkezi", "/bim"],
      ["BIM Nedir?", "/bim/bim-nedir"],
      ["LOD Seviyeleri", "/bim/lod-seviyeleri"],
      ["BIM Koordinasyonu", "/bim/koordinasyon"],
      ["IFC Nedir?", "/bim/ifc-nedir"],
      ["Clash Detection", "/bim/clash-detection"],
      ["BEP Nedir?", "/bim/bep-nedir"],
      ["ISO 19650 Temelleri", "/bim/iso-19650-temelleri"],
    ],
  },
  {
    title: "Mimarlık Rehberi",
    shortTitle: "Mimarlık",
    description: "Akımlar, kavramlar, mimarlar ve yapılar",
    icon: "⌂",
    href: "/mimarlik",
    items: [
      ["Mimarlık Rehberi", "/mimarlik"],
      ["Mimarlık Akımları", "/mimarlik/kategori/akimlar"],
      ["Mimari Kavramlar", "/mimarlik/kategori/kavramlar"],
      ["Önemli Mimarlar", "/mimarlik/kategori/mimarlar"],
      ["İkonik Yapılar", "/mimarlik/kategori/yapilar"],
      ["Tasarım Rehberleri", "/rehberler"],
    ],
  },
  {
    title: "Kaynaklar",
    shortTitle: "Kaynaklar",
    description: "CAD, Revit family ve bilgi kütüphaneleri",
    icon: "▤",
    href: "/resources",
    items: [
      ["Tüm Kaynaklar", "/resources"],
      ["CAD Blok Kaynakları", "/resources/cad-blok-kaynaklari"],
      ["Revit Family Kaynakları", "/resources/revit-family-kaynaklari"],
      ["Tüm Kütüphaneler", "/kutuphaneler"],
      ["Mekân Ölçüleri", "/proje-araclari/mekan-olculeri"],
      ["Emsal Proje Atlası", "/proje-araclari/emsal-atlasi"],
    ],
  },
  {
    title: "Öğrenci Araçları",
    shortTitle: "Öğrenci",
    description: "Okul, not ve teslim yardımcıları",
    icon: "✦",
    href: "/student-tools",
    items: [
      ["Tüm Öğrenci Araçları", "/student-tools"],
      ["GNO / Not Hesaplama", "/student-tools/gno-calculator"],
      ["Ders Notu Hesaplama", "/student-tools/grade-calculator"],
      ["Devamsızlık Hesaplama", "/student-tools/attendance-calculator"],
      ["Öğrenci Takvimi", "/student-tools/calendar"],
      ["Teslim Kontrol Listesi", "/student-tools/submission-checklist"],
      ["Dosya Adı Oluşturucu", "/student-tools/file-name-generator"],
    ],
  },
  {
    title: "Mimarlık AI",
    shortTitle: "Yapay Zekâ",
    description: "AI araç seçimi ve prompt yardımcıları",
    icon: "✦",
    href: "/mimarlik-yapay-zeka",
    items: [
      ["Mimarlık AI Merkezi", "/mimarlik-yapay-zeka"],
      ["AI Araç Bulucu", "/mimarlik-yapay-zeka/arac-bulucu"],
      ["Prompt Oluşturucu", "/mimarlik-yapay-zeka/prompt-olusturucu"],
    ],
  },
] as const;

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
      const target = event.target as Node;
      const isInsideDesktopSearch = desktopSearchRef.current?.contains(target);
      const isInsideMobileSearch = mobileSearchRef.current?.contains(target);
      if (!isInsideDesktopSearch && !isInsideMobileSearch) {
        setQuery("");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveCategory(null);
        setQuery("");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = Math.max(window.scrollY, 0);
      const movement = currentScrollY - lastScrollY.current;

      if (currentScrollY < 72) {
        setIsHeaderHidden(false);
      } else if (
        movement > 8 &&
        activeCategory === null &&
        query.trim() === ""
      ) {
        setIsHeaderHidden(true);
      } else if (movement < -6) {
        setIsHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory, query]);

  const normalizedQuery = query.trim();
  const results = useMemo(
    () =>
      normalizedQuery === ""
        ? []
        : uniqueSearchItems
            .map((item) => ({
              ...item,
              score: scoreSearchItem(item, normalizedQuery),
            }))
            .filter((item) => item.score >= 12)
            .sort((first, second) => second.score - first.score)
            .slice(0, 8),
    [normalizedQuery]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results.length > 0) {
      const selectedResult = results[selectedResultIndex] ?? results[0];
      trackToolEvent("site_search", "result_opened", {
        query,
        href: selectedResult.href,
      });
      router.push(selectedResult.href);
      setQuery("");
      setActiveCategory(null);
    }
  }

  function goToItem(href: string) {
    trackToolEvent("site_search", "result_opened", { query, href });
    router.push(href);
    setQuery("");
    setActiveCategory(null);
  }

  function closeMenu() {
    setActiveCategory(null);
    setQuery("");
  }

  function updateQuery(value: string) {
    setQuery(value);
    setSelectedResultIndex(0);
  }

  const activeGroup = navigationGroups.find(
    (group) => group.title === activeCategory
  );

  function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setSelectedResultIndex((current) => (current + 1) % results.length);
    }
    if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setSelectedResultIndex(
        (current) => (current - 1 + results.length) % results.length
      );
    }
    if (event.key === "Enter" && results.length > 0) {
      event.preventDefault();
      const selectedResult = results[selectedResultIndex] ?? results[0];
      goToItem(selectedResult.href);
    }
  }

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setActiveCategory(null)}
      className={`sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 text-white shadow-md shadow-black/10 backdrop-blur-xl transition-transform duration-300 ease-out ${
        isHeaderHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[4.5rem] items-center gap-4 lg:gap-8">
          <Link
            href="/"
            aria-label="PAFTA ana sayfa"
            className="relative block h-14 w-44 shrink-0 overflow-hidden"
            onClick={closeMenu}
          >
            <Image
              src="/pafta-logo-white.png"
              alt="PAFTA"
              width={2000}
              height={2000}
              priority
              className="absolute left-1/2 top-1/2 h-96 w-96 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          </Link>

          <div ref={desktopSearchRef} className="relative ml-auto hidden w-full max-w-md md:block">
            <form onSubmit={handleSubmit} className="relative">
              <label htmlFor="header-search" className="sr-only">PAFTA içinde ara</label>
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true">⌕</span>
              <input
                id="header-search"
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setActiveCategory(null)}
                placeholder="Araç veya içerik ara"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={normalizedQuery !== ""}
                aria-controls="desktop-search-results"
                aria-activedescendant={
                  results.length > 0
                    ? `desktop-search-result-${selectedResultIndex}`
                    : undefined
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-14 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-4 focus:ring-cyan-400/10"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500">ARA</kbd>
            </form>

            {normalizedQuery !== "" && (
              <SearchResults
                id="desktop-search-results"
                itemIdPrefix="desktop-search-result"
                results={results}
                selectedIndex={selectedResultIndex}
                onSelect={goToItem}
                onHover={setSelectedResultIndex}
              />
            )}
          </div>

        </div>

        <div className="relative pb-3 md:hidden" ref={mobileSearchRef}>
          <form onSubmit={handleSubmit} className="relative">
            <label htmlFor="mobile-header-search" className="sr-only">PAFTA içinde ara</label>
            <input
              id="mobile-header-search"
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setActiveCategory(null)}
              placeholder="Araç veya içerik ara..."
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={normalizedQuery !== ""}
              aria-controls="mobile-search-results"
              aria-activedescendant={
                results.length > 0
                  ? `mobile-search-result-${selectedResultIndex}`
                  : undefined
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-16 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
            <button type="submit" className="absolute bottom-1.5 right-1.5 top-1.5 rounded-lg bg-cyan-400 px-3 text-sm font-bold text-slate-950">Ara</button>
          </form>
          {normalizedQuery !== "" && (
            <SearchResults
              id="mobile-search-results"
              itemIdPrefix="mobile-search-result"
              results={results}
              selectedIndex={selectedResultIndex}
              onSelect={goToItem}
              onHover={setSelectedResultIndex}
            />
          )}
        </div>

        <nav
          aria-label="Ana kategoriler"
          className="-mx-4 flex snap-x snap-mandatory gap-1 overflow-x-auto border-t border-slate-800 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-1.5 lg:overflow-visible lg:border-t-0 lg:px-0 lg:pb-2.5"
        >
          {navigationGroups.map((group) => {
            const isActive = activeCategory === group.title;
            return (
              <div
                key={group.title}
                onMouseEnter={() => {
                  setQuery("");
                  setActiveCategory(group.title);
                }}
                className={`flex min-h-10 shrink-0 snap-start items-stretch overflow-hidden rounded-lg border text-sm font-semibold transition lg:min-w-0 lg:text-xs xl:text-[13px] ${
                  isActive
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-transparent bg-slate-900/45 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Link
                  href={group.href}
                  onClick={closeMenu}
                  onFocus={() => {
                    setQuery("");
                    setActiveCategory(group.title);
                  }}
                  className="flex min-w-0 flex-1 items-center justify-center px-3 py-2.5 lg:px-2 lg:py-2"
                >
                  <span className="lg:hidden xl:inline">{group.title}</span>
                  <span className="hidden lg:inline xl:hidden">{group.shortTitle}</span>
                </Link>
                <button
                  type="button"
                  aria-label={`${group.title} alt menüsünü ${
                    isActive ? "kapat" : "aç"
                  }`}
                  aria-expanded={isActive}
                  aria-controls="category-tools-panel"
                  onClick={(event) => {
                    event.stopPropagation();
                    setQuery("");
                    setActiveCategory((current) =>
                      current === group.title ? null : group.title
                    );
                  }}
                  className="flex w-8 shrink-0 items-center justify-center border-l border-white/5 text-[10px] text-slate-500 transition hover:bg-white/5 hover:text-cyan-300"
                >
                  <span
                    className={`inline-block transition ${
                      isActive ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      {activeGroup && (
        <div
          id="category-tools-panel"
          className="absolute left-0 right-0 top-full max-h-[calc(100vh-12rem)] overflow-y-auto overscroll-contain border-b border-slate-800 bg-slate-950 shadow-2xl shadow-black/40 md:max-h-[calc(100vh-10rem)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
            <div className="flex items-start justify-between gap-5 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl font-bold text-cyan-300">
                    {activeGroup.icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {activeGroup.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {activeGroup.description}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Kategori menüsünü kapat"
                className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
              >
                Kapat ×
              </button>
            </div>

            <nav
              aria-label={`${activeGroup.title} bağlantıları`}
              className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {activeGroup.items.map(([label, href], index) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`group flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    index === 0
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                      : "border-slate-800 bg-slate-900 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-300"
                  }`}
                >
                  {label}
                  <span
                    className="text-cyan-400 transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function SearchResults({
  id,
  itemIdPrefix,
  results,
  selectedIndex,
  onSelect,
  onHover,
}: {
  id: string;
  itemIdPrefix: string;
  results: (SearchableItem & { score: number })[];
  selectedIndex: number;
  onSelect: (href: string) => void;
  onHover: (index: number) => void;
}) {
  return (
    <div
      id={id}
      role="listbox"
      className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[55vh] overflow-y-auto overscroll-contain rounded-2xl border border-slate-700 bg-slate-900 p-1.5 text-left shadow-2xl"
    >
      {results.length > 0 ? (
        <>
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              En iyi sonuçlar
            </p>
            <span className="hidden text-[10px] text-slate-600 sm:inline">
              ↑↓ seç · Enter aç
            </span>
          </div>
          {results.map((item, index) => (
            <button
              key={item.href}
              id={`${itemIdPrefix}-${index}`}
              role="option"
              aria-selected={selectedIndex === index}
              type="button"
              onMouseEnter={() => onHover(index)}
              onClick={() => onSelect(item.href)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                selectedIndex === index ? "bg-slate-800" : "hover:bg-slate-800"
              }`}
            >
              <span>
                <span className="block text-sm font-semibold text-white">
                  {item.title}
                </span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                  {getSearchCategory(item.href)}
                </span>
              </span>
              <span className="text-cyan-300" aria-hidden="true">→</span>
            </button>
          ))}
        </>
      ) : (
        <div className="px-4 py-5">
          <p className="font-medium text-white">Sonuç bulunamadı</p>
          <p className="mt-1 text-sm text-slate-400">
            Daha kısa bir ifade dene veya aşağıdaki ana kategorilerden ilerle.
          </p>
        </div>
      )}
    </div>
  );
}
