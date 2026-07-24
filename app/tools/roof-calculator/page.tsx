"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RoofType = "gable" | "mono";
type SlopeMode = "percent" | "degree";

const roofTypeLabels: Record<RoofType, string> = {
  gable: "Çift eğimli çatı",
  mono: "Tek eğimli çatı",
};

export default function RoofCalculatorPage() {
  const [roofType, setRoofType] = useState<RoofType>("gable");
  const [slopeMode, setSlopeMode] =
    useState<SlopeMode>("percent");

  const [buildingWidth, setBuildingWidth] = useState("10");
  const [buildingLength, setBuildingLength] = useState("12");

  const [sideOverhang, setSideOverhang] = useState("0.5");
  const [frontOverhang, setFrontOverhang] = useState("0.5");

  const [slopePercent, setSlopePercent] = useState("30");
  const [slopeDegree, setSlopeDegree] = useState("16.7");

  const [wastePercent, setWastePercent] = useState("10");

  const result = useMemo(() => {
    const width = Number(buildingWidth);
    const length = Number(buildingLength);
    const side = Number(sideOverhang);
    const front = Number(frontOverhang);
    const waste = Number(wastePercent);

    if (
      !Number.isFinite(width) ||
      width <= 0 ||
      !Number.isFinite(length) ||
      length <= 0 ||
      !Number.isFinite(side) ||
      side < 0 ||
      !Number.isFinite(front) ||
      front < 0 ||
      !Number.isFinite(waste) ||
      waste < 0
    ) {
      return null;
    }

    let slopeRatio = 0;
    let calculatedSlopePercent = 0;
    let calculatedSlopeDegree = 0;

    if (slopeMode === "percent") {
      const percent = Number(slopePercent);

      if (!Number.isFinite(percent) || percent < 0) {
        return null;
      }

      slopeRatio = percent / 100;
      calculatedSlopePercent = percent;
      calculatedSlopeDegree =
        Math.atan(slopeRatio) * (180 / Math.PI);
    } else {
      const degree = Number(slopeDegree);

      if (
        !Number.isFinite(degree) ||
        degree < 0 ||
        degree >= 90
      ) {
        return null;
      }

      slopeRatio = Math.tan(
        degree * (Math.PI / 180)
      );

      calculatedSlopeDegree = degree;
      calculatedSlopePercent = slopeRatio * 100;
    }

    const totalWidth = width + side * 2;
    const totalLength = length + front * 2;

    const horizontalRun =
      roofType === "gable"
        ? totalWidth / 2
        : totalWidth;

    const ridgeHeight = horizontalRun * slopeRatio;

    const rafterLength = Math.sqrt(
      horizontalRun ** 2 + ridgeHeight ** 2
    );

    const roofSurfaceCount =
      roofType === "gable" ? 2 : 1;

    const netRoofArea =
      rafterLength *
      totalLength *
      roofSurfaceCount;

    const wasteArea =
      netRoofArea * (waste / 100);

    const totalRoofArea = netRoofArea + wasteArea;

    const footprintArea = totalWidth * totalLength;

    return {
      width,
      length,
      totalWidth,
      totalLength,
      horizontalRun,
      ridgeHeight,
      rafterLength,
      netRoofArea,
      wasteArea,
      totalRoofArea,
      footprintArea,
      slopePercent: calculatedSlopePercent,
      slopeDegree: calculatedSlopeDegree,
      ratio:
        calculatedSlopePercent > 0
          ? 100 / calculatedSlopePercent
          : null,
    };
  }, [
    roofType,
    slopeMode,
    buildingWidth,
    buildingLength,
    sideOverhang,
    frontOverhang,
    slopePercent,
    slopeDegree,
    wastePercent,
  ]);

  function resetValues() {
    setRoofType("gable");
    setSlopeMode("percent");
    setBuildingWidth("10");
    setBuildingLength("12");
    setSideOverhang("0.5");
    setFrontOverhang("0.5");
    setSlopePercent("30");
    setSlopeDegree("16.7");
    setWastePercent("10");
  }

  function changeSlopeMode(newMode: SlopeMode) {
    if (newMode === slopeMode) {
      return;
    }

    if (newMode === "degree") {
      const percent = Number(slopePercent);

      if (Number.isFinite(percent) && percent >= 0) {
        const degree =
          Math.atan(percent / 100) *
          (180 / Math.PI);

        setSlopeDegree(
          degree.toFixed(2)
        );
      }
    } else {
      const degree = Number(slopeDegree);

      if (
        Number.isFinite(degree) &&
        degree >= 0 &&
        degree < 90
      ) {
        const percent =
          Math.tan(
            degree * (Math.PI / 180)
          ) * 100;

        setSlopePercent(
          percent.toFixed(2)
        );
      }
    }

    setSlopeMode(newMode);
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
            Çatı Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Çatı Eğimi ve Mahya Yüksekliği Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Bina ölçülerini ve çatı eğimini girerek mahya
            yüksekliğini, mertek uzunluğunu ve yaklaşık çatı
            kaplama alanını hesapla.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Çatı tipi
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {(
                  Object.entries(
                    roofTypeLabels
                  ) as [RoofType, string][]
                ).map(([value, label]) => {
                  const isSelected =
                    roofType === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setRoofType(value)
                      }
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
                        {label}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {value === "gable"
                          ? "Mahya ortada kabul edilir ve çatı iki yüzeyden oluşur."
                          : "Çatı, yapının bir kenarından diğer kenarına tek yönde yükselir."}
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
                    Bina ölçüleri
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Tüm uzunlukları metre cinsinden gir.
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
                <InputField
                  id="building-width"
                  label="Bina genişliği (m)"
                  value={buildingWidth}
                  onChange={setBuildingWidth}
                />

                <InputField
                  id="building-length"
                  label="Bina uzunluğu (m)"
                  value={buildingLength}
                  onChange={setBuildingLength}
                />

                <InputField
                  id="side-overhang"
                  label="Yan saçak payı (m)"
                  value={sideOverhang}
                  onChange={setSideOverhang}
                />

                <InputField
                  id="front-overhang"
                  label="Ön ve arka saçak payı (m)"
                  value={frontOverhang}
                  onChange={setFrontOverhang}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Saçak payları
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Girilen saçak değeri yapının iki tarafına da
                  eklenir. Örneğin 0,5 metre yan saçak, toplam çatı
                  genişliğini 1 metre artırır.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Çatı eğimi
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    changeSlopeMode("percent")
                  }
                  className={`rounded-xl border px-5 py-3 font-semibold transition ${
                    slopeMode === "percent"
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  Yüzde olarak gir
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeSlopeMode("degree")
                  }
                  className={`rounded-xl border px-5 py-3 font-semibold transition ${
                    slopeMode === "degree"
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  Derece olarak gir
                </button>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {slopeMode === "percent" ? (
                  <InputField
                    id="slope-percent"
                    label="Çatı eğimi (%)"
                    value={slopePercent}
                    onChange={setSlopePercent}
                  />
                ) : (
                  <InputField
                    id="slope-degree"
                    label="Çatı eğimi (°)"
                    value={slopeDegree}
                    onChange={setSlopeDegree}
                    max="89.99"
                  />
                )}

                <InputField
                  id="waste-percent"
                  label="Kaplama fire payı (%)"
                  value={wastePercent}
                  onChange={setWastePercent}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Kullanılan temel formül
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Mahya yüksekliği = Yatay çalışma mesafesi ×
                  eğim oranı
                </p>
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
                  Bina ölçüleri sıfırdan büyük, saçak ve fire
                  değerleri sıfır veya daha büyük olmalıdır.
                </p>
              </section>
            ) : (
              <>
                <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Mahya yüksekliği
                  </p>

                  <p className="mt-5 text-4xl font-bold sm:text-5xl">
                    {formatNumber(
                      result.ridgeHeight
                    )}{" "}
                    m
                  </p>

                  <p className="mt-2 text-slate-300">
                    Saçak seviyesinden itibaren
                  </p>
                </section>

                <ResultCard
                  label="Çatı tipi"
                  value={
                    roofTypeLabels[roofType]
                  }
                />

                <ResultCard
                  label="Eğim"
                  value={`%${formatNumber(
                    result.slopePercent
                  )}`}
                  secondaryValue={`${formatNumber(
                    result.slopeDegree
                  )}°`}
                />

                <ResultCard
                  label="Eğim oranı"
                  value={
                    result.ratio === null
                      ? "Düz çatı"
                      : `1:${formatNumber(
                          result.ratio
                        )}`
                  }
                />

                <ResultCard
                  label="Yatay çalışma mesafesi"
                  value={`${formatNumber(
                    result.horizontalRun
                  )} m`}
                />

                <ResultCard
                  label="Mertek uzunluğu"
                  value={`${formatNumber(
                    result.rafterLength
                  )} m`}
                />

                <ResultCard
                  label="Saçak dahil çatı ölçüsü"
                  value={`${formatNumber(
                    result.totalWidth
                  )} × ${formatNumber(
                    result.totalLength
                  )} m`}
                />

                <ResultCard
                  label="Yatay izdüşüm alanı"
                  value={`${formatNumber(
                    result.footprintArea
                  )} m²`}
                />

                <ResultCard
                  label="Net eğimli çatı alanı"
                  value={`${formatNumber(
                    result.netRoofArea
                  )} m²`}
                />

                <ResultCard
                  label="Fire alanı"
                  value={`${formatNumber(
                    result.wasteArea
                  )} m²`}
                />

                <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-7">
                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
                    Kaplama sipariş alanı
                  </p>

                  <p className="mt-5 text-4xl font-bold">
                    {formatNumber(
                      result.totalRoofArea
                    )}{" "}
                    m²
                  </p>

                  <p className="mt-2 text-slate-300">
                    Fire payı dahil yaklaşık alan
                  </p>
                </section>

                <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
                  <p className="font-semibold text-amber-300">
                    Ön hesap uyarısı
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Mahya, dere, baca, çatı penceresi, parapet,
                    kırma yüzeyler ve farklı kotlar bu hesapta yer
                    almaz.
                  </p>
                </section>

                <p className="text-sm leading-6 text-slate-500">
                  Bu araç geometrik ön hesap yapar. Taşıyıcı sistem,
                  kaplama bindirmeleri, yağış koşulları ve uygulama
                  detayları ayrıca değerlendirilmelidir.
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
  max,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  max?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm text-slate-400"
      >
        {label}
      </label>

      <input
        id={id}
        type="number"
        min="0"
        max={max}
        step="0.01"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
      />
    </div>
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
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      {secondaryValue && (
        <p className="mt-2 text-sm text-slate-500">
          {secondaryValue}
        </p>
      )}
    </section>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}