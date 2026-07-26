"use client";

import Link from "next/link";
import { useState } from "react";
import { spaceStandards } from "../data";

export default function SpaceLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tümü");
  const categories = ["Tümü", ...Array.from(new Set(spaceStandards.map((item) => item.category)))];
  const filtered = spaceStandards.filter((item) => (category === "Tümü" || item.category === category) && `${item.name} ${item.category}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")));

  return (
    <>
      <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-[1fr_240px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mekân ara: derslik, ofis, otopark..." className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <p className="mt-5 text-sm text-slate-500">{filtered.length} mekân gösteriliyor</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((space) => (
          <Link key={space.slug} href={`/proje-araclari/mekan-olculeri/${space.slug}`} className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-cyan-400/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">{space.category}</span>
            <h2 className="mt-3 text-xl font-bold group-hover:text-cyan-300">{space.name}</h2>
            <dl className="mt-5 space-y-2 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">Minimum</dt><dd className="text-right">{space.min}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Önerilen</dt><dd className="text-right text-cyan-300">{space.ideal}</dd></div></dl>
          </Link>
        ))}
      </div>
    </>
  );
}
