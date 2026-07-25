"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/app/components/RelatedTools";
import { trackToolEvent } from "@/lib/analytics";

type Unit = {
  label: string;
  symbol: string;
  factor: number;
};

type ConversionType = "length" | "area" | "volume" | "scale";

const groups: Record<
  Exclude<ConversionType, "scale">,
  { title: string; units: Unit[] }
> = {
  length: {
    title: "Uzunluk",
    units: [
      { label: "Milimetre", symbol: "mm", factor: 0.001 },
      { label: "Santimetre", symbol: "cm", factor: 0.01 },
      { label: "Metre", symbol: "m", factor: 1 },
      { label: "Kilometre", symbol: "km", factor: 1000 },
      { label: "İnç", symbol: "in", factor: 0.0254 },
      { label: "Feet", symbol: "ft", factor: 0.3048 },
    ],
  },
  area: {
    title: "Alan",
    units: [
      { label: "Milimetrekare", symbol: "mm²", factor: 0.000001 },
      { label: "Santimetrekare", symbol: "cm²", factor: 0.0001 },
      { label: "Metrekare", symbol: "m²", factor: 1 },
      { label: "Dekar", symbol: "da", factor: 1000 },
      { label: "Hektar", symbol: "ha", factor: 10000 },
      { label: "Feet kare", symbol: "ft²", factor: 0.09290304 },
    ],
  },
  volume: {
    title: "Hacim",
    units: [
      { label: "Santimetreküp", symbol: "cm³", factor: 0.000001 },
      { label: "Desimetreküp", symbol: "dm³", factor: 0.001 },
      { label: "Metreküp", symbol: "m³", factor: 1 },
      { label: "Mililitre", symbol: "ml", factor: 0.000001 },
      { label: "Litre", symbol: "L", factor: 0.001 },
    ],
  },
};

const scales = [1, 5, 10, 20, 25, 50, 100, 200, 500, 1000, 2000, 5000];

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 8,
  }).format(value);
}

export default function ArchitectureUnitConverterPage() {
  const [type, setType] = useState<ConversionType>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const [scale, setScale] = useState(100);
  const [scaleDirection, setScaleDirection] = useState<"realToDrawing" | "drawingToReal">(
    "realToDrawing"
  );
  const [copyStatus, setCopyStatus] = useState("");

  const numericValue = Number(value.replace(",", "."));

  const result = useMemo(() => {
    if (!Number.isFinite(numericValue)) return null;

    if (type === "scale") {
      return scaleDirection === "realToDrawing"
        ? numericValue / scale
        : numericValue * scale;
    }

    const currentGroup = groups[type];
    const source = currentGroup.units.find((unit) => unit.symbol === from);
    const target = currentGroup.units.find((unit) => unit.symbol === to);
    if (!source || !target) return null;
    return (numericValue * source.factor) / target.factor;
  }, [from, numericValue, scale, scaleDirection, to, type]);

  const currentUnits = type === "scale" ? [] : groups[type].units;
  const fromSymbol = type === "scale" ? "cm" : from;
  const toSymbol = type === "scale" ? "cm" : to;

  function changeType(nextType: ConversionType) {
    setType(nextType);
    setCopyStatus("");
    if (nextType === "length") {
      setFrom("m");
      setTo("cm");
    } else if (nextType === "area") {
      setFrom("m²");
      setTo("cm²");
    } else if (nextType === "volume") {
      setFrom("m³");
      setTo("L");
    }
  }

  function swapUnits() {
    if (type === "scale") {
      setScaleDirection((current) =>
        current === "realToDrawing" ? "drawingToReal" : "realToDrawing"
      );
      return;
    }
    setFrom(to);
    setTo(from);
  }

  async function copyResult() {
    if (result === null) return;
    const text =
      type === "scale"
        ? `${formatNumber(numericValue)} cm ${
            scaleDirection === "realToDrawing" ? "gerçek ölçü" : "çizim ölçüsü"
          }, 1/${scale} ölçekte ${formatNumber(result)} cm ${
            scaleDirection === "realToDrawing" ? "çizim ölçüsüdür" : "gerçek ölçüdür"
          }.`
        : `${formatNumber(numericValue)} ${fromSymbol} = ${formatNumber(
            result
          )} ${toSymbol}`;

    await navigator.clipboard.writeText(text);
    setCopyStatus("Sonuç kopyalandı.");
    trackToolEvent("architecture_unit_converter", "result_copied", {
      conversion_type: type,
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-400">
          Hesap Araçları
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Mimarlık Birim Dönüştürücü
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Uzunluk, alan ve hacim birimlerini dönüştürün; gerçek ölçü ile pafta
          üzerindeki çizim ölçüsü arasında hesap yapın.
        </p>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-8">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                ["length", "Uzunluk"],
                ["area", "Alan"],
                ["volume", "Hacim"],
                ["scale", "Pafta ölçeği"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => changeType(key)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  type === key
                    ? "bg-cyan-400 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {type === "scale" && (
            <div className="mt-6">
              <label className="mb-2 block text-sm text-slate-300">Ölçek</label>
              <select
                value={scale}
                onChange={(event) => setScale(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
              >
                {scales.map((item) => (
                  <option key={item} value={item}>
                    1/{item}
                  </option>
                ))}
              </select>
              <p className="mt-3 text-sm text-slate-400">
                {scaleDirection === "realToDrawing"
                  ? "Gerçek ölçüden çizim ölçüsüne"
                  : "Çizim ölçüsünden gerçek ölçüye"}
              </p>
            </div>
          )}

          <div className="mt-6 grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                {type === "scale"
                  ? scaleDirection === "realToDrawing"
                    ? "Gerçek ölçü (cm)"
                    : "Çizim ölçüsü (cm)"
                  : "Dönüştürülecek değer"}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-lg outline-none focus:border-cyan-400"
              />
              {type !== "scale" && (
                <select
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
                >
                  {currentUnits.map((unit) => (
                    <option key={unit.symbol} value={unit.symbol}>
                      {unit.label} ({unit.symbol})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="button"
              onClick={swapUnits}
              aria-label="Dönüşüm yönünü değiştir"
              className="h-12 rounded-xl border border-cyan-400/40 px-5 text-xl text-cyan-300 hover:bg-cyan-400/10"
            >
              ⇄
            </button>

            <div>
              <p className="mb-2 text-sm text-slate-300">
                {type === "scale"
                  ? scaleDirection === "realToDrawing"
                    ? "Çizim ölçüsü (cm)"
                    : "Gerçek ölçü (cm)"
                  : "Sonuç"}
              </p>
              <div className="min-h-12 rounded-xl bg-cyan-400 px-4 py-3 text-lg font-bold text-slate-950">
                {result === null ? "—" : formatNumber(result)}
              </div>
              {type !== "scale" && (
                <select
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
                >
                  {currentUnits.map((unit) => (
                    <option key={unit.symbol} value={unit.symbol}>
                      {unit.label} ({unit.symbol})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={copyResult}
            disabled={result === null}
            className="mt-6 w-full rounded-xl border border-cyan-400/40 px-4 py-3 font-semibold text-cyan-300 hover:bg-cyan-400/10 disabled:opacity-40"
          >
            Sonucu kopyala
          </button>
          {copyStatus && (
            <p className="mt-3 text-center text-sm text-emerald-300">{copyStatus}</p>
          )}
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["1 m", "100 cm · 1.000 mm"],
            ["1 m²", "10.000 cm²"],
            ["1 m³", "1.000 litre"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <strong className="text-cyan-300">{title}</strong>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </section>

        <RelatedTools
          currentHref="/tools/architecture-unit-converter"
          kind="calculation"
        />
      </div>
    </main>
  );
}
