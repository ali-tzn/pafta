"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { materialSearchItems } from "@/app/yapi-malzemeleri/materials";
import { revitGuides } from "@/app/revit/guides";
import { bimGuides } from "@/app/bim/guides";
import { architectureArticles } from "@/app/mimarlik/articles";
import { guideCollections } from "@/app/rehberler/guides";
import { architecturalDetails } from "@/app/mimari-detaylar/details";

const searchableItems = [
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

const navigationGroups = [
  {
    title: "Tasarım",
    items: [
      ["Tasarım Araçları", "/proje-araclari"],
      ["Proje Başlangıç Merkezi", "/proje-araclari/proje-baslangic"],
      ["Balon Diyagramı", "/proje-araclari/balon-diyagrami"],
      ["Güneş ve Cephe Asistanı", "/proje-araclari/gunes-yonlenme"],
      ["Vaziyet Simülatörü", "/proje-araclari/vaziyet-simulatoru"],
      ["Emsal Proje Atlası", "/proje-araclari/emsal-atlasi"],
    ],
  },
  {
    title: "Teknik + Hesap",
    items: [
      ["Tüm Teknik Hesaplar", "/tools"],
      ["TAKS–KAKS / Emsal", "/tools/taks-kaks"],
      ["U-Değeri Tasarımcısı", "/proje-araclari/u-degeri-tasarimcisi"],
      ["Yönetmelik Asistanı", "/proje-araclari/yonetmelik-kontrol"],
      ["Merdiven ve Rampa", "/tools/stair-calculator"],
      ["Metraj Hesapları", "/tools/concrete-calculator"],
    ],
  },
  {
    title: "PDF",
    items: [
      ["Tüm PDF Araçları", "/pdf-tools"],
      ["PDF → PNG / JPG", "/pdf-tools/pdf-to-png"],
      ["PDF Birleştir", "/pdf-tools/merge"],
      ["PDF Sıkıştır", "/pdf-tools/compress"],
      ["Sayfaları Ayır", "/pdf-tools/split"],
      ["Pafta Boyutu ve Ölçek", "/pdf-tools/resize-pages"],
      ["PDF Düzenle", "/pdf-tools/organize"],
    ],
  },
  {
    title: "Pafta + Teslim",
    items: [
      ["Tüm Teslim Araçları", "/teslim-araclari"],
      ["Pafta Yerleşimi", "/proje-araclari/pafta-yerlesimi"],
      ["Jüri Gözü", "/teslim-araclari/juri-gozu"],
      ["Teslim Kontrol Merkezi", "/teslim-araclari/kontrol-merkezi"],
      ["Teslim Kontrol Listesi", "/student-tools/submission-checklist"],
    ],
  },
  {
    title: "Kütüphaneler",
    items: [
      ["Tüm Kütüphaneler", "/kutuphaneler"],
      ["Mimari Detaylar", "/mimari-detaylar"],
      ["Yapı Malzemeleri", "/yapi-malzemeleri"],
      ["Mimarlık Rehberi", "/mimarlik"],
      ["Revit Merkezi", "/revit"],
      ["BIM Merkezi", "/bim"],
    ],
  },
  {
    title: "Öğrenci + AI",
    items: [
      ["Öğrenci Araçları", "/student-tools"],
      ["GNO / Not Hesaplama", "/student-tools/gno-calculator"],
      ["Takvim", "/student-tools/calendar"],
      ["Mimarlık AI Merkezi", "/mimarlik-yapay-zeka"],
      ["AI Araç Bulucu", "/mimarlik-yapay-zeka/arac-bulucu"],
    ],
  },
] as const;

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const normalizedQuery = query
    .trim()
    .toLocaleLowerCase("tr-TR");

  const results =
    normalizedQuery === ""
      ? []
      : searchableItems
          .filter((item) => {
            const searchableText = [
              item.title,
              ...("keywords" in item && item.keywords ? item.keywords : []),
            ]
              .join(" ")
              .toLocaleLowerCase("tr-TR");

            return searchableText.includes(normalizedQuery);
          })
          .filter(
            (item, index, items) =>
              items.findIndex((candidate) => candidate.href === item.href) ===
              index
          );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (results.length > 0) {
      router.push(results[0].href);
      setQuery("");
    }
  }

  function goToItem(href: string) {
    router.push(href);
    setQuery("");
  }

  function closeMenu() {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }

  return (
    <header ref={headerRef} className="relative z-50 border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 lg:flex-nowrap lg:gap-6 lg:py-1">
          <Link
            href="/"
            aria-label="PAFTA ana sayfa"
            className="shrink-0"
            onClick={closeMenu}
          >
            <Image
              src="/pafta-logo-white.png"
              alt="PAFTA"
              width={700}
              height={240}
              priority
              className="h-16 w-44 object-cover object-center sm:h-20 sm:w-56 lg:-my-3 lg:h-28 lg:w-80"
            />
          </Link>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() =>
              setIsMenuOpen((open) => {
                if (open) setActiveDropdown(null);
                return !open;
              })
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400 lg:hidden"
          >
            <span className="sr-only">
              {isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            </span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span
                className={`h-0.5 w-full bg-current transition ${
                  isMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition ${
                  isMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>

          <div className="relative order-3 w-full lg:order-none lg:max-w-xl">
            <form onSubmit={handleSubmit} className="relative">
              <label
                htmlFor="header-search"
                className="sr-only"
              >
                PAFTA içinde ara
              </label>

              <input
                id="header-search"
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Araç veya içerik ara..."
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 pr-20 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 sm:px-5 sm:py-3.5 sm:pr-24"
              />

              <button
                type="submit"
                className="absolute bottom-1.5 right-1.5 top-1.5 rounded-xl bg-cyan-400 px-4 font-semibold text-slate-950 transition hover:bg-cyan-300 sm:bottom-2 sm:right-2 sm:top-2 sm:px-5"
              >
                Ara
              </button>
            </form>

            {normalizedQuery !== "" && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 text-left shadow-2xl">
                {results.length > 0 ? (
                  results.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => goToItem(item.href)}
                      className="block w-full border-b border-slate-800 px-5 py-4 text-left transition last:border-b-0 hover:bg-slate-800"
                    >
                      <span className="font-semibold text-white">
                        {item.title}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-4">
                    <p className="font-medium text-white">
                      Sonuç bulunamadı
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Ölçek, PDF, Revit veya GNO yazmayı dene.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <nav
          id="primary-navigation"
          className={`border-t border-slate-800 py-3 text-sm font-medium text-slate-300 lg:flex lg:items-center lg:gap-3 lg:py-3 ${
            isMenuOpen ? "grid" : "hidden"
          }`}
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Ana Sayfa
          </Link>
          {navigationGroups.map((group) => {
            const isOpen = activeDropdown === group.title;

            return (
              <div key={group.title} className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setActiveDropdown((current) =>
                      current === group.title ? null : group.title
                    )
                  }
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-left transition lg:w-auto lg:py-2 ${
                    isOpen
                      ? "bg-slate-900 text-cyan-300"
                      : "hover:bg-slate-900 hover:text-cyan-400"
                  }`}
                >
                  {group.title}
                  <span
                    className={`text-xs transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>

                {isOpen && (
                  <div className="grid overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-2xl lg:absolute lg:left-0 lg:top-full lg:z-50 lg:mt-1 lg:min-w-56">
                    {group.items.map(([label, href]) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={closeMenu}
                        className="rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-300"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
