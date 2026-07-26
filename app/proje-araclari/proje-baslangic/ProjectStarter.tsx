"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { projectTemplates } from "../data";

export default function ProjectStarter() {
  const router = useRouter();
  const [slug, setSlug] = useState(projectTemplates[0].slug);
  const template = projectTemplates.find((item) => item.slug === slug) ?? projectTemplates[0];
  const [area, setArea] = useState(template.defaultArea);
  const [users, setUsers] = useState(template.defaultUsers);
  const [floors, setFloors] = useState(3);
  const [generated, setGenerated] = useState(false);

  const result = useMemo(() => {
    const circulation = area * 0.18;
    const programmedArea = area - circulation;
    return template.spaces.map((space) => ({
      ...space,
      area: Math.max(space.minimum, Math.round(programmedArea * space.ratio)),
    }));
  }, [area, template]);

  const netTotal = result.reduce((sum, item) => sum + item.area, 0);
  const grossNeed = Math.round(netTotal / 0.82);

  function changeType(nextSlug: string) {
    const next = projectTemplates.find((item) => item.slug === nextSlug) ?? projectTemplates[0];
    setSlug(nextSlug);
    setArea(next.defaultArea);
    setUsers(next.defaultUsers);
    setGenerated(false);
  }

  function sendToBubbleDiagram() {
    window.localStorage.setItem(
      "pafta-bubble-program",
      JSON.stringify({
        title: template.name,
        spaces: result.map((space) => ({
          name: space.name,
          area: space.area,
          group: space.group,
        })),
        relations: template.relations,
      })
    );
    router.push("/proje-araclari/balon-diyagrami");
  }

  return (
    <div>
      <div className="grid gap-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 lg:grid-cols-4">
        <label className="text-sm text-slate-300">Proje türü
          <select value={slug} onChange={(event) => changeType(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white">
            {projectTemplates.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <label className="text-sm text-slate-300">Hedef brüt alan (m²)
          <input type="number" min="100" value={area} onChange={(event) => setArea(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
        </label>
        <label className="text-sm text-slate-300">Kullanıcı sayısı
          <input type="number" min="1" value={users} onChange={(event) => setUsers(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
        </label>
        <label className="text-sm text-slate-300">Kat sayısı
          <input type="number" min="1" max="20" value={floors} onChange={(event) => setFloors(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
        </label>
        <button onClick={() => setGenerated(true)} className="rounded-xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 hover:bg-cyan-300 lg:col-span-4">Programı oluştur</button>
      </div>

      {generated && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-3 sm:grid-cols-4">
            {[["Hedef alan", `${area.toLocaleString("tr-TR")} m²`], ["Önerilen brüt", `${grossNeed.toLocaleString("tr-TR")} m²`], ["Kişi başı", `${(area / Math.max(users, 1)).toFixed(1)} m²`], ["Kat başı", `${Math.round(area / Math.max(floors, 1)).toLocaleString("tr-TR")} m²`]].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-cyan-300">{value}</p></div>
            ))}
          </div>

          <section className="overflow-hidden rounded-3xl border border-slate-800">
            <div className="border-b border-slate-800 bg-slate-900 px-6 py-5"><h2 className="text-xl font-bold">Önerilen ihtiyaç programı</h2><p className="mt-1 text-sm text-slate-400">Alanlar başlangıç senaryosudur; bağlam ve kullanıcı gereksinimleriyle geliştirilmelidir.</p></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-900/60 text-slate-400"><tr><th className="p-4">Mekân</th><th className="p-4">Grup</th><th className="p-4">Öneri</th><th className="p-4">Tasarım notu</th></tr></thead>
                <tbody>{result.map((space) => <tr key={space.name} className="border-t border-slate-800"><td className="p-4 font-semibold">{space.name}</td><td className="p-4 text-slate-400">{space.group}</td><td className="p-4 font-mono text-cyan-300">{space.area} m²</td><td className="p-4 text-slate-400">{space.note}</td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-xl font-bold">Komşuluk matrisi özeti</h2><div className="mt-5 space-y-3">{template.relations.map(([a, b, relation]) => <div key={`${a}-${b}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl bg-slate-950 p-3 text-sm"><span>{a}</span><span className={relation === "Yakın" ? "text-emerald-400" : relation === "Ayrı" ? "text-rose-400" : "text-amber-300"}>{relation}</span><span className="text-right">{b}</span></div>)}</div></section>
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-xl font-bold">Kat ve zonlama yaklaşımı</h2><ol className="mt-5 space-y-3">{template.floorLogic.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="font-mono text-cyan-400">0{index + 1}</span>{item}</li>)}</ol></section>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={sendToBubbleDiagram} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300">Balon diyagramına aktar →</button>
            <button onClick={() => window.print()} className="rounded-xl border border-cyan-400/60 px-5 py-3 font-semibold text-cyan-300 hover:bg-cyan-400/10">Raporu yazdır / PDF kaydet</button>
          </div>
        </div>
      )}
    </div>
  );
}
