"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { uniqueSearchItems } from "./Header";
import {
  getSearchCategory,
  scoreSearchItem,
  type SearchableItem,
} from "@/lib/site-search";
import { trackToolEvent } from "@/lib/analytics";

const navigationGroups = [
  {
    title: "Proje Geliştirme",
    description: "Programdan vaziyet kararına proje geliştirme araçları",
    icon: "PG",
    href: "/proje-araclari",
    items: [
      ["Proje Başlangıç Merkezi", "/proje-araclari/proje-baslangic"],
      ["Balon Diyagramı", "/proje-araclari/balon-diyagrami"],
      ["Güneş ve Cephe", "/proje-araclari/gunes-yonlenme"],
      ["Vaziyet Simülatörü", "/proje-araclari/vaziyet-simulatoru"],
      ["Mekân Ölçüleri", "/proje-araclari/mekan-olculeri"],
      ["Pafta Yerleşimi", "/proje-araclari/pafta-yerlesimi"],
      ["Emsal Proje Atlası", "/proje-araclari/emsal-atlasi"],
      ["Yönetmelik Asistanı", "/proje-araclari/yonetmelik-kontrol"],
    ],
  },
  {
    title: "Hesap Araçları",
    description: "Ölçek, imar, metraj ve yapı hesapları",
    icon: "∑",
    href: "/tools",
    items: [
      ["Mimarlık Birim Dönüştürücü", "/tools/architecture-unit-converter"],
      ["TAKS–KAKS / Emsal", "/tools/taks-kaks"],
      ["Ölçek Hesaplama", "/tools/scale-calculator"],
      ["Pafta Ölçek Dönüştürücü", "/tools/sheet-scale-converter"],
      ["Merdiven Hesaplama", "/tools/stair-calculator"],
      ["Rampa ve Eğim", "/tools/ramp-calculator"],
      ["Alan Hesaplama", "/tools/area-calculator"],
      ["Yapı Metraj Araçları", "/tools"],
    ],
  },
  {
    title: "PDF Araçları",
    description: "Pafta ve belgeleri tarayıcıda düzenle",
    icon: "PDF",
    href: "/pdf-tools",
    items: [
      ["PDF → PNG / JPG", "/pdf-tools/pdf-to-png"],
      ["Görsellerden PDF", "/pdf-tools/images-to-pdf"],
      ["PDF Birleştir", "/pdf-tools/merge"],
      ["PDF Sıkıştır", "/pdf-tools/compress"],
      ["Sayfaları Ayır", "/pdf-tools/split"],
      ["Sayfaları Düzenle", "/pdf-tools/organize"],
      ["Pafta Boyutu ve Ölçek", "/pdf-tools/resize-pages"],
      ["Diğer PDF Araçları", "/pdf-tools"],
    ],
  },
  {
    title: "Jüri ve Teslim",
    description: "Sunum, jüri ve teslim öncesi kontroller",
    icon: "JT",
    href: "/teslim-araclari",
    items: [
      ["Jüri Gözü", "/teslim-araclari/juri-gozu"],
      ["Teslim Kontrol Merkezi", "/teslim-araclari/kontrol-merkezi"],
      ["Pafta Yerleşimi", "/proje-araclari/pafta-yerlesimi"],
      ["Teslim Kontrol Listesi", "/student-tools/submission-checklist"],
      ["Dosya Adı Oluşturucu", "/student-tools/file-name-generator"],
    ],
  },
  {
    title: "Detay ve Malzemeler",
    description: "Mimari detaylar, katmanlar ve yapı malzemeleri",
    icon: "DM",
    href: "/kutuphaneler",
    matchPaths: ["/kutuphaneler", "/mimari-detaylar", "/yapi-malzemeleri"],
    items: [
      ["Mimari Detay Kütüphanesi", "/mimari-detaylar"],
      ["Yapı Malzemeleri", "/yapi-malzemeleri"],
      ["Yalıtım Malzemeleri", "/yapi-malzemeleri/yalitim"],
      ["Duvar Malzemeleri", "/yapi-malzemeleri/duvar"],
      ["Malzeme Karşılaştır", "/yapi-malzemeleri/karsilastir"],
      ["U-Değeri Tasarımcısı", "/proje-araclari/u-degeri-tasarimcisi"],
    ],
  },
  {
    title: "Uygulama Rehberi",
    description: "Revit, AutoCAD, SketchUp, Rhino ve BIM rehberleri",
    icon: "UR",
    href: "/rehberler",
    matchPaths: ["/rehberler", "/revit", "/autocad", "/sketchup", "/rhino", "/bim"],
    items: [
      ["Mimari Uygulama Rehberleri", "/rehberler"],
      ["Revit Merkezi", "/revit"],
      ["AutoCAD Rehberleri", "/autocad"],
      ["SketchUp Rehberleri", "/sketchup"],
      ["Rhino Rehberleri", "/rhino"],
      ["BIM Merkezi", "/bim"],
      ["Revit Duvar Katmanları", "/revit/duvar-katmanlari"],
    ],
  },
  {
    title: "Mimarlık Kültürü",
    description: "Akımlar, kavramlar, mimarlar ve ikonik yapılar",
    icon: "MK",
    href: "/mimarlik",
    items: [
      ["Mimarlık Akımları", "/mimarlik/kategori/akimlar"],
      ["Mimari Kavramlar", "/mimarlik/kategori/kavramlar"],
      ["Önemli Mimarlar", "/mimarlik/kategori/mimarlar"],
      ["İkonik Yapılar", "/mimarlik/kategori/yapilar"],
    ],
  },
  {
    title: "Öğrenci Araçları",
    description: "Okul, not ve teslim yardımcıları",
    icon: "ÖA",
    href: "/student-tools",
    items: [
      ["GNO Hesaplama", "/student-tools/gno-calculator"],
      ["Ders Notu Hesaplama", "/student-tools/grade-calculator"],
      ["Devamsızlık Hesaplama", "/student-tools/attendance-calculator"],
      ["Öğrenci Takvimi", "/student-tools/calendar"],
      ["Teslim Kontrol Listesi", "/student-tools/submission-checklist"],
    ],
  },
  {
    title: "Mimari AI",
    description: "Mimarlık için AI araçları ve prompt yardımcıları",
    icon: "AI",
    href: "/mimarlik-yapay-zeka",
    items: [
      ["AI Araç Bulucu", "/mimarlik-yapay-zeka/arac-bulucu"],
      ["Prompt Oluşturucu", "/mimarlik-yapay-zeka/prompt-olusturucu"],
    ],
  },
] as const;

function isGroupCurrent(
  pathname: string,
  group: (typeof navigationGroups)[number]
) {
  const paths =
    "matchPaths" in group ? group.matchPaths : ([group.href] as readonly string[]);
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export default function PaftaHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [query, setQuery] = useState("");
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

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

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setActiveCategory(null);
        setMobileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setQuery("");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveCategory(null);
        setMobileOpen(false);
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

      if (currentScrollY < 88 || movement < -7) {
        setIsHeaderHidden(false);
      } else if (
        movement > 9 &&
        !activeCategory &&
        !mobileOpen &&
        normalizedQuery === ""
      ) {
        setIsHeaderHidden(true);
      }

      lastScrollY.current = currentScrollY;
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory, mobileOpen, normalizedQuery]);

  function closeMenus() {
    setActiveCategory(null);
    setMobileOpen(false);
    setQuery("");
  }

  function goToItem(href: string) {
    trackToolEvent("site_search", "result_opened", { query, href });
    router.push(href);
    closeMenus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results.length > 0) {
      goToItem((results[selectedResultIndex] ?? results[0]).href);
    }
  }

  function handleSearchKeyDown(
    event: ReactKeyboardEvent<HTMLInputElement>
  ) {
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
      goToItem((results[selectedResultIndex] ?? results[0]).href);
    }
  }

  const activeGroup = navigationGroups.find(
    (group) => group.title === activeCategory
  );

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setActiveCategory(null)}
      className={`pafta-header sticky top-0 z-50 border-b border-[#1e293b] bg-[#020617] text-white shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
        isHeaderHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-3 sm:h-[4.5rem] sm:gap-4">
          <Link
            href="/"
            onClick={closeMenus}
            aria-label="PAFTA ana sayfa"
            className="shrink-0"
          >
            <Image
              src="/pafta-logo-white.png"
              alt="PAFTA logosu"
              width={600}
              height={200}
              priority
              className="h-12 w-40 object-cover object-center sm:h-[4.5rem] sm:w-60 lg:h-20 lg:w-72"
            />
          </Link>

          <div ref={searchRef} className="relative ml-auto w-full max-w-xl">
            <form onSubmit={handleSubmit} className="relative">
              <label htmlFor="pafta-search" className="sr-only">
                PAFTA içinde ara
              </label>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-slate-400 stroke-2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                id="pafta-search"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedResultIndex(0);
                  setActiveCategory(null);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Araç, malzeme veya konu ara…"
                autoComplete="off"
                role="combobox"
                aria-expanded={normalizedQuery !== ""}
                aria-controls="pafta-search-results"
                className="w-full rounded-xl border border-white/10 bg-white/[0.055] py-2.5 pl-10 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-cyan-300/55 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-300/8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-slate-500 sm:block">
                ARA
              </span>
            </form>
            {normalizedQuery !== "" && (
              <SearchResults
                id="pafta-search-results"
                results={results}
                selectedIndex={selectedResultIndex}
                onSelect={goToItem}
                onHover={setSelectedResultIndex}
              />
            )}
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Bölümleri kapat" : "Bölümleri aç"}
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((current) => !current);
              setActiveCategory(null);
              setQuery("");
            }}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 text-xs font-bold text-slate-200 lg:hidden"
          >
            <span className="flex flex-col gap-1" aria-hidden="true">
              <span className="h-px w-4 bg-current" />
              <span className="h-px w-4 bg-current" />
              <span className="h-px w-4 bg-current" />
            </span>
            <span className="hidden sm:inline">Bölümler</span>
          </button>
        </div>

        <nav
          aria-label="Ana bölümler"
          className="hidden grid-cols-9 gap-1 border-t border-white/[0.065] py-1.5 lg:grid"
        >
          {navigationGroups.map((group) => {
            const isOpen = activeCategory === group.title;
            const isCurrent = isGroupCurrent(pathname, group);

            return (
              <div
                key={group.title}
                onMouseEnter={() => {
                  setActiveCategory(group.title);
                  setQuery("");
                }}
                className="min-w-0"
              >
                <Link
                  href={group.href}
                  onFocus={() => setActiveCategory(group.title)}
                  onClick={closeMenus}
                  className={`flex h-9 items-center justify-center gap-1 rounded-lg px-1.5 text-center text-[10px] font-semibold leading-tight transition xl:px-2 xl:text-[11px] ${
                    isOpen
                      ? "bg-cyan-300 text-slate-950"
                      : isCurrent
                        ? "bg-cyan-300/12 text-cyan-200"
                        : "text-slate-400 hover:bg-white/[0.065] hover:text-white"
                  }`}
                >
                  <span>{group.title}</span>
                  <span
                    className={`text-[9px] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      {activeGroup && (
        <div className="absolute left-0 right-0 top-full hidden border-b border-white/10 bg-[#0a1422]/98 shadow-2xl shadow-black/40 lg:block">
          <div className="mx-auto grid max-w-7xl grid-cols-[215px_1fr] gap-5 px-6 py-3.5">
            <div className="border-r border-white/8 pr-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/10 text-sm font-black text-cyan-300">
                {activeGroup.icon}
              </span>
              <h2 className="mt-2.5 text-base font-bold">{activeGroup.title}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                {activeGroup.description}
              </p>
              <Link
                href={activeGroup.href}
                onClick={closeMenus}
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200"
              >
                Bölüm sayfasını aç <span aria-hidden="true">→</span>
              </Link>
            </div>
            <nav
              aria-label={`${activeGroup.title} alt başlıkları`}
              className="grid content-start gap-1.5 sm:grid-cols-2 xl:grid-cols-4"
            >
              {activeGroup.items.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  className="group flex min-h-9 items-center justify-between gap-2 rounded-lg border border-white/[0.075] bg-white/[0.035] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07] hover:text-white"
                >
                  <span>{label}</span>
                  <span className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4.4rem)] overflow-y-auto border-t border-white/8 bg-[#081321] px-4 py-4 lg:hidden">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
            Tüm bölümler
          </p>
          <nav className="grid gap-2 sm:grid-cols-2" aria-label="Mobil bölümler">
            {navigationGroups.map((group) => (
              <Link
                key={group.href}
                href={group.href}
                onClick={closeMenus}
                className={`flex items-center gap-3 rounded-xl border p-3.5 ${
                  isGroupCurrent(pathname, group)
                    ? "border-cyan-300/35 bg-cyan-300/10"
                    : "border-white/[0.075] bg-white/[0.035]"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.055] text-sm font-black text-cyan-300">
                  {group.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white">
                    {group.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                    {group.description}
                  </span>
                </span>
                <span className="ml-auto text-cyan-300">→</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function SearchResults({
  id,
  results,
  selectedIndex,
  onSelect,
  onHover,
}: {
  id: string;
  results: (SearchableItem & { score: number })[];
  selectedIndex: number;
  onSelect: (href: string) => void;
  onHover: (index: number) => void;
}) {
  return (
    <div
      id={id}
      role="listbox"
      className="absolute left-0 right-0 top-full z-[70] mt-2 max-h-[65vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c1726] p-1.5 shadow-2xl shadow-black/50"
    >
      {results.length > 0 ? (
        <>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
              En iyi sonuçlar
            </span>
            <span className="hidden text-[10px] text-slate-600 sm:inline">
              ↑↓ seç · Enter aç
            </span>
          </div>
          {results.map((item, index) => (
            <button
              key={item.href}
              type="button"
              role="option"
              aria-selected={selectedIndex === index}
              onMouseEnter={() => onHover(index)}
              onClick={() => onSelect(item.href)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                selectedIndex === index
                  ? "bg-white/[0.075]"
                  : "hover:bg-white/[0.055]"
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">
                  {item.title}
                </span>
                <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.16em] text-cyan-400">
                  {getSearchCategory(item.href)}
                </span>
              </span>
              <span className="text-cyan-300">→</span>
            </button>
          ))}
        </>
      ) : (
        <div className="px-4 py-6">
          <p className="font-semibold text-white">Sonuç bulunamadı</p>
          <p className="mt-1 text-sm text-slate-400">
            Daha kısa bir ifade veya farklı bir kelime dene.
          </p>
        </div>
      )}
    </div>
  );
}
