"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { materialSearchItems } from "@/app/yapi-malzemeleri/materials";
import { revitGuides } from "@/app/revit/guides";
import { bimGuides } from "@/app/bim/guides";
import { architectureArticles } from "@/app/mimarlik/articles";
import { guideCollections } from "@/app/rehberler/guides";

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

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  }

  return (
    <header className="relative z-50 border-b border-slate-800 bg-slate-950">
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
            onClick={() => setIsMenuOpen((open) => !open)}
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
          className={`border-t border-slate-800 py-3 text-sm font-medium text-slate-300 lg:flex lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-3 lg:py-4 ${
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

          <Link
            href="/tools"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Hesap Araçları
          </Link>

          <Link
            href="/student-tools"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Öğrenci Araçları
          </Link>

          <Link
            href="/pdf-tools"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            PDF Araçları
          </Link>

          <Link
            href="/revit"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Revit
          </Link>

          <Link
            href="/bim"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            BIM
          </Link>

          <Link
            href="/mimarlik"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Mimarlık Rehberi
          </Link>

          <Link
            href="/yapi-malzemeleri"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Yapı Malzemeleri
          </Link>

          <Link
            href="/mimarlik-yapay-zeka"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Mimarlık AI
          </Link>

          <Link
            href="/rehberler"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Proje Rehberleri
          </Link>

          <Link
            href="/resources"
            onClick={closeMenu}
            className="rounded-lg px-3 py-3 transition hover:bg-slate-900 hover:text-cyan-400 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          >
            Kaynaklar
          </Link>
        </nav>
      </div>
    </header>
  );
}
