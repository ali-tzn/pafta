"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CalculationMode = "length" | "slope";

export default function RampCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("length");
  const [heightDifference, setHeightDifference] = useState("60");
  const [slopePercent, setSlopePercent] = useState("8");
  const [rampLength, setRampLength] = useState("750");

  const result = useMemo(() => {
    const height = Number(heightDifference);
    const slope = Number(slopePercent);
    const length = Number(rampLength);

    if (!Number.isFinite(height) || height <= 0) {
      return null;
    }

    if (mode === "length") {
      if (!Number.isFinite(slope) || slope <= 0) {
        return null;
      }

      const calculatedLength = height / (slope / 100);
      const ratio = calculatedLength / height;
      const angle = Math.atan(height / calculatedLength) * (180 / Math.PI);

      return {
        height,
        slope,
        length: calculatedLength,
        ratio,
        angle,
      };
    }

    if (!Number.isFinite(length) || length <= 0) {
      return null;
    }

    const calculatedSlope = (height / length) * 100;
    const ratio = length / height;
    const angle = Math.atan(height / length) * (180 / Math.PI);

    return {
      height,
      slope: calculatedSlope,
      length,
      ratio,
      angle,
    };
  }, [mode, heightDifference, slopePercent, rampLength]);

  const assessment = result
    ? getSlopeAssessment(result.slope)
    : null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <Link href="/tools" className="transition hover:text-cyan-400">
            Hesap Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Rampa Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Rampa Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Kot farkı ve eğim oranına göre gerekli rampa uzunluğunu
            hesapla veya mevcut rampa uzunluğundan gerçek eğimi bul.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="mb-3 text-sm font-medium text-slate-300">
              Hesaplama yöntemi
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("length")}
                className={`rounded-xl border px-5 py-3 font-semibold transition ${
                  mode === "length"
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                Uzunluk hesapla
              </button>

              <button
                type="button"
                onClick={() => setMode("slope")}
                className={`rounded-xl border px-5 py-3 font-semibold transition ${
                  mode === "slope"
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                Eğim hesapla
              </button>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="height-difference"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Kot farkı (cm)
                </label>

                <input
                  id="height-difference"
                  type="number"
                  min="0"
                  step="0.1"
                  value={heightDifference}
                  onChange={(event) =>
                    setHeightDifference(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
              </div>

              {mode === "length" ? (
                <div>
                  <label
                    htmlFor="slope-percent"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Hedef eğim (%)
                  </label>

                  <input
                    id="slope-percent"
                    type="number"
                    min="0"
                    step="0.1"
                    value={slopePercent}
                    onChange={(event) =>
                      setSlopePercent(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="ramp-length"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Rampa uzunluğu (cm)
                  </label>

                  <input
                    id="ramp-length"
                    type="number"
                    min="0"
                    step="0.1"
                    value={rampLength}
                    onChange={(event) =>
                      setRampLength(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm font-semibold text-white">
                Kullanılan formül
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Eğim yüzdesi = Kot farkı ÷ Yatay uzunluk × 100
              </p>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            {!result ? (
              <section className="rounded-3xl border border-red-400/30 bg-red-400/10 p-7">
                <p className="font-semibold text-red-300">
                  Geçerli değerler gir
                </p>
              </section>
            ) : (
              <>
                <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Hesap sonucu
                  </p>

                  <p className="mt-5 text-5xl font-bold">
                    {mode === "length"
                      ? `${formatNumber(result.length / 100)} m`
                      : `%${formatNumber(result.slope)}`}
                  </p>

                  <p className="mt-2 text-slate-300">
                    {mode === "length"
                      ? "Gerekli yatay rampa uzunluğu"
                      : "Mevcut rampa eğimi"}
                  </p>
                </section>

                <ResultCard
                  label="Kot farkı"
                  value={`${formatNumber(result.height)} cm`}
                />

                <ResultCard
                  label="Rampa uzunluğu"
                  value={`${formatNumber(result.length / 100)} m`}
                />

                <ResultCard
                  label="Eğim"
                  value={`%${formatNumber(result.slope)}`}
                />

                <ResultCard
                  label="Oran"
                  value={`1:${formatNumber(result.ratio)}`}
                />

                <ResultCard
                  label="Açı"
                  value={`${formatNumber(result.angle)}°`}
                />

                {assessment && (
                  <section
                    className={`rounded-3xl border p-6 ${
                      assessment.level === "good"
                        ? "border-emerald-400/30 bg-emerald-400/10"
                        : assessment.level === "warning"
                          ? "border-amber-400/30 bg-amber-400/10"
                          : "border-red-400/30 bg-red-400/10"
                    }`}
                  >
                    <p className="font-semibold">
                      {assessment.title}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {assessment.description}
                    </p>
                  </section>
                )}

                <p className="text-sm leading-6 text-slate-500">
                  Bu araç ön hesap içindir. Erişilebilirlik, sahanlık,
                  korkuluk, genişlik ve mevzuat koşulları ayrıca
                  kontrol edilmelidir.
                </p>
              </>
            )}
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
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </section>
  );
}

function getSlopeAssessment(slope: number) {
  if (slope <= 6) {
    return {
      level: "good",
      title: "Düşük eğim",
      description:
        "Eğim görece düşük görünüyor. Yine de kullanım amacı ve mevzuat ayrıca kontrol edilmelidir.",
    };
  }

  if (slope <= 8) {
    return {
      level: "warning",
      title: "Kontrol edilmesi gereken eğim",
      description:
        "Bu eğim bazı kullanım senaryolarında uygun olabilir; rampa uzunluğu ve ilgili mevzuat birlikte değerlendirilmelidir.",
    };
  }

  return {
    level: "danger",
    title: "Yüksek eğim",
    description:
      "Rampa oldukça dik görünüyor. Daha uzun bir rampa veya farklı bir çözüm değerlendirilmelidir.",
  };
}

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}