"use client";

import { useMemo, useState } from "react";

export default function ScaleCalculatorPage() {
  const [realSize, setRealSize] = useState("");
  const [scale, setScale] = useState("50");

  const result = useMemo(() => {
    const value = Number(realSize);

    if (!value || value <= 0) return "";

    return (value / Number(scale)).toFixed(2);
  }, [realSize, scale]);

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

        </div>
      </div>
    </main>
  );
}
