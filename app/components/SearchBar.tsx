"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const tools = [
  {
    title: "Mimarlık Rehberi",
    href: "/mimarlik",
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

  const results = tools.filter((tool) =>
    tool.title
      .toLocaleLowerCase("tr-TR")
      .includes(query.trim().toLocaleLowerCase("tr-TR"))
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
