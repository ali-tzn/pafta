"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Opening = {
  id: number;
  name: string;
  width: string;
  height: string;
  quantity: string;
};

export default function BrickCalculatorPage() {
  const [wallLength, setWallLength] = useState("5");
  const [wallHeight, setWallHeight] = useState("2.8");
  const [wallCount, setWallCount] = useState("1");

  const [brickLength, setBrickLength] = useState("19");
  const [brickHeight, setBrickHeight] = useState("13.5");
  const [jointThickness, setJointThickness] = useState("1");

  const [wastePercent, setWastePercent] = useState("5");
  const [bricksPerPackage, setBricksPerPackage] = useState("100");
  const [brickPrice, setBrickPrice] = useState("");

  const [openings, setOpenings] = useState<Opening[]>([
    {
      id: 1,
      name: "Kapı",
      width: "0.9",
      height: "2.1",
      quantity: "1",
    },
    {
      id: 2,
      name: "Pencere",
      width: "1.5",
      height: "1.4",
      quantity: "1",
    },
  ]);

  const result = useMemo(() => {
    const length = Number(wallLength);
    const height = Number(wallHeight);
    const count = Number(wallCount);

    const brickLengthCm = Number(brickLength);
    const brickHeightCm = Number(brickHeight);
    const jointCm = Number(jointThickness);

    const waste = Number(wastePercent);
    const packageQuantity = Number(bricksPerPackage);
    const unitPrice = Number(brickPrice);

    if (
      !Number.isFinite(length) ||
      length <= 0 ||
      !Number.isFinite(height) ||
      height <= 0 ||
      !Number.isFinite(count) ||
      count <= 0 ||
      !Number.isFinite(brickLengthCm) ||
      brickLengthCm <= 0 ||
      !Number.isFinite(brickHeightCm) ||
      brickHeightCm <= 0 ||
      !Number.isFinite(jointCm) ||
      jointCm < 0 ||
      !Number.isFinite(waste) ||
      waste < 0 ||
      !Number.isFinite(packageQuantity) ||
      packageQuantity <= 0
    ) {
      return null;
    }

    const grossWallArea = length * height * count;

    let openingsArea = 0;

    for (const opening of openings) {
      const openingWidth = Number(opening.width);
      const openingHeight = Number(opening.height);
      const quantity = Number(opening.quantity);

      if (
        Number.isFinite(openingWidth) &&
        openingWidth >= 0 &&
        Number.isFinite(openingHeight) &&
        openingHeight >= 0 &&
        Number.isFinite(quantity) &&
        quantity >= 0
      ) {
        openingsArea += openingWidth * openingHeight * quantity;
      }
    }

    const netWallArea = Math.max(0, grossWallArea - openingsArea);

    const moduleLengthM = (brickLengthCm + jointCm) / 100;
    const moduleHeightM = (brickHeightCm + jointCm) / 100;
    const moduleArea = moduleLengthM * moduleHeightM;

    const theoreticalBrickCount =
      moduleArea > 0 ? netWallArea / moduleArea : 0;

    const brickCountWithoutWaste = Math.ceil(theoreticalBrickCount);

    const wasteBrickCount = Math.ceil(
      brickCountWithoutWaste * (waste / 100)
    );

    const totalBrickCount =
      brickCountWithoutWaste + wasteBrickCount;

    const packageCount = Math.ceil(
      totalBrickCount / packageQuantity
    );

    const purchasedBrickCount =
      packageCount * packageQuantity;

    const extraBrickCount =
      purchasedBrickCount - brickCountWithoutWaste;

    const estimatedMortarVolume =
      netWallArea * 0.02;

    const totalCost =
      Number.isFinite(unitPrice) && unitPrice >= 0
        ? totalBrickCount * unitPrice
        : null;

    return {
      grossWallArea,
      openingsArea,
      netWallArea,
      moduleArea,
      brickCountWithoutWaste,
      wasteBrickCount,
      totalBrickCount,
      packageCount,
      purchasedBrickCount,
      extraBrickCount,
      estimatedMortarVolume,
      totalCost,
      openingsExceedWall: openingsArea > grossWallArea,
    };
  }, [
    wallLength,
    wallHeight,
    wallCount,
    brickLength,
    brickHeight,
    jointThickness,
    wastePercent,
    bricksPerPackage,
    brickPrice,
    openings,
  ]);

  function updateOpening(
    id: number,
    field: keyof Omit<Opening, "id">,
    value: string
  ) {
    setOpenings((currentOpenings) =>
      currentOpenings.map((opening) =>
        opening.id === id
          ? {
              ...opening,
              [field]: value,
            }
          : opening
      )
    );
  }

  function addOpening() {
    setOpenings((currentOpenings) => [
      ...currentOpenings,
      {
        id: Date.now(),
        name: "",
        width: "1",
        height: "1",
        quantity: "1",
      },
    ]);
  }

  function removeOpening(id: number) {
    setOpenings((currentOpenings) =>
      currentOpenings.filter((opening) => opening.id !== id)
    );
  }

  function resetValues() {
    setWallLength("5");
    setWallHeight("2.8");
    setWallCount("1");
    setBrickLength("19");
    setBrickHeight("13.5");
    setJointThickness("1");
    setWastePercent("5");
    setBricksPerPackage("100");
    setBrickPrice("");

    setOpenings([
      {
        id: 1,
        name: "Kapı",
        width: "0.9",
        height: "2.1",
        quantity: "1",
      },
      {
        id: 2,
        name: "Pencere",
        width: "1.5",
        height: "1.4",
        quantity: "1",
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
            href="/tools"
            className="transition hover:text-cyan-400"
          >
            Hesap Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Tuğla Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Tuğla ve Duvar Malzemesi Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Duvar ölçülerini ve tuğla boyutlarını girerek gerekli
            tuğla adedini, fire miktarını ve yaklaşık paket sayısını
            hesapla.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Duvar ölçüleri
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Duvar ölçülerini metre cinsinden gir.
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

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <InputField
                  id="wall-length"
                  label="Duvar uzunluğu (m)"
                  value={wallLength}
                  onChange={setWallLength}
                  step="0.01"
                />

                <InputField
                  id="wall-height"
                  label="Duvar yüksekliği (m)"
                  value={wallHeight}
                  onChange={setWallHeight}
                  step="0.01"
                />

                <InputField
                  id="wall-count"
                  label="Aynı ölçüde duvar sayısı"
                  value={wallCount}
                  onChange={setWallCount}
                  step="1"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Kapı ve pencere boşlukları
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Duvar örülmeyecek alanları hesaplamadan düş.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addOpening}
                  className="rounded-xl border border-cyan-400/40 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  + Boşluk ekle
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {openings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
                    Kapı veya pencere boşluğu eklenmedi.
                  </div>
                ) : (
                  openings.map((opening, index) => (
                    <div
                      key={opening.id}
                      className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:grid-cols-[1fr_110px_110px_100px_auto]"
                    >
                      <div>
                        <label
                          htmlFor={`opening-name-${opening.id}`}
                          className="mb-2 block text-sm text-slate-400"
                        >
                          Boşluk {index + 1}
                        </label>

                        <input
                          id={`opening-name-${opening.id}`}
                          type="text"
                          value={opening.name}
                          onChange={(event) =>
                            updateOpening(
                              opening.id,
                              "name",
                              event.target.value
                            )
                          }
                          placeholder="Kapı veya pencere"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                        />
                      </div>

                      <InputField
                        id={`opening-width-${opening.id}`}
                        label="En (m)"
                        value={opening.width}
                        onChange={(value) =>
                          updateOpening(
                            opening.id,
                            "width",
                            value
                          )
                        }
                        step="0.01"
                        dark
                      />

                      <InputField
                        id={`opening-height-${opening.id}`}
                        label="Boy (m)"
                        value={opening.height}
                        onChange={(value) =>
                          updateOpening(
                            opening.id,
                            "height",
                            value
                          )
                        }
                        step="0.01"
                        dark
                      />

                      <InputField
                        id={`opening-quantity-${opening.id}`}
                        label="Adet"
                        value={opening.quantity}
                        onChange={(value) =>
                          updateOpening(
                            opening.id,
                            "quantity",
                            value
                          )
                        }
                        step="1"
                        dark
                      />

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() =>
                            removeOpening(opening.id)
                          }
                          className="w-full rounded-xl border border-red-400/30 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 md:w-auto"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Tuğla özellikleri
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <InputField
                  id="brick-length"
                  label="Tuğla uzunluğu (cm)"
                  value={brickLength}
                  onChange={setBrickLength}
                  step="0.1"
                />

                <InputField
                  id="brick-height"
                  label="Tuğla yüksekliği (cm)"
                  value={brickHeight}
                  onChange={setBrickHeight}
                  step="0.1"
                />

                <InputField
                  id="joint-thickness"
                  label="Derz kalınlığı (cm)"
                  value={jointThickness}
                  onChange={setJointThickness}
                  step="0.1"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Tuğla ölçüsü nasıl girilmeli?
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Duvar yüzeyinde görünen yatay tuğla uzunluğunu ve
                  düşey tuğla yüksekliğini kullan. Duvar kalınlığı,
                  adet hesabını doğrudan değiştirmez.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Sipariş bilgileri
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <InputField
                  id="waste-percent"
                  label="Fire payı (%)"
                  value={wastePercent}
                  onChange={setWastePercent}
                  step="0.1"
                />

                <InputField
                  id="bricks-per-package"
                  label="Paket veya paletteki adet"
                  value={bricksPerPackage}
                  onChange={setBricksPerPackage}
                  step="1"
                />

                <InputField
                  id="brick-price"
                  label="Bir tuğlanın fiyatı (₺)"
                  value={brickPrice}
                  onChange={setBrickPrice}
                  step="0.01"
                  allowEmpty
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
                  Duvar ve tuğla ölçüleri ile paket adedi sıfırdan
                  büyük olmalıdır.
                </p>
              </section>
            ) : (
              <>
                <section
                  className={`rounded-3xl border p-7 ${
                    result.openingsExceedWall
                      ? "border-red-400/30 bg-red-400/10"
                      : "border-cyan-400/30 bg-cyan-400/10"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold uppercase tracking-wider ${
                      result.openingsExceedWall
                        ? "text-red-300"
                        : "text-cyan-300"
                    }`}
                  >
                    Gerekli tuğla
                  </p>

                  <p className="mt-5 text-5xl font-bold">
                    {result.totalBrickCount} adet
                  </p>

                  <p className="mt-2 text-slate-300">
                    Fire payı dahil yaklaşık miktar
                  </p>

                  {result.openingsExceedWall && (
                    <p className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-red-300">
                      Boşlukların alanı toplam duvar alanından büyük.
                      Ölçüleri kontrol et.
                    </p>
                  )}
                </section>

                <ResultCard
                  label="Brüt duvar alanı"
                  value={`${formatNumber(
                    result.grossWallArea
                  )} m²`}
                />

                <ResultCard
                  label="Kapı ve pencere alanı"
                  value={`${formatNumber(
                    result.openingsArea
                  )} m²`}
                />

                <ResultCard
                  label="Net örülecek alan"
                  value={`${formatNumber(
                    result.netWallArea
                  )} m²`}
                />

                <ResultCard
                  label="Fire öncesi tuğla"
                  value={`${result.brickCountWithoutWaste} adet`}
                />

                <ResultCard
                  label="Fire için eklenen tuğla"
                  value={`${result.wasteBrickCount} adet`}
                />

                <ResultCard
                  label="Paket veya palet sayısı"
                  value={`${result.packageCount} adet`}
                />

                <ResultCard
                  label="Satın alınacak toplam tuğla"
                  value={`${result.purchasedBrickCount} adet`}
                />

                <ResultCard
                  label="Fazla kalacak tuğla"
                  value={`${result.extraBrickCount} adet`}
                />

                <ResultCard
                  label="Yaklaşık harç hacmi"
                  value={`${formatNumber(
                    result.estimatedMortarVolume
                  )} m³`}
                />

                {result.totalCost !== null && (
                  <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-7">
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
                      Yaklaşık tuğla maliyeti
                    </p>

                    <p className="mt-5 text-4xl font-bold">
                      {formatCurrency(result.totalCost)}
                    </p>

                    <p className="mt-2 text-slate-300">
                      Yalnızca hesaplanan tuğla adedi
                    </p>
                  </section>
                )}

                <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
                  <p className="font-semibold text-amber-300">
                    Harç hesabı uyarısı
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Harç miktarı yaklaşık bir ön değerdir. Tuğla
                    türü, duvar kalınlığı, derz biçimi ve uygulama
                    yöntemi gerçek miktarı değiştirir.
                  </p>
                </section>

                <p className="text-sm leading-6 text-slate-500">
                  Bu araç yaklaşık malzeme hesabı yapar. Üreticinin
                  metrekare başına tüketim ve paket bilgileri satın
                  alma öncesinde kontrol edilmelidir.
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
  dark = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  step: string;
  allowEmpty?: boolean;
  dark?: boolean;
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
        onChange={(event) =>
          onChange(event.target.value)
        }
        required={!allowEmpty}
        className={`w-full rounded-xl border border-slate-700 px-4 py-3 outline-none transition focus:border-cyan-400 ${
          dark ? "bg-slate-900" : "bg-slate-950"
        }`}
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
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
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