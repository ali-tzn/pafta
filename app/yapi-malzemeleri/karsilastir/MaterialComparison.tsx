"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  materialCategories,
  materials,
  ratingLabels,
  type RatingKey,
} from "../materials";

export default function MaterialComparison() {
  const [priority, setPriority] = useState<RatingKey>("thermal");
  const [category, setCategory] = useState("duvar");
  const categoryMaterials = useMemo(
    () => materials.filter((material) => material.category === category),
    [category]
  );
  const [selectedSlugs, setSelectedSlugs] = useState([
    "tugla",
    "gazbeton",
    "bims",
  ]);

  const selected = categoryMaterials.filter((material) =>
    selectedSlugs.includes(material.slug)
  );
  const ranked = useMemo(() => [...selected].sort((a, b) => b.ratings[priority] - a.ratings[priority]), [selected, priority]);

  function changeCategory(nextCategory: string) {
    const nextMaterials = materials.filter(
      (material) => material.category === nextCategory
    );
    setCategory(nextCategory);
    setSelectedSlugs(nextMaterials.slice(0, 3).map((material) => material.slug));
  }

  function toggleMaterial(slug: string) {
    setSelectedSlugs((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length < 4
          ? [...current, slug]
          : current
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/yapi-malzemeleri">Yapı Malzemeleri</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">Karşılaştırma</span>
        </nav>

        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Karar destek aracı
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Yapı Malzemelerini Karşılaştır
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Aynı kategoriden en fazla dört malzemeyi seç; genel performans,
            avantaj ve uygulama notlarını yan yana incele.
          </p>
        </header>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300">
              Malzeme kategorisi
            </span>
            <select
              value={category}
              onChange={(event) => changeCategory(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 md:max-w-md"
            >
              {materialCategories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            {categoryMaterials.map((material) => {
              const active = selectedSlugs.includes(material.slug);
              return (
                <button
                  key={material.slug}
                  type="button"
                  onClick={() => toggleMaterial(material.slug)}
                  className={`rounded-xl border px-4 py-3 font-semibold transition ${
                    active
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 bg-slate-950 text-slate-300"
                  }`}
                >
                  {active ? "✓ " : ""}
                  {material.name}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            En fazla dört malzeme seçebilirsin.
          </p>
        </section>

        {selected.length > 0 && <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Karar özeti</p><h2 className="mt-2 text-2xl font-bold">Önceliğin hangisi?</h2><p className="mt-2 text-sm leading-6 text-slate-400">Önceliğini seçtiğinde malzemeler o ölçüte göre sıralanır. Bu sonuç nihai ürün seçimi değil, kısa liste desteğidir.</p></div><div className="flex flex-wrap gap-2">{(Object.keys(ratingLabels) as RatingKey[]).map((key) => <button type="button" key={key} onClick={() => setPriority(key)} className={`rounded-full border px-3 py-2 text-sm font-semibold ${priority === key ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-slate-700 bg-slate-950 text-slate-300"}`}>{ratingLabels[key]}</button>)}</div></div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{ranked.map((material, index) => <div key={material.slug} className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><span className="text-xs font-semibold text-cyan-400">{index === 0 ? "Bu öncelikte en güçlü" : `${index + 1}. sırada`}</span><h3 className="mt-1 font-semibold">{material.name}</h3><p className="mt-2 text-sm text-slate-400">{ratingLabels[priority]}: <strong className="text-white">{material.ratings[priority]}/5</strong></p><p className="mt-2 text-xs leading-5 text-slate-500">{material.uses[0]}</p></div>)}</div>
        </section>}

        {selected.length > 0 ? (
          <section className="mt-8 overflow-x-auto rounded-3xl border border-slate-800">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="p-5 text-slate-400">Ölçüt</th>
                  {selected.map((material) => (
                    <th key={material.slug} className="p-5 text-xl text-cyan-300">
                      {material.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950">
                {(Object.keys(ratingLabels) as RatingKey[]).map((key) => (
                  <tr key={key}>
                    <th className="p-5 font-medium text-slate-300">
                      {ratingLabels[key]}
                    </th>
                    {selected.map((material) => (
                      <td key={material.slug} className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-cyan-400"
                              style={{
                                width: `${material.ratings[key] * 20}%`,
                              }}
                            />
                          </div>
                          <strong>{material.ratings[key]}/5</strong>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th className="p-5 align-top font-medium text-slate-300">
                    Öne çıkan avantajlar
                  </th>
                  {selected.map((material) => (
                    <td key={material.slug} className="p-5 align-top">
                      <ul className="space-y-2 text-sm leading-6 text-slate-400">
                        {material.advantages.slice(0, 3).map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="p-5 align-top font-medium text-slate-300">
                    Dikkat noktaları
                  </th>
                  {selected.map((material) => (
                    <td key={material.slug} className="p-5 align-top">
                      <ul className="space-y-2 text-sm leading-6 text-slate-400">
                        {material.considerations.slice(0, 3).map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th className="p-5">Detay</th>
                  {selected.map((material) => (
                    <td key={material.slug} className="p-5">
                      <Link
                        href={`/yapi-malzemeleri/${material.category}/${material.slug}`}
                        className="font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        Rehberi aç →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>
        ) : (
          <p className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-200">
            Karşılaştırmak için en az bir malzeme seç.
          </p>
        )}

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
          <h2 className="text-lg font-semibold text-amber-200">
            Karşılaştırma puanları ne anlama geliyor?
          </h2>
          <p className="mt-3 leading-7 text-slate-300">
            Puanlar malzemelerin tipik kullanımını anlatan genel ve göreli bir
            ön değerlendirmedir; ürün teknik değeri veya proje onayı değildir.
            Son seçimde kalınlık, yoğunluk, sistem katmanları, üretici teknik
            föyü, mevzuat, bütçe ve uzman hesapları birlikte değerlendirilmelidir.
          </p>
        </section>
      </div>
    </main>
  );
}
