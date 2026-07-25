"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/app/components/RelatedTools";
import { trackToolEvent } from "@/lib/analytics";

export default function ScaleCalculatorPage() {
  const [realSize, setRealSize] = useState("");
  const [scale, setScale] = useState("50");
  const [copyStatus, setCopyStatus] = useState("");

  const result = useMemo(() => {
    const value = Number(realSize);

    if (!value || value <= 0) return "";

    return (value / Number(scale)).toFixed(2);
  }, [realSize, scale]);

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(
      `${realSize} cm gerçek ölçü, 1/${scale} ölçekte çizimde ${result} cm olur.`
    );
    setCopyStatus("Sonuç kopyalandı.");
    trackToolEvent("scale_calculator", "result_copied", {
      scale: Number(scale),
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Ölçek Hesaplayıcı
        </h1>

        <p className="mt-4 text-slate-300">
          Gerçek ölçüyü girin, çizimde kaç santimetre olacağını anında görün.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:mt-10 sm:p-8">

          <label className="mb-2 block">
            Gerçek Ölçü (cm)
          </label>

          <input
            type="number"
            value={realSize}
            onChange={(e) => setRealSize(e.target.value)}
            placeholder="Örneğin 350"
            className="w-full rounded-xl bg-slate-800 px-4 py-3"
          />

          <label className="mt-6 mb-2 block">
            Ölçek
          </label>

          <select
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            className="w-full rounded-xl bg-slate-800 px-4 py-3"
          >
            <option value="20">1/20</option>
            <option value="50">1/50</option>
            <option value="100">1/100</option>
            <option value="200">1/200</option>
            <option value="500">1/500</option>
          </select>

          <div className="mt-8 rounded-xl bg-cyan-500 p-6 text-center">
            <p className="text-lg text-black">
              Çizimde Görünecek Ölçü
            </p>

            <h2 className="mt-2 text-4xl font-bold text-black">
              {result ? `${result} cm` : "--"}
            </h2>
          </div>

          {result && (
            <button
              type="button"
              onClick={copyResult}
              className="mt-4 w-full rounded-xl border border-cyan-400/40 px-4 py-3 font-semibold text-cyan-300 hover:bg-cyan-400/10"
            >
              Sonucu kopyala
            </button>
          )}
          {copyStatus && (
            <p className="mt-3 text-center text-sm text-slate-400">{copyStatus}</p>
          )}

        </div>
        <RelatedTools currentHref="/tools/scale-calculator" kind="calculation" />
      </div>
    </main>
  );
}
