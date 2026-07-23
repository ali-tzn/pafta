"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const tools = [
  {
    title: "Ölçek Hesaplayıcı",
    href: "/tools/scale-calculator",
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

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const normalizedQuery = query
    .trim()
    .toLocaleLowerCase("tr-TR");

  const results =
    normalizedQuery === ""
      ? []
      : tools.filter((tool) =>
          tool.title
            .toLocaleLowerCase("tr-TR")
            .includes(normalizedQuery)
        );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (results.length > 0) {
      router.push(results[0].href);
      setQuery("");
    }
  }

  function goToTool(href: string) {
    router.push(href);
    setQuery("");
  }

  return (
    <header className="relative z-50 border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/"
            aria-label="PAFTA ana sayfa"
            className="shrink-0"
          >
            <Image
              src="/pafta-logo-white.png"
              alt="PAFTA"
              width={600}
              height={200}
              priority
              className="h-16 w-52 object-cover object-center"
            />
          </Link>

          <div className="relative w-full lg:max-w-xl">
            <form onSubmit={handleSubmit} className="relative">
              <label htmlFor="header-search" className="sr-only">
                Araçlarda ara
              </label>

              <input
                id="header-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ölçek, merdiven veya alan ara..."
                autoComplete="off"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3.5 pr-24 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              />

              <button
                type="submit"
                className="absolute bottom-2 right-2 top-2 rounded-xl bg-cyan-400 px-5 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Ara
              </button>
            </form>

            {normalizedQuery !== "" && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-left shadow-2xl">
                {results.length > 0 ? (
                  results.map((tool) => (
                    <button
                      key={tool.href}
                      type="button"
                      onClick={() => goToTool(tool.href)}
                      className="block w-full border-b border-slate-800 px-5 py-4 text-left transition last:border-b-0 hover:bg-slate-800"
                    >
                      <span className="font-semibold text-white">
                        {tool.title}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-4">
                    <p className="font-medium text-white">
                      Sonuç bulunamadı
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Ölçek, merdiven veya alan yazmayı dene.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-800 py-4 text-sm font-medium text-slate-300">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>

          <Link
            href="/tools"
            className="transition hover:text-cyan-400"
          >
            Araçlar
          </Link>

          <Link
            href="/revit"
            className="transition hover:text-cyan-400"
          >
            Revit
          </Link>

          <Link
            href="/bim"
            className="transition hover:text-cyan-400"
          >
            BIM
          </Link>

          <Link
            href="/resources"
            className="transition hover:text-cyan-400"
          >
            Kaynaklar
          </Link>
        </nav>
      </div>
    </header>
  );
}
