"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CalculationMode = "dimensions" | "area";

export default function TileCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("dimensions");

  const [surfaceLength, setSurfaceLength] = useState("5");
  const [surfaceWidth, setSurfaceWidth] = useState("4");
  const [surfaceArea, setSurfaceArea] = useState("20");

  const [tileLength, setTileLength] = useState("60");
  const [tileWidth, setTileWidth] = useState("60");
  const [jointWidth, setJointWidth] = useState("3");

  const [wastePercent, setWastePercent] = useState("10");
  const [tilesPerBox, setTilesPerBox] = useState("4");
  const [boxPrice, setBoxPrice] = useState("");

  const result = useMemo(() => {
    const tileLengthCm = Number(tileLength);
    const tileWidthCm = Number(tileWidth);
    const jointWidthMm = Number(jointWidth);
    const waste = Number(wastePercent);
    const boxQuantity = Number(tilesPerBox);
    const price = Number(boxPrice);

    if (
      !Number.isFinite(tileLengthCm) ||
      tileLengthCm <= 0 ||
      !Number.isFinite(tileWidthCm) ||
      tileWidthCm <= 0 ||
      !Number.isFinite(jointWidthMm) ||
      jointWidthMm < 0 ||
      !Number.isFinite(waste) ||
      waste < 0 ||
      !Number.isFinite(boxQuantity) ||
      boxQuantity <= 0
    ) {
      return null;
    }

    let calculatedSurfaceArea = 0;

    if (mode === "dimensions") {
      const length = Number(surfaceLength);
      const width = Number(surfaceWidth);

      if (
        !Number.isFinite(length) ||
        length <= 0 ||
        !Number.isFinite(width) ||
        width <= 0
      ) {
        return null;
      }

      calculatedSurfaceArea = length * width;
    } else {
      const area = Number(surfaceArea);

      if (!Number.isFinite(area) || area <= 0) {
        return null;
      }

      calculatedSurfaceArea = area;
    }

    const tileLengthM = tileLengthCm / 100;
    const tileWidthM = tileWidthCm / 100;
    const jointWidthM = jointWidthMm / 1000;

    const tileArea = tileLengthM * tileWidthM;

    const moduleLength = tileLengthM + jointWidthM;
    const moduleWidth = tileWidthM + jointWidthM;
    const moduleArea = moduleLength * moduleWidth;

    const theoreticalTileCount =
      calculatedSurfaceArea / moduleArea;

    const tileCountWithoutWaste = Math.ceil(theoreticalTileCount);

    const wasteTileCount = Math.ceil(
      tileCountWithoutWaste * (waste / 100)
    );

    const totalTileCount =
      tileCountWithoutWaste + wasteTileCount;

    const boxCount = Math.ceil(totalTileCount / boxQuantity);
    const purchasedTileCount = boxCount * boxQuantity;

    const purchasedTileArea = purchasedTileCount * tileArea;
    const extraTileCount = purchasedTileCount - tileCountWithoutWaste;

    const boxArea = boxQuantity * tileArea;

    const totalCost =
      Number.isFinite(price) && price >= 0
        ? boxCount * price
        : null;

    return {
      surfaceArea: calculatedSurfaceArea,
      tileArea,
      moduleArea,
      tileCountWithoutWaste,
      wasteTileCount,
      totalTileCount,
      boxCount,
      tilesPerBox: boxQuantity,
      boxArea,
      purchasedTileCount,
      purchasedTileArea,
      extraTileCount,
      totalCost,
    };
  }, [
    mode,
    surfaceLength,
    surfaceWidth,
    surfaceArea,
    tileLength,
    tileWidth,
    jointWidth,
    wastePercent,
    tilesPerBox,
    boxPrice,
  ]);

  function resetValues() {
    setMode("dimensions");
    setSurfaceLength("5");
    setSurfaceWidth("4");
    setSurfaceArea("20");
    setTileLength("60");
    setTileWidth("60");
    setJointWidth("3");
    setWastePercent("10");
    setTilesPerBox("4");
    setBoxPrice("");
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
            Seramik ve Karo Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Seramik ve Karo Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Döşenecek alanı, karo ölçüsünü, derz kalınlığını ve
            fire oranını girerek gerekli karo ve kutu sayısını
            hesapla.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Alan giriş yöntemi
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("dimensions")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    mode === "dimensions"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-950 hover:border-slate-500"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      mode === "dimensions"
                        ? "text-cyan-300"
                        : "text-white"
                    }`}
                  >
                    Ölçülerden hesapla
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Alanın uzunluk ve genişliğini girerek toplam
                    yüzeyi hesaplar.
                  </p>
                </button>

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
                    Alanı doğrudan gir
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Önceden hesaplanan metrekare değerini doğrudan
                    kullanır.
                  </p>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Döşenecek alan
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Alan ölçülerini metre cinsinden gir.
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
                {mode === "dimensions" ? (
                  <>
                    <InputField
                      id="surface-length"
                      label="Alan uzunluğu (m)"
                      value={surfaceLength}
                      onChange={setSurfaceLength}
                      step="0.01"
                    />

                    <InputField
                      id="surface-width"
                      label="Alan genişliği (m)"
                      value={surfaceWidth}
                      onChange={setSurfaceWidth}
                      step="0.01"
                    />
                  </>
                ) : (
                  <InputField
                    id="surface-area"
                    label="Toplam alan (m²)"
                    value={surfaceArea}
                    onChange={setSurfaceArea}
                    step="0.01"
                  />
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Karo özellikleri
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InputField
                  id="tile-length"
                  label="Karo uzunluğu (cm)"
                  value={tileLength}
                  onChange={setTileLength}
                  step="0.1"
                />

                <InputField
                  id="tile-width"
                  label="Karo genişliği (cm)"
                  value={tileWidth}
                  onChange={setTileWidth}
                  step="0.1"
                />

                <InputField
                  id="joint-width"
                  label="Derz kalınlığı (mm)"
                  value={jointWidth}
                  onChange={setJointWidth}
                  step="0.1"
                />

                <InputField
                  id="waste-percent"
                  label="Fire payı (%)"
                  value={wastePercent}
                  onChange={setWastePercent}
                  step="0.1"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Fire payı neden eklenir?
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Kesim, kırılma, desen yönü ve ileride yapılabilecek
                  onarımlar için hesaplanan miktara ek ürün ayrılır.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Kutu ve maliyet bilgileri
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InputField
                  id="tiles-per-box"
                  label="Bir kutudaki karo adedi"
                  value={tilesPerBox}
                  onChange={setTilesPerBox}
                  step="1"
                />

                <InputField
                  id="box-price"
                  label="Bir kutunun fiyatı (₺, isteğe bağlı)"
                  value={boxPrice}
                  onChange={setBoxPrice}
                  step="0.01"
                  allowEmpty
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Kutu bilgisini kontrol et
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Bazı üreticiler kutu içeriğini adet yerine metrekare
                  olarak belirtir. Bu durumda kutudaki adet sayısını
                  ürün etiketinden kontrol et.
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
                  Alan, karo ölçüleri ve kutu adedi sıfırdan büyük
                  olmalıdır.
                </p>
              </section>
            ) : (
              <>
                <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Gerekli kutu sayısı
                  </p>

                  <p className="mt-5 text-4xl font-bold sm:text-5xl">
                    {result.boxCount} kutu
                  </p>

                  <p className="mt-2 text-slate-300">
                    Fire payı ve tam kutuya yuvarlama dahil
                  </p>
                </section>

                <ResultCard
                  label="Döşenecek alan"
                  value={`${formatNumber(result.surfaceArea)} m²`}
                />

                <ResultCard
                  label="Bir karonun net alanı"
                  value={`${formatNumber(result.tileArea)} m²`}
                />

                <ResultCard
                  label="Fire öncesi gereken karo"
                  value={`${result.tileCountWithoutWaste} adet`}
                />

                <ResultCard
                  label="Fire için eklenen karo"
                  value={`${result.wasteTileCount} adet`}
                />

                <ResultCard
                  label="Hesaplanan toplam karo"
                  value={`${result.totalTileCount} adet`}
                />

                <ResultCard
                  label="Satın alınacak toplam karo"
                  value={`${result.purchasedTileCount} adet`}
                />

                <ResultCard
                  label="Satın alınan karo alanı"
                  value={`${formatNumber(
                    result.purchasedTileArea
                  )} m²`}
                />

                <ResultCard
                  label="Bir kutunun net alanı"
                  value={`${formatNumber(result.boxArea)} m²`}
                />

                <ResultCard
                  label="Kesim ve yedek dahil fazla karo"
                  value={`${result.extraTileCount} adet`}
                />

                {result.totalCost !== null && (
                  <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-7">
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
                      Yaklaşık ürün maliyeti
                    </p>

                    <p className="mt-5 text-4xl font-bold">
                      {formatCurrency(result.totalCost)}
                    </p>

                    <p className="mt-2 text-slate-300">
                      Yalnızca karo kutularının toplamı
                    </p>
                  </section>
                )}

                <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
                  <p className="font-semibold text-amber-300">
                    Uygulama uyarısı
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Çapraz döşeme, karmaşık yüzeyler, çok sayıda
                    köşe ve desen eşleştirme gereken uygulamalarda
                    daha yüksek fire payı gerekebilir.
                  </p>
                </section>

                <p className="text-sm leading-6 text-slate-500">
                  Bu araç yaklaşık malzeme hesabı yapar. Kutu üzerindeki
                  gerçek kaplama alanı ve üretici bilgileri satın alma
                  öncesinde kontrol edilmelidir.
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
  step,
  allowEmpty = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  step: string;
  allowEmpty?: boolean;
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
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={!allowEmpty}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
      />
    </div>
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

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  });
}