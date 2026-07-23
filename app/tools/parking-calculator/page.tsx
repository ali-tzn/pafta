"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ParkingMode = "area" | "count";

export default function ParkingCalculatorPage() {
  const [mode, setMode] = useState<ParkingMode>("area");

  const [totalArea, setTotalArea] = useState("2500");
  const [areaPerVehicle, setAreaPerVehicle] = useState("25");
  const [efficiencyPercent, setEfficiencyPercent] = useState("85");

  const [vehicleCount, setVehicleCount] = useState("100");

  const [disabledPercent, setDisabledPercent] = useState("5");
  const [electricPercent, setElectricPercent] = useState("10");
  const [visitorPercent, setVisitorPercent] = useState("10");

  const result = useMemo(() => {
    const unitArea = Number(areaPerVehicle);
    const efficiency = Number(efficiencyPercent);

    if (
      !Number.isFinite(unitArea) ||
      unitArea <= 0 ||
      !Number.isFinite(efficiency) ||
      efficiency <= 0 ||
      efficiency > 100
    ) {
      return null;
    }

    let calculatedVehicleCount = 0;
    let calculatedTotalArea = 0;
    let usableArea = 0;

    if (mode === "area") {
      const area = Number(totalArea);

      if (!Number.isFinite(area) || area <= 0) {
        return null;
      }

      usableArea = area * (efficiency / 100);
      calculatedVehicleCount = Math.floor(usableArea / unitArea);
      calculatedTotalArea = area;
    } else {
      const count = Number(vehicleCount);

      if (!Number.isFinite(count) || count <= 0) {
        return null;
      }

      calculatedVehicleCount = Math.floor(count);
      usableArea = calculatedVehicleCount * unitArea;
      calculatedTotalArea = usableArea / (efficiency / 100);
    }

    const disabledRate = normalizePercent(disabledPercent);
    const electricRate = normalizePercent(electricPercent);
    const visitorRate = normalizePercent(visitorPercent);

    const disabledCount = Math.ceil(
      calculatedVehicleCount * (disabledRate / 100)
    );

    const electricCount = Math.ceil(
      calculatedVehicleCount * (electricRate / 100)
    );

    const visitorCount = Math.ceil(
      calculatedVehicleCount * (visitorRate / 100)
    );

    const standardCount = Math.max(
      0,
      calculatedVehicleCount -
        disabledCount -
        electricCount -
        visitorCount
    );

    const overflow =
      disabledCount + electricCount + visitorCount >
      calculatedVehicleCount;

    return {
      vehicleCount: calculatedVehicleCount,
      totalArea: calculatedTotalArea,
      usableArea,
      circulationArea: Math.max(
        0,
        calculatedTotalArea - usableArea
      ),
      standardCount,
      disabledCount,
      electricCount,
      visitorCount,
      overflow,
    };
  }, [
    mode,
    totalArea,
    areaPerVehicle,
    efficiencyPercent,
    vehicleCount,
    disabledPercent,
    electricPercent,
    visitorPercent,
  ]);

  function resetValues() {
    setTotalArea("2500");
    setAreaPerVehicle("25");
    setEfficiencyPercent("85");
    setVehicleCount("100");
    setDisabledPercent("5");
    setElectricPercent("10");
    setVisitorPercent("10");
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
            href="/tools"
            className="transition hover:text-cyan-400"
          >
            Hesap Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Otopark Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Otopark Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Mevcut alana kaç araç sığabileceğini veya hedef araç
            sayısı için yaklaşık ne kadar otopark alanı gerektiğini
            hesapla.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Hesaplama yöntemi
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("area")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    mode === "area"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-950 hover:border-slate-500"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      mode === "area"
                        ? "text-cyan-300"
                        : "text-white"
                    }`}
                  >
                    Alandan araç sayısı
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Mevcut toplam otopark alanından yaklaşık araç
                    kapasitesini hesaplar.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("count")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    mode === "count"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-950 hover:border-slate-500"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      mode === "count"
                        ? "text-cyan-300"
                        : "text-white"
                    }`}
                  >
                    Araç sayısından alan
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Hedef araç kapasitesi için yaklaşık toplam
                    otopark alanını hesaplar.
                  </p>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Temel bilgiler
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Alan değerlerini metrekare olarak gir.
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
                {mode === "area" ? (
                  <div>
                    <label
                      htmlFor="total-area"
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Toplam otopark alanı (m²)
                    </label>

                    <input
                      id="total-area"
                      type="number"
                      min="0"
                      step="0.1"
                      value={totalArea}
                      onChange={(event) =>
                        setTotalArea(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="vehicle-count"
                      className="mb-2 block text-sm text-slate-400"
                    >
                      Hedef araç sayısı
                    </label>

                    <input
                      id="vehicle-count"
                      type="number"
                      min="1"
                      step="1"
                      value={vehicleCount}
                      onChange={(event) =>
                        setVehicleCount(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="area-per-vehicle"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Araç başına alan (m²)
                  </label>

                  <input
                    id="area-per-vehicle"
                    type="number"
                    min="1"
                    step="0.1"
                    value={areaPerVehicle}
                    onChange={(event) =>
                      setAreaPerVehicle(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="efficiency"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Alan kullanım verimi (%)
                  </label>

                  <input
                    id="efficiency"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={efficiencyPercent}
                    onChange={(event) =>
                      setEfficiencyPercent(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Araç başına alan neyi kapsar?
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Park yeri, manevra alanı ve araç başına düşen
                  dolaşım payının yaklaşık toplamını ifade eder.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Otopark dağılımı
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Toplam kapasite içerisindeki özel kullanım oranlarını
                belirle.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="disabled-percent"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Erişilebilir park (%)
                  </label>

                  <input
                    id="disabled-percent"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={disabledPercent}
                    onChange={(event) =>
                      setDisabledPercent(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="electric-percent"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Elektrikli araç (%)
                  </label>

                  <input
                    id="electric-percent"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={electricPercent}
                    onChange={(event) =>
                      setElectricPercent(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="visitor-percent"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Ziyaretçi parkı (%)
                  </label>

                  <input
                    id="visitor-percent"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={visitorPercent}
                    onChange={(event) =>
                      setVisitorPercent(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Kullanılan temel hesap
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Araç sayısı = Kullanılabilir alan ÷ Araç başına alan
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
                  Alan, araç sayısı, verim ve araç başına alan
                  değerlerini kontrol et.
                </p>
              </section>
            ) : (
              <>
                <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Hesap sonucu
                  </p>

                  <p className="mt-5 text-5xl font-bold">
                    {mode === "area"
                      ? `${result.vehicleCount} araç`
                      : `${formatNumber(result.totalArea)} m²`}
                  </p>

                  <p className="mt-2 text-slate-300">
                    {mode === "area"
                      ? "Yaklaşık otopark kapasitesi"
                      : "Gerekli yaklaşık toplam alan"}
                  </p>
                </section>

                <ResultCard
                  label="Toplam alan"
                  value={`${formatNumber(result.totalArea)} m²`}
                />

                <ResultCard
                  label="Kullanılabilir park alanı"
                  value={`${formatNumber(result.usableArea)} m²`}
                />

                <ResultCard
                  label="Dolaşım ve kayıp alanı"
                  value={`${formatNumber(
                    result.circulationArea
                  )} m²`}
                />

                <ResultCard
                  label="Toplam araç kapasitesi"
                  value={`${result.vehicleCount} araç`}
                />

                <ResultCard
                  label="Standart park"
                  value={`${result.standardCount} araç`}
                />

                <ResultCard
                  label="Erişilebilir park"
                  value={`${result.disabledCount} araç`}
                />

                <ResultCard
                  label="Elektrikli araç parkı"
                  value={`${result.electricCount} araç`}
                />

                <ResultCard
                  label="Ziyaretçi parkı"
                  value={`${result.visitorCount} araç`}
                />

                {result.overflow && (
                  <section className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
                    <p className="font-semibold text-red-300">
                      Dağılım oranlarını kontrol et
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Özel park türlerinin toplamı, hesaplanan araç
                      kapasitesini aşıyor.
                    </p>
                  </section>
                )}

                <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
                  <p className="font-semibold text-amber-300">
                    Ön hesap uyarısı
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Kolon yerleri, rampa, dönüş yarıçapları, yangın
                    kaçışı, peyzaj alanları ve gerçek otopark
                    geometrisi kapasiteyi azaltabilir.
                  </p>
                </section>

                <p className="text-sm leading-6 text-slate-500">
                  Bu araç yaklaşık alan ve kapasite hesabı yapar.
                  Projede güncel otopark yönetmeliği ve yerel idare
                  koşulları ayrıca kontrol edilmelidir.
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

function normalizePercent(value: string) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, parsedValue));
}

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}