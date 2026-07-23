"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GradeItem = {
  id: number;
  name: string;
  score: string;
  weight: string;
};

export default function GradeCalculatorPage() {
  const [items, setItems] = useState<GradeItem[]>([
    {
      id: 1,
      name: "Vize",
      score: "70",
      weight: "30",
    },
    {
      id: 2,
      name: "Final",
      score: "80",
      weight: "50",
    },
    {
      id: 3,
      name: "Proje",
      score: "90",
      weight: "20",
    },
  ]);

  const [passingGrade, setPassingGrade] = useState("60");

  const result = useMemo(() => {
    let totalWeight = 0;
    let weightedScore = 0;

    for (const item of items) {
      const score = Number(item.score);
      const weight = Number(item.weight);

      if (
        !Number.isFinite(score) ||
        !Number.isFinite(weight) ||
        score < 0 ||
        score > 100 ||
        weight < 0
      ) {
        continue;
      }

      totalWeight += weight;
      weightedScore += score * (weight / 100);
    }

    const finalScore = weightedScore;
    const passLimit = Number(passingGrade);

    return {
      totalWeight,
      finalScore,
      remainingWeight: Math.max(0, 100 - totalWeight),
      exceedsWeight: totalWeight > 100,
      isComplete: totalWeight === 100,
      passed:
        totalWeight === 100 &&
        Number.isFinite(passLimit) &&
        finalScore >= passLimit,
    };
  }, [items, passingGrade]);

  function updateItem(
    id: number,
    field: keyof Omit<GradeItem, "id">,
    value: string
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      {
        id: Date.now(),
        name: "",
        score: "",
        weight: "",
      },
    ]);
  }

  function removeItem(id: number) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  function clearItems() {
    setItems([
      {
        id: Date.now(),
        name: "",
        score: "",
        weight: "",
      },
    ]);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link
            href="/"
            className="transition hover:text-cyan-400"
          >
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/student-tools"
            className="transition hover:text-cyan-400"
          >
            Öğrenci Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Ders Notu Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Öğrenci Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Ders Notu Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Vize, final, proje, quiz ve ödev notlarını ağırlıklarıyla
            birlikte girerek dönem sonu notunu hesapla.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:grid-cols-[1fr_130px_130px_auto]"
                >
                  <div>
                    <label
                      htmlFor={`name-${item.id}`}
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Bileşen {index + 1}
                    </label>

                    <input
                      id={`name-${item.id}`}
                      type="text"
                      value={item.name}
                      onChange={(event) =>
                        updateItem(
                          item.id,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Vize, final, proje..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`score-${item.id}`}
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Not
                    </label>

                    <input
                      id={`score-${item.id}`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.score}
                      onChange={(event) =>
                        updateItem(
                          item.id,
                          "score",
                          event.target.value
                        )
                      }
                      placeholder="0–100"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`weight-${item.id}`}
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Ağırlık %
                    </label>

                    <input
                      id={`weight-${item.id}`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.weight}
                      onChange={(event) =>
                        updateItem(
                          item.id,
                          "weight",
                          event.target.value
                        )
                      }
                      placeholder="%"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="w-full rounded-xl border border-red-400/30 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addItem}
                className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                + Bileşen ekle
              </button>

              <button
                type="button"
                onClick={clearItems}
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                Listeyi temizle
              </button>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            <section
              className={`rounded-3xl border p-7 ${
                result.exceedsWeight
                  ? "border-red-400/30 bg-red-400/10"
                  : "border-cyan-400/30 bg-cyan-400/10"
              }`}
            >
              <p
                className={`text-sm font-semibold uppercase tracking-wider ${
                  result.exceedsWeight
                    ? "text-red-300"
                    : "text-cyan-300"
                }`}
              >
                Hesap sonucu
              </p>

              <p className="mt-5 text-6xl font-bold">
                {formatScore(result.finalScore)}
              </p>

              <p className="mt-2 text-slate-300">
                100 üzerinden dönem notu
              </p>

              {!result.isComplete && !result.exceedsWeight && (
                <p className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-amber-300">
                  Ağırlıkların toplamı henüz %100 değil. Kalan ağırlık: %
                  {formatNumber(result.remainingWeight)}
                </p>
              )}

              {result.exceedsWeight && (
                <p className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-red-300">
                  Ağırlıkların toplamı %100’ü geçiyor. Yüzdeleri kontrol et.
                </p>
              )}

              {result.isComplete && (
                <div
                  className={`mt-5 rounded-2xl bg-slate-950 p-5 ${
                    result.passed
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  <p className="text-sm text-slate-400">
                    Başarı durumu
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {result.passed ? "Geçti" : "Kaldı"}
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <label
                htmlFor="passing-grade"
                className="block text-sm text-slate-400"
              >
                Geçme notu
              </label>

              <input
                id="passing-grade"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={passingGrade}
                onChange={(event) =>
                  setPassingGrade(event.target.value)
                }
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
              />
            </section>

            <ResultCard
              label="Toplam ağırlık"
              value={`%${formatNumber(result.totalWeight)}`}
            />

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-semibold text-white">
                Hesaplama örneği
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Vize 70 ve ağırlığı %30 ise dönem notuna katkısı
                21 puandır. Tüm bileşenlerin katkıları toplanarak
                dönem sonu notu hesaplanır.
              </p>
            </section>

            <p className="text-sm leading-6 text-slate-500">
              Bazı üniversitelerde final barajı, çan sistemi veya
              harf notu dönüşümü uygulanabilir. Bu araç ağırlıklı
              sayısal notu hesaplar.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function formatScore(value: number) {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}