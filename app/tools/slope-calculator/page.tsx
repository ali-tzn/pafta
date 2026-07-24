"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CalculationMode = "slope" | "run" | "rise";

const modeOptions: {
  value: CalculationMode;
  title: string;
  description: string;
}[] = [
  {
    value: "slope",
    title: "Eğim hesapla",
    description: "Kot farkı ve yatay mesafeden eğimi bul.",
  },
  {
    value: "run",
    title: "Yatay mesafe hesapla",
    description: "Kot farkı ve eğimden gerekli mesafeyi bul.",
  },
  {
    value: "rise",
    title: "Kot farkı hesapla",
    description: "Yatay mesafe ve eğimden kot farkını bul.",
  },
];

export default function SlopeCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("slope");
  const [rise, setRise] = useState("60");
  const [run, setRun] = useState("750");
  const [slopePercent, setSlopePercent] = useState("8");

  const result = useMemo(() => {
    const riseValue = Number(rise);
    const runValue = Number(run);
    const slopeValue = Number(slopePercent);

    if (mode === "slope") {
      if (
        !Number.isFinite(riseValue) ||
        riseValue < 0 ||
        !Number.isFinite(runValue) ||
        runValue <= 0
      ) {
        return null;
      }

      const calculatedSlope = (riseValue / runValue) * 100;
      const angle =
        Math.atan(riseValue / runValue) * (180 / Math.PI);
      const ratio =
        riseValue > 0 ? runValue / riseValue : null;
      const diagonal = Math.sqrt(
        riseValue ** 2 + runValue ** 2
      );

      return {
        rise: riseValue,
        run: runValue,
        slope: calculatedSlope,
        angle,
        ratio,
        diagonal,
      };
    }

    if (mode === "run") {
      if (
        !Number.isFinite(riseValue) ||
        riseValue < 0 ||
        !Number.isFinite(slopeValue) ||
        slopeValue <= 0
      ) {
        return null;
      }

      const calculatedRun =
        riseValue / (slopeValue / 100);
      const angle =
        Math.atan(slopeValue / 100) * (180 / Math.PI);
      const ratio =
        slopeValue > 0 ? 100 / slopeValue : null;
      const diagonal = Math.sqrt(
        riseValue ** 2 + calculatedRun ** 2
      );

      return {
        rise: riseValue,
        run: calculatedRun,
        slope: slopeValue,
        angle,
        ratio,
        diagonal,
      };
    }

    if (
      !Number.isFinite(runValue) ||
      runValue <= 0 ||
      !Number.isFinite(slopeValue) ||
      slopeValue < 0
    ) {
      return null;
    }

    const calculatedRise =
      runValue * (slopeValue / 100);
    const angle =
      Math.atan(slopeValue / 100) * (180 / Math.PI);
    const ratio =
      slopeValue > 0 ? 100 / slopeValue : null;
    const diagonal = Math.sqrt(
      calculatedRise ** 2 + runValue ** 2
    );

    return {
      rise: calculatedRise,
      run: runValue,
      slope: slopeValue,
      angle,
      ratio,
      diagonal,
    };
  }, [mode, rise, run, slopePercent]);

  const assessment = result
    ? getSlopeAssessment(result.slope)
    : null;

  function resetValues() {
    setRise("60");
    setRun("750");
    setSlopePercent("8");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
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
            href="/tools"
            className="transition hover:text-cyan-400"
          >
            Hesap Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Eğim Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Eğim Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Kot farkı, yatay mesafe ve eğim değerlerinden
            eksik olan ölçüyü hesapla. Sonucu yüzde, derece
            ve oran olarak görüntüle.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Hesaplama yöntemi
              </h2>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {modeOptions.map((option) => {
                  const isSelected = mode === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMode(option.value)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <p
                        className={`font-semibold ${
                          isSelected
                            ? "text-cyan-300"
                            : "text-white"
                        }`}
                      >
                        {option.title}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Ölçüler
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Uzunluk değerlerini santimetre olarak gir.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetValues}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Değerleri sıfırla
                </button>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {mode !== "rise" && (
                  <div>
                    <label
                      htmlFor="rise"
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Kot farkı (cm)
                    </label>

                    <input
                      id="rise"
                      type="number"
                      min="0"
                      step="0.1"
                      value={rise}
                      onChange={(event) =>
                        setRise(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                )}

                {mode !== "run" && (
                  <div>
                    <label
                      htmlFor="run"
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Yatay mesafe (cm)
                    </label>

                    <input
                      id="run"
                      type="number"
                      min="0"
                      step="0.1"
                      value={run}
                      onChange={(event) =>
                        setRun(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                )}

                {mode !== "slope" && (
                  <div>
                    <label
                      htmlFor="slope-percent"
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Eğim (%)
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
                )}
              </div>

              <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Kullanılan temel formül
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Eğim (%) = Kot farkı ÷ Yatay mesafe × 100
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Eğim gösterimleri
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <InfoCard
                  title="Yüzde eğim"
                  description="100 cm yatay mesafede gerçekleşen kot değişimini ifade eder."
                  example="%8 = 100 cm’de 8 cm"
                />

                <InfoCard
                  title="Eğim oranı"
                  description="Bir birim kot farkı için gereken yatay mesafeyi gösterir."
                  example="1:12,5"
                />

                <InfoCard
                  title="Eğim açısı"
                  description="Eğimli yüzey ile yatay düzlem arasındaki açıdır."
                  example="4,57°"
                />
              </div>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            {!result ? (
              <section className="rounded-3xl border border-red-400/30 bg-red-400/10 p-7">
                <p className="font-semibold text-red-300">
                  Geçerli değerler gir
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Hesaplamada kullanılan mesafe ve eğim
                  değerleri geçerli olmalıdır.
                </p>
              </section>
            ) : (
              <>
                <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Hesap sonucu
                  </p>

                  <p className="mt-5 text-4xl font-bold sm:text-5xl">
                    {mode === "slope" &&
                      `%${formatNumber(result.slope)}`}

                    {mode === "run" &&
                      `${formatNumber(result.run / 100)} m`}

                    {mode === "rise" &&
                      `${formatNumber(result.rise)} cm`}
                  </p>

                  <p className="mt-2 text-slate-300">
                    {mode === "slope" && "Hesaplanan eğim"}

                    {mode === "run" &&
                      "Gerekli yatay mesafe"}

                    {mode === "rise" &&
                      "Hesaplanan kot farkı"}
                  </p>
                </section>

                <ResultCard
                  label="Kot farkı"
                  value={`${formatNumber(result.rise)} cm`}
                  secondaryValue={`${formatNumber(
                    result.rise / 100
                  )} m`}
                />

                <ResultCard
                  label="Yatay mesafe"
                  value={`${formatNumber(result.run)} cm`}
                  secondaryValue={`${formatNumber(
                    result.run / 100
                  )} m`}
                />

                <ResultCard
                  label="Eğim yüzdesi"
                  value={`%${formatNumber(result.slope)}`}
                />

                <ResultCard
                  label="Eğim açısı"
                  value={`${formatNumber(result.angle)}°`}
                />

                <ResultCard
                  label="Eğim oranı"
                  value={
                    result.ratio === null
                      ? "Düz yüzey"
                      : `1:${formatNumber(result.ratio)}`
                  }
                />

                <ResultCard
                  label="Eğimli yüzey uzunluğu"
                  value={`${formatNumber(
                    result.diagonal / 100
                  )} m`}
                  secondaryValue={`${formatNumber(
                    result.diagonal
                  )} cm`}
                />

                {assessment && (
                  <section
                    className={`rounded-3xl border p-6 ${
                      assessment.level === "low"
                        ? "border-emerald-400/30 bg-emerald-400/10"
                        : assessment.level === "medium"
                          ? "border-amber-400/30 bg-amber-400/10"
                          : "border-red-400/30 bg-red-400/10"
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        assessment.level === "low"
                          ? "text-emerald-300"
                          : assessment.level === "medium"
                            ? "text-amber-300"
                            : "text-red-300"
                      }`}
                    >
                      {assessment.title}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {assessment.description}
                    </p>
                  </section>
                )}

                <p className="text-sm leading-6 text-slate-500">
                  Bu araç geometrik ön hesap içindir. Çatı,
                  rampa, yol ve arazi uygulamalarında ilgili
                  yönetmelik ve teknik gereklilikler ayrıca
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
  secondaryValue,
}: {
  label: string;
  value: string;
  secondaryValue?: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>

      {secondaryValue && (
        <p className="mt-2 text-sm text-slate-500">
          {secondaryValue}
        </p>
      )}
    </section>
  );
}

function InfoCard({
  title,
  description,
  example,
}: {
  title: string;
  description: string;
  example: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <p className="font-semibold text-white">{title}</p>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <p className="mt-4 text-sm font-semibold text-cyan-300">
        {example}
      </p>
    </div>
  );
}

function getSlopeAssessment(slope: number) {
  if (slope === 0) {
    return {
      level: "low",
      title: "Düz yüzey",
      description:
        "Kot farkı bulunmadığı için hesaplanan yüzey eğimsizdir.",
    };
  }

  if (slope <= 5) {
    return {
      level: "low",
      title: "Düşük eğim",
      description:
        "Yüzey düşük eğimli görünüyor. Kullanım amacı ve drenaj koşulları ayrıca değerlendirilmelidir.",
    };
  }

  if (slope <= 15) {
    return {
      level: "medium",
      title: "Orta eğim",
      description:
        "Yüzey belirgin bir eğime sahiptir. Kullanım türüne göre erişim, kayma ve drenaj koşulları kontrol edilmelidir.",
    };
  }

  return {
    level: "high",
    title: "Yüksek eğim",
    description:
      "Yüzey oldukça dik görünüyor. Güvenlik, erişilebilirlik ve uygulama çözümü dikkatle değerlendirilmelidir.",
  };
}

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}