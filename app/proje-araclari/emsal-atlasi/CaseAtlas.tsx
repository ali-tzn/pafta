"use client";

import Link from "next/link";
import { useState } from "react";
import { caseStudies } from "../data";

export default function CaseAtlas() {
  const [type, setType] = useState("Tümü");
  const [query, setQuery] = useState("");
  const types = ["Tümü", ...Array.from(new Set(caseStudies.map((item) => item.type)))];
  const filtered = caseStudies.filter((item) => (type === "Tümü" || item.type === type) && `${item.name} ${item.architect} ${item.location}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")));
  return <>
    <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-[1fr_240px]"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Yapı, mimar veya şehir ara..." className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" /><select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">{types.map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="mt-6 grid gap-4 md:grid-cols-2">{filtered.map((item) => <Link href={`/proje-araclari/emsal-atlasi/${item.slug}`} key={item.slug} className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-cyan-400/60"><div className="flex justify-between gap-4 text-xs uppercase tracking-wider text-cyan-400"><span>{item.type}</span><span>{item.year}</span></div><h2 className="mt-5 text-2xl font-bold group-hover:text-cyan-300">{item.name}</h2><p className="mt-2 text-slate-400">{item.architect} · {item.location}</p><p className="mt-5 line-clamp-2 leading-7 text-slate-300">{item.strategy}</p><div className="mt-6 flex justify-between border-t border-slate-800 pt-4 text-sm"><span className="text-slate-500">Yaklaşık alan</span><span className="font-mono">{item.area.toLocaleString("tr-TR")} m²</span></div></Link>)}</div>
  </>;
}
