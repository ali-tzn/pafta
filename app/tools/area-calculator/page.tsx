"use client";

import { useMemo, useState } from "react";

type Unit = "m" | "cm" | "mm";

const unitToMeter: Record<Unit, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
};

export default function AreaCalculatorPage() {
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");
  const [unit, setUnit] = useState<Unit>("m");

  const result = useMemo(() => {
    const lengthValue = Number(length);
    const widthValue = Number(width);

    if (
      !Number.isFinite(lengthValue) ||
      !Number.isFinite(widthValue) ||
      lengthValue <= 0 ||
      widthValue <= 0
    ) {
      return null;
    }

    const lengthInMeters = lengthValue * unitToMeter[unit];
    const widthInMeters = widthValue * unitToMeter[unit];

    const areaSquareMeters = lengthInMeters * widthInMeters;
    const perimeterMeters = 2 * (lengthInMeters + widthInMeters);

    return {
      areaSquareMeters,
      areaSquareCentimeters: areaSquareMeters * 10_000,
      areaSquareMillimeters: areaSquareMeters * 1_000_000,
      perimeterMeters,
    };
  }, [length, width, unit]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Alan Hesaplayıcı
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Dikdörtgen veya kare bir alanın metrekare değerini, çevresini ve
            farklı birimlerdeki karşılığını hesapla.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div>
              <label
                htmlFor="length"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Uzunluk
              </label>

              <input
                id="length"
                type="number"
                min="0"
                step="any"
                value={length}
                onChange={(event) => setLength(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg outline-none transition focus:border-cyan-400"
                placeholder="Örneğin 5"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="width"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Genişlik
              </label>

              <input
                id="width"
                type="number"
                min="0"
                step="any"
                value={width}
                onChange={(event) => setWidth(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg outline-none transition focus:border-cyan-400"
                placeholder="Örneğin 4"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="unit"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Ölçü birimi
              </label>

              <select
                id="unit"
                value={unit}
                onChange={(event) => setUnit(event.target.value as Unit)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg outline-none transition focus:border-cyan-400"
              >
                <option value="m">Metre</option>
                <option value="cm">Santimetre</option>
                <option value="mm">Milimetre</option>
              </select>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Kullanılan formül</p>
              <p className="mt-1 text-lg font-semibold">
                Alan = Uzunluk × Genişlik
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Çevre = 2 × (Uzunluk + Genişlik)
              </p>
            </div>
          </section>

          <section>
            {!result ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                <h2 className="text-2xl font-semibold">
                  Geçerli ölçüler gir
                </h2>
                <p className="mt-3 text-slate-400">
                  Uzunluk ve genişlik sıfırdan büyük olmalıdır.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Hesap sonucu
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <ResultCard
                      label="Alan"
                      value={`${formatNumber(result.areaSquareMeters)} m²`}
                    />

                    <ResultCard
                      label="Çevre"
                      value={`${formatNumber(result.perimeterMeters)} m`}
                    />

                    <ResultCard
                      label="Santimetrekare"
                      value={`${formatNumber(
                        result.areaSquareCentimeters
                      )} cm²`}
                    />

                    <ResultCard
                      label="Milimetrekare"
                      value={`${formatNumber(
                        result.areaSquareMillimeters
                      )} mm²`}
                    />
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">
                  <h2 className="text-2xl font-semibold">
                    Örnek kullanım
                  </h2>

                  <p className="mt-3 leading-7 text-slate-400">
                    5 metre uzunluğunda ve 4 metre genişliğinde bir mekânın
                    alanı 20 m², çevresi ise 18 metredir.
                  </p>
                </div>
              </>
            )}
          </section>
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
    <div className="rounded-2xl bg-slate-950 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 break-words text-2xl font-bold">{value}</p>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 4,
  }).format(value);
}
