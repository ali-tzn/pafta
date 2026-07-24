"use client";

import { useMemo, useState } from "react";

type PaperKey = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "custom";
type Orientation = "landscape" | "portrait";

type PaperSize = {
  width: number;
  height: number;
};

const paperSizes: Record<Exclude<PaperKey, "custom">, PaperSize> = {
  A0: { width: 841, height: 1189 },
  A1: { width: 594, height: 841 },
  A2: { width: 420, height: 594 },
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
};

const commonScales = [20, 25, 50, 100, 200, 500, 1000, 2000];

function orientedSize(size: PaperSize, orientation: Orientation) {
  const longEdge = Math.max(size.width, size.height);
  const shortEdge = Math.min(size.width, size.height);

  return orientation === "landscape"
    ? { width: longEdge, height: shortEdge }
    : { width: shortEdge, height: longEdge };
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits,
  }).format(value);
}

function nearestScale(value: number) {
  return commonScales.reduce((nearest, scale) =>
    Math.abs(scale - value) < Math.abs(nearest - value) ? scale : nearest
  );
}

export default function SheetScaleConverter() {
  const [sourcePaper, setSourcePaper] = useState<PaperKey>("A1");
  const [targetPaper, setTargetPaper] = useState<PaperKey>("A3");
  const [sourceOrientation, setSourceOrientation] =
    useState<Orientation>("landscape");
  const [targetOrientation, setTargetOrientation] =
    useState<Orientation>("landscape");
  const [scale, setScale] = useState("100");
  const [sourceCustomWidth, setSourceCustomWidth] = useState("841");
  const [sourceCustomHeight, setSourceCustomHeight] = useState("594");
  const [targetCustomWidth, setTargetCustomWidth] = useState("420");
  const [targetCustomHeight, setTargetCustomHeight] = useState("297");

  const result = useMemo(() => {
    const scaleValue = Number(scale);

    const sourceBase =
      sourcePaper === "custom"
        ? {
            width: Number(sourceCustomWidth),
            height: Number(sourceCustomHeight),
          }
        : paperSizes[sourcePaper];

    const targetBase =
      targetPaper === "custom"
        ? {
            width: Number(targetCustomWidth),
            height: Number(targetCustomHeight),
          }
        : paperSizes[targetPaper];

    if (
      !Number.isFinite(scaleValue) ||
      scaleValue <= 0 ||
      !Number.isFinite(sourceBase.width) ||
      !Number.isFinite(sourceBase.height) ||
      !Number.isFinite(targetBase.width) ||
      !Number.isFinite(targetBase.height) ||
      sourceBase.width <= 0 ||
      sourceBase.height <= 0 ||
      targetBase.width <= 0 ||
      targetBase.height <= 0
    ) {
      return null;
    }

    const source =
      sourcePaper === "custom"
        ? sourceBase
        : orientedSize(sourceBase, sourceOrientation);
    const target =
      targetPaper === "custom"
        ? targetBase
        : orientedSize(targetBase, targetOrientation);

    const widthFactor = target.width / source.width;
    const heightFactor = target.height / source.height;
    const fitFactor = Math.min(widthFactor, heightFactor);
    const resultingScale = scaleValue / fitFactor;
    const fittedWidth = source.width * fitFactor;
    const fittedHeight = source.height * fitFactor;

    return {
      source,
      target,
      fitFactor,
      printPercentage: fitFactor * 100,
      resultingScale,
      nearestStandardScale: nearestScale(resultingScale),
      fittedWidth,
      fittedHeight,
      horizontalMargin: Math.max(0, (target.width - fittedWidth) / 2),
      verticalMargin: Math.max(0, (target.height - fittedHeight) / 2),
      preservesExactScale: Math.abs(fitFactor - 1) < 0.0001,
    };
  }, [
    scale,
    sourceCustomHeight,
    sourceCustomWidth,
    sourceOrientation,
    sourcePaper,
    targetCustomHeight,
    targetCustomWidth,
    targetOrientation,
    targetPaper,
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Baskı Araçları
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Pafta Boyutu ve Ölçek Dönüştürücü
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Bir paftayı farklı kâğıt boyutuna “sayfaya sığdır” yöntemiyle
            basarken kullanılacak yüzdeyi ve çizimin oluşacak yeni ölçeğini
            hesapla.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <PaperFields
              title="Kaynak pafta"
              paper={sourcePaper}
              setPaper={setSourcePaper}
              orientation={sourceOrientation}
              setOrientation={setSourceOrientation}
              customWidth={sourceCustomWidth}
              setCustomWidth={setSourceCustomWidth}
              customHeight={sourceCustomHeight}
              setCustomHeight={setSourceCustomHeight}
            />

            <div className="my-7 border-t border-slate-800" />

            <PaperFields
              title="Hedef pafta"
              paper={targetPaper}
              setPaper={setTargetPaper}
              orientation={targetOrientation}
              setOrientation={setTargetOrientation}
              customWidth={targetCustomWidth}
              setCustomWidth={setTargetCustomWidth}
              customHeight={targetCustomHeight}
              setCustomHeight={setTargetCustomHeight}
            />

            <div className="mt-7">
              <label
                htmlFor="drawing-scale"
                className="mb-2 block font-medium text-slate-200"
              >
                Kaynak çizim ölçeği
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                <span className="px-4 text-slate-400">1 /</span>
                <input
                  id="drawing-scale"
                  type="number"
                  min="1"
                  step="any"
                  value={scale}
                  onChange={(event) => setScale(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 text-lg outline-none"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            {!result ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">
                <h2 className="text-2xl font-semibold">Geçerli ölçüler gir</h2>
                <p className="mt-3 text-slate-400">
                  Kâğıt ölçüleri ve ölçek sıfırdan büyük olmalıdır.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6 sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Sayfaya sığdırma sonucu
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <ResultCard
                      label="Baskı yüzdesi"
                      value={`%${formatNumber(result.printPercentage, 1)}`}
                    />
                    <ResultCard
                      label="Oluşacak ölçek"
                      value={`1 / ${formatNumber(result.resultingScale, 1)}`}
                    />
                    <ResultCard
                      label="Yerleşen pafta"
                      value={`${formatNumber(result.fittedWidth, 1)} × ${formatNumber(
                        result.fittedHeight,
                        1
                      )} mm`}
                    />
                    <ResultCard
                      label="En yakın standart ölçek"
                      value={`1 / ${result.nearestStandardScale}`}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                  <h2 className="text-2xl font-semibold">Baskı özeti</h2>
                  <p className="mt-4 leading-7 text-slate-300">
                    {formatNumber(result.source.width, 0)} ×{" "}
                    {formatNumber(result.source.height, 0)} mm pafta,{" "}
                    {formatNumber(result.target.width, 0)} ×{" "}
                    {formatNumber(result.target.height, 0)} mm sayfaya
                    sığdırıldığında çizim{" "}
                    <strong className="text-white">
                      %{formatNumber(result.printPercentage, 1)}
                    </strong>{" "}
                    boyutunda basılır. Kaynak ölçek 1/{formatNumber(Number(scale))}
                    ise sonuç yaklaşık{" "}
                    <strong className="text-white">
                      1/{formatNumber(result.resultingScale, 1)}
                    </strong>{" "}
                    olur.
                  </p>

                  {(result.horizontalMargin > 0.1 ||
                    result.verticalMargin > 0.1) && (
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      Ortalandığında her kenarda yaklaşık{" "}
                      {formatNumber(result.horizontalMargin, 1)} mm yatay ve{" "}
                      {formatNumber(result.verticalMargin, 1)} mm dikey boşluk
                      kalır. Yazıcının basılamayan kenar payı bu değeri
                      değiştirebilir.
                    </p>
                  )}
                </div>

                <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
                  <h2 className="text-xl font-semibold text-amber-200">
                    Ölçeği aynen korumak istiyorsan
                  </h2>
                  <p className="mt-3 leading-7 text-slate-300">
                    Baskıyı %100 yapmalısın. Hedef kâğıt kaynak paftadan küçükse
                    tüm pafta aynı anda sığmaz ve bazı bölümler kırpılır. Tüm
                    içeriği hedef sayfaya sığdırmak ölçeği{" "}
                    {result.preservesExactScale ? "değiştirmez." : "değiştirir."}
                  </p>
                </div>
              </>
            )}
          </section>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Nasıl hesaplanır?</h2>
          <div className="mt-4 space-y-3 leading-7 text-slate-300">
            <p>
              Araç, hedef genişliğin kaynak genişliğe ve hedef yüksekliğin
              kaynak yüksekliğe oranlarından küçük olanını kullanır. Böylece
              paftanın hiçbir kenarı hedef sayfanın dışına taşmaz.
            </p>
            <p>
              Yeni ölçek paydası, mevcut ölçek paydasının küçültme veya büyütme
              katsayısına bölünmesiyle bulunur. Örneğin A1’den A3’e yaklaşık
              %50 baskıda 1/100 çizim yaklaşık 1/200 olur.
            </p>
            <p className="text-sm text-slate-400">
              Son baskıda yazıcı kenar boşlukları, PDF görüntüleyicisinin
              “gerçek boyut” ayarı ve özel pafta kırpma alanları küçük
              farklılıklar oluşturabilir. Hassas ölçü gereken çıktıyı cetvelle
              kontrol et.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PaperFields({
  title,
  paper,
  setPaper,
  orientation,
  setOrientation,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight,
}: {
  title: string;
  paper: PaperKey;
  setPaper: (paper: PaperKey) => void;
  orientation: Orientation;
  setOrientation: (orientation: Orientation) => void;
  customWidth: string;
  setCustomWidth: (value: string) => void;
  customHeight: string;
  setCustomHeight: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xl font-semibold">{title}</legend>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Kâğıt boyutu
          </label>
          <select
            value={paper}
            onChange={(event) => setPaper(event.target.value as PaperKey)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
          >
            {(["A0", "A1", "A2", "A3", "A4", "A5"] as PaperKey[]).map(
              (paperName) => (
                <option key={paperName} value={paperName}>
                  {paperName}
                </option>
              )
            )}
            <option value="custom">Özel ölçü</option>
          </select>
        </div>

        {paper !== "custom" && (
          <div>
            <label className="mb-2 block text-sm text-slate-300">Yön</label>
            <select
              value={orientation}
              onChange={(event) =>
                setOrientation(event.target.value as Orientation)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
            >
              <option value="landscape">Yatay</option>
              <option value="portrait">Dikey</option>
            </select>
          </div>
        )}
      </div>

      {paper === "custom" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Genişlik (mm)"
            value={customWidth}
            setValue={setCustomWidth}
          />
          <NumberField
            label="Yükseklik (mm)"
            value={customHeight}
            setValue={setCustomHeight}
          />
        </div>
      )}
    </fieldset>
  );
}

function NumberField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        type="number"
        min="1"
        step="any"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
      />
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/60 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
