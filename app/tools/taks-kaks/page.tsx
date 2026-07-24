"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CalculationResult = {
  parcelArea: number;
  usableParcelArea: number;
  taks: number;
  kaks: number;
  floorCount: number | null;
  maximumFootprint: number;
  totalEquivalentArea: number;
  approximateFloorArea: number | null;
  footprintRatio: number;
  openArea: number;
  estimatedBuildingHeight: number | null;
};

type ResultCardProps = {
  title: string;
  value: string;
  description: string;
  unit?: string;
  accent?: "cyan" | "emerald" | "amber" | "violet";
};

const exampleValues = {
  parcelArea: "1000",
  usableParcelArea: "",
  taks: "0,30",
  kaks: "1,50",
  floorCount: "5",
  floorHeight: "3,20",
};

export default function TaksKaksPage() {
  const [parcelArea, setParcelArea] = useState("");
  const [usableParcelArea, setUsableParcelArea] =
    useState("");
  const [taks, setTaks] = useState("");
  const [kaks, setKaks] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [floorHeight, setFloorHeight] = useState("3,20");

  const parsedParcelArea = parsePositiveNumber(parcelArea);
  const parsedUsableParcelArea =
    parsePositiveNumber(usableParcelArea);
  const parsedTaks = parsePositiveNumber(taks);
  const parsedKaks = parsePositiveNumber(kaks);
  const parsedFloorCount = parsePositiveInteger(floorCount);
  const parsedFloorHeight =
    parsePositiveNumber(floorHeight);

  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (parcelArea.trim() && parsedParcelArea === null) {
      messages.push(
        "Parsel alanı sıfırdan büyük bir sayı olmalıdır."
      );
    }

    if (
      usableParcelArea.trim() &&
      parsedUsableParcelArea === null
    ) {
      messages.push(
        "Kullanılabilir parsel alanı sıfırdan büyük bir sayı olmalıdır."
      );
    }

    if (
      parsedParcelArea !== null &&
      parsedUsableParcelArea !== null &&
      parsedUsableParcelArea > parsedParcelArea
    ) {
      messages.push(
        "Kullanılabilir parsel alanı toplam parsel alanından büyük olamaz."
      );
    }

    if (taks.trim() && parsedTaks === null) {
      messages.push(
        "TAKS değeri sıfırdan büyük bir sayı olmalıdır."
      );
    }

    if (
      parsedTaks !== null &&
      parsedTaks > 1
    ) {
      messages.push(
        "TAKS değeri genellikle 0 ile 1 arasındadır. Girdiğin değeri kontrol et."
      );
    }

    if (kaks.trim() && parsedKaks === null) {
      messages.push(
        "KAKS/Emsal değeri sıfırdan büyük bir sayı olmalıdır."
      );
    }

    if (
      floorCount.trim() &&
      parsedFloorCount === null
    ) {
      messages.push(
        "Kat adedi sıfırdan büyük bir tam sayı olmalıdır."
      );
    }

    if (
      floorHeight.trim() &&
      parsedFloorHeight === null
    ) {
      messages.push(
        "Kat yüksekliği sıfırdan büyük bir sayı olmalıdır."
      );
    }

    return messages;
  }, [
    parcelArea,
    usableParcelArea,
    taks,
    kaks,
    floorCount,
    floorHeight,
    parsedParcelArea,
    parsedUsableParcelArea,
    parsedTaks,
    parsedKaks,
    parsedFloorCount,
    parsedFloorHeight,
  ]);

  const result = useMemo<CalculationResult | null>(() => {
    if (
      parsedParcelArea === null ||
      parsedTaks === null ||
      parsedKaks === null ||
      validationMessages.length > 0
    ) {
      return null;
    }

    const effectiveParcelArea =
      parsedUsableParcelArea ?? parsedParcelArea;

    const maximumFootprint =
      effectiveParcelArea * parsedTaks;

    const totalEquivalentArea =
      parsedParcelArea * parsedKaks;

    const approximateFloorArea =
      parsedFloorCount !== null
        ? totalEquivalentArea / parsedFloorCount
        : null;

    const footprintRatio =
      parsedParcelArea > 0
        ? (maximumFootprint / parsedParcelArea) * 100
        : 0;

    const openArea = Math.max(
      0,
      parsedParcelArea - maximumFootprint
    );

    const estimatedBuildingHeight =
      parsedFloorCount !== null &&
      parsedFloorHeight !== null
        ? parsedFloorCount * parsedFloorHeight
        : null;

    return {
      parcelArea: parsedParcelArea,
      usableParcelArea: effectiveParcelArea,
      taks: parsedTaks,
      kaks: parsedKaks,
      floorCount: parsedFloorCount,
      maximumFootprint,
      totalEquivalentArea,
      approximateFloorArea,
      footprintRatio,
      openArea,
      estimatedBuildingHeight,
    };
  }, [
    parsedParcelArea,
    parsedUsableParcelArea,
    parsedTaks,
    parsedKaks,
    parsedFloorCount,
    parsedFloorHeight,
    validationMessages,
  ]);

  function fillExample() {
    setParcelArea(exampleValues.parcelArea);
    setUsableParcelArea(exampleValues.usableParcelArea);
    setTaks(exampleValues.taks);
    setKaks(exampleValues.kaks);
    setFloorCount(exampleValues.floorCount);
    setFloorHeight(exampleValues.floorHeight);
  }

  function clearForm() {
    setParcelArea("");
    setUsableParcelArea("");
    setTaks("");
    setKaks("");
    setFloorCount("");
    setFloorHeight("3,20");
  }

  const calculationReady =
    parsedParcelArea !== null &&
    parsedTaks !== null &&
    parsedKaks !== null &&
    validationMessages.length === 0;

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
            Araçlar
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            TAKS–KAKS Hesaplama
          </span>
        </nav>

        <section className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            TAKS–KAKS ve Emsal Hesaplama
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Parsel alanı, TAKS ve KAKS değerlerini
            girerek maksimum taban oturumunu ve
            toplam emsale esas inşaat alanını
            hesapla.
          </p>
        </section>

        <div className="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-2xl font-semibold">
                    İmar verileri
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    İmar durumunda belirtilen değerleri
                    aşağıdaki alanlara gir.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={fillExample}
                    className="rounded-xl border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                  >
                    Örnek doldur
                  </button>

                  <button
                    type="button"
                    onClick={clearForm}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
                  >
                    Temizle
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <CalculationInput
                  id="parcel-area"
                  label="Parsel alanı"
                  value={parcelArea}
                  placeholder="Örneğin: 1000"
                  suffix="m²"
                  required
                  description="Tapuda veya imar durumunda belirtilen toplam parsel alanı."
                  onChange={setParcelArea}
                />

                <CalculationInput
                  id="usable-parcel-area"
                  label="Kullanılabilir parsel alanı"
                  value={usableParcelArea}
                  placeholder="Boş bırakılabilir"
                  suffix="m²"
                  description="Çekme mesafeleri veya kısıtlar sonrası kullanılabilen alan. Boş bırakılırsa toplam parsel alanı kullanılır."
                  onChange={setUsableParcelArea}
                />

                <CalculationInput
                  id="taks"
                  label="TAKS"
                  value={taks}
                  placeholder="Örneğin: 0,30"
                  suffix=""
                  required
                  description="Yapının parsel üzerinde kaplayabileceği azami taban alanı oranı."
                  onChange={setTaks}
                />

                <CalculationInput
                  id="kaks"
                  label="KAKS / Emsal"
                  value={kaks}
                  placeholder="Örneğin: 1,50"
                  suffix=""
                  required
                  description="Parsel üzerinde yapılabilecek toplam emsale esas alanın parsel alanına oranı."
                  onChange={setKaks}
                />

                <CalculationInput
                  id="floor-count"
                  label="Kat adedi"
                  value={floorCount}
                  placeholder="Örneğin: 5"
                  suffix="kat"
                  description="Kat başına yaklaşık alan hesabı için isteğe bağlıdır."
                  onChange={setFloorCount}
                  inputMode="numeric"
                />

                <CalculationInput
                  id="floor-height"
                  label="Ortalama kat yüksekliği"
                  value={floorHeight}
                  placeholder="Örneğin: 3,20"
                  suffix="m"
                  description="Yaklaşık toplam yapı yüksekliğini görmek için kullanılır."
                  onChange={setFloorHeight}
                />
              </div>

              {validationMessages.length > 0 && (
                <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/10 p-5">
                  <p className="font-semibold text-red-300">
                    Girdi kontrolü
                  </p>

                  <div className="mt-3 space-y-2">
                    {validationMessages.map(
                      (validationMessage) => (
                        <p
                          key={validationMessage}
                          className="text-sm leading-6 text-red-200"
                        >
                          {validationMessage}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                Hesaplama formülleri
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <FormulaCard
                  title="Maksimum taban oturumu"
                  formula="Kullanılabilir parsel alanı × TAKS"
                  example="1.000 m² × 0,30 = 300 m²"
                />

                <FormulaCard
                  title="Toplam emsale esas alan"
                  formula="Parsel alanı × KAKS"
                  example="1.000 m² × 1,50 = 1.500 m²"
                />

                <FormulaCard
                  title="Yaklaşık kat başına alan"
                  formula="Toplam emsal alanı ÷ kat adedi"
                  example="1.500 m² ÷ 5 = 300 m²"
                />

                <FormulaCard
                  title="Yaklaşık yapı yüksekliği"
                  formula="Kat adedi × ortalama kat yüksekliği"
                  example="5 × 3,20 m = 16,00 m"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-amber-300">
                Önemli açıklama
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Bu araç matematiksel bir ön hesaplama
                yapar. Çıkan değerler tek başına yapılaşma
                hakkını kesin olarak göstermez. Plan
                notları, çekme mesafeleri, yükseklik
                sınırları, kullanım kararları, emsal dışı
                alanlar, terkler, kotlandırma ve ilgili
                belediye uygulamaları sonucu değiştirebilir.
              </p>
            </div>
          </section>

          <aside className="self-start xl:sticky xl:top-24">
            <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Hesaplama sonucu
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Değerleri değiştirdiğinde sonuçlar
                    anında güncellenir.
                  </p>
                </div>

                <div
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                    calculationReady
                      ? "bg-emerald-400"
                      : "bg-slate-600"
                  }`}
                />
              </div>

              {result ? (
                <>
                  <div className="mt-7 space-y-4">
                    <ResultCard
                      title="Maksimum taban oturumu"
                      value={formatNumber(
                        result.maximumFootprint
                      )}
                      unit="m²"
                      description="Yapının zeminde kaplayabileceği yaklaşık en büyük alan."
                      accent="cyan"
                    />

                    <ResultCard
                      title="Toplam emsale esas alan"
                      value={formatNumber(
                        result.totalEquivalentArea
                      )}
                      unit="m²"
                      description="KAKS değerine göre hesaplanan toplam emsale esas inşaat alanı."
                      accent="emerald"
                    />

                    {result.approximateFloorArea !==
                      null && (
                      <ResultCard
                        title="Yaklaşık kat başına alan"
                        value={formatNumber(
                          result.approximateFloorArea
                        )}
                        unit="m²"
                        description={`${result.floorCount} kata eşit dağıtım kabulüyle hesaplanmıştır.`}
                        accent="violet"
                      />
                    )}

                    <ResultCard
                      title="Yaklaşık açık alan"
                      value={formatNumber(
                        result.openArea
                      )}
                      unit="m²"
                      description="Parsel alanından maksimum taban oturumu çıkarılarak bulunur."
                      accent="amber"
                    />

                    {result.estimatedBuildingHeight !==
                      null && (
                      <ResultCard
                        title="Yaklaşık yapı yüksekliği"
                        value={formatNumber(
                          result.estimatedBuildingHeight
                        )}
                        unit="m"
                        description="Kat adedi ile ortalama kat yüksekliği çarpılarak hesaplanmıştır."
                        accent="cyan"
                      />
                    )}
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <p className="text-sm font-semibold text-white">
                      Hesap özeti
                    </p>

                    <div className="mt-4 space-y-3 text-sm">
                      <SummaryRow
                        label="Parsel alanı"
                        value={`${formatNumber(
                          result.parcelArea
                        )} m²`}
                      />

                      <SummaryRow
                        label="Hesapta kullanılan alan"
                        value={`${formatNumber(
                          result.usableParcelArea
                        )} m²`}
                      />

                      <SummaryRow
                        label="TAKS"
                        value={formatDecimal(
                          result.taks
                        )}
                      />

                      <SummaryRow
                        label="KAKS / Emsal"
                        value={formatDecimal(
                          result.kaks
                        )}
                      />

                      <SummaryRow
                        label="Taban kullanım oranı"
                        value={`%${formatNumber(
                          result.footprintRatio
                        )}`}
                      />
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                    <p className="text-sm font-semibold text-emerald-300">
                      Kısa yorum
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Bu verilere göre yapının taban
                      oturumu yaklaşık{" "}
                      <strong className="text-white">
                        {formatNumber(
                          result.maximumFootprint
                        )}{" "}
                        m²
                      </strong>
                      , toplam emsale esas alanı ise
                      yaklaşık{" "}
                      <strong className="text-white">
                        {formatNumber(
                          result.totalEquivalentArea
                        )}{" "}
                        m²
                      </strong>{" "}
                      olabilir.
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-xl font-bold text-cyan-300">
                    m²
                  </div>

                  <p className="mt-5 font-semibold text-white">
                    Sonuç bekleniyor
                  </p>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                    Parsel alanı, TAKS ve KAKS
                    değerlerini girerek hesaplamayı
                    başlat.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CalculationInput({
  id,
  label,
  value,
  placeholder,
  suffix,
  description,
  required = false,
  inputMode = "decimal",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  suffix: string;
  description: string;
  required?: boolean;
  inputMode?: "decimal" | "numeric";
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
      >
        {label}

        {required && (
          <span className="text-cyan-400">
            *
          </span>
        )}
      </label>

      <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-950 transition focus-within:border-cyan-400">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              sanitizeNumberInput(
                event.target.value,
                inputMode === "numeric"
              )
            )
          }
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-600"
        />

        {suffix && (
          <span className="flex min-w-14 items-center justify-center border-l border-slate-700 px-3 text-sm font-semibold text-slate-400">
            {suffix}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ResultCard({
  title,
  value,
  description,
  unit,
  accent = "cyan",
}: ResultCardProps) {
  const accentClasses = {
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    emerald:
      "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    amber:
      "border-amber-400/25 bg-amber-400/10 text-amber-300",
    violet:
      "border-violet-400/25 bg-violet-400/10 text-violet-300",
  };

  return (
    <div
      className={`rounded-2xl border p-5 ${accentClasses[accent]}`}
    >
      <p className="text-sm font-semibold">
        {title}
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <span className="text-3xl font-bold text-white">
          {value}
        </span>

        {unit && (
          <span className="pb-1 text-sm font-semibold text-slate-300">
            {unit}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function FormulaCard({
  title,
  formula,
  example,
}: {
  title: string;
  formula: string;
  example: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <p className="font-semibold text-white">
        {title}
      </p>

      <p className="mt-3 text-sm font-medium text-cyan-300">
        {formula}
      </p>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        Örnek: {example}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-400">
        {label}
      </span>

      <span className="text-right font-semibold text-slate-200">
        {value}
      </span>
    </div>
  );
}

function parsePositiveNumber(
  value: string
): number | null {
  const normalizedValue = value
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".");

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue <= 0
  ) {
    return null;
  }

  return parsedValue;
}

function parsePositiveInteger(
  value: string
): number | null {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return null;
  }

  return parsedValue;
}

function sanitizeNumberInput(
  value: string,
  integerOnly = false
) {
  if (integerOnly) {
    return value.replace(/[^\d]/g, "");
  }

  const cleanedValue = value.replace(
    /[^\d.,]/g,
    ""
  );

  let separatorUsed = false;
  let output = "";

  for (const character of cleanedValue) {
    if (
      character === "," ||
      character === "."
    ) {
      if (separatorUsed) {
        continue;
      }

      separatorUsed = true;
      output += character;
      continue;
    }

    output += character;
  }

  return output;
}

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatDecimal(value: number) {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}