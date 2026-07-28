"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type CategoryHubItem = {
  title: string;
  description: string;
  href: string;
  icon: string;
  group: string;
  badge?: string;
  featured?: boolean;
};

export default function CategoryHub({
  eyebrow,
  title,
  description,
  items,
  searchPlaceholder,
  footerTitle,
  footerText,
  related = [],
  faqs = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: CategoryHubItem[];
  searchPlaceholder: string;
  footerTitle: string;
  footerText: string;
  related?: { title: string; href: string }[];
  faqs?: { question: string; answer: string }[];
}) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("Tümü");
  const groups = ["Tümü", ...Array.from(new Set(items.map((item) => item.group)))];
  const featured = items.filter((item) => item.featured).slice(0, 3);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    return items.filter((item) => {
      const matchesGroup = activeGroup === "Tümü" || item.group === activeGroup;
      const matchesQuery =
        !normalized ||
        `${item.title} ${item.description} ${item.group}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalized);
      return matchesGroup && matchesQuery;
    });
  }, [activeGroup, items, query]);

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqData).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-4 border-b border-slate-800 pb-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
              {eyebrow}
            </p>
            <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              {description}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <label htmlFor={`category-search-${title}`} className="text-xs font-semibold text-slate-300">
              Bu bölümde ara
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">⌕</span>
              <input
                id={`category-search-${title}`}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>
          </div>
        </header>

        {featured.length > 0 && !query && activeGroup === "Tümü" && (
          <section className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">Hızlı başlangıç</p>
                <h2 className="mt-0.5 text-base font-bold">En çok ihtiyaç duyulanlar</h2>
              </div>
              <span className="text-sm text-slate-500">{items.length} içerik</span>
            </div>
            <div className="mt-3 grid gap-2.5 lg:grid-cols-3">
              {featured.map((item) => (
                <ToolCard key={item.href} item={item} featured />
              ))}
            </div>
          </section>
        )}

        <section className="mt-7">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeGroup === group
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/60"
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">
              {activeGroup === "Tümü" ? "Tüm içerikler" : activeGroup}
            </h2>
            <span className="text-sm text-slate-500">{filteredItems.length} sonuç</span>
          </div>

          {filteredItems.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <ToolCard key={item.href} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-900 px-6 py-14 text-center">
              <h3 className="text-xl font-semibold">Eşleşen içerik bulunamadı</h3>
              <p className="mt-2 text-slate-400">Başka bir kelime veya kategori dene.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveGroup("Tümü");
                }}
                className="mt-5 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
              >
                Filtreleri temizle
              </button>
            </div>
          )}
        </section>

        {faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="text-3xl font-bold">Sık sorulan sorular</h2>
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {item.question}
                    <span className="text-cyan-300 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-400">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 grid gap-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-cyan-200">{footerTitle}</h2>
            <p className="mt-3 max-w-4xl leading-7 text-slate-300">{footerText}</p>
          </div>
          {related.length > 0 && (
            <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
              {related.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-cyan-300/25 bg-slate-950 px-4 py-3 text-sm font-semibold text-cyan-300 hover:border-cyan-300"
                >
                  {item.title} →
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ToolCard({
  item,
  featured = false,
}: {
  item: CategoryHubItem;
  featured?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`group flex h-full flex-col border transition hover:-translate-y-0.5 hover:border-cyan-400/60 ${
        featured
          ? "rounded-xl border-cyan-400/20 bg-slate-950/70 p-3"
          : "rounded-3xl border-slate-800 bg-slate-900 p-6"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`flex items-center justify-center border border-slate-700 bg-slate-950 font-bold text-cyan-300 ${
          featured ? "h-8 w-8 rounded-lg text-xs" : "h-12 w-12 rounded-2xl text-xl"
        }`}>
          {item.icon}
        </span>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-400">
          {item.badge ?? item.group}
        </span>
      </div>
      <h3 className={`${featured ? "mt-2.5 text-sm" : "mt-6 text-xl"} font-bold transition group-hover:text-cyan-300`}>
        {item.title}
      </h3>
      <p className={`mt-1.5 flex-1 text-slate-400 ${featured ? "line-clamp-2 text-[11px] leading-4" : "text-sm leading-7"}`}>
        {item.description}
      </p>
      <span className={`${featured ? "mt-2 pt-2 text-[11px]" : "mt-6 pt-4 text-sm"} border-t border-slate-800 font-semibold text-cyan-300`}>
        Aç ve kullan →
      </span>
    </Link>
  );
}
