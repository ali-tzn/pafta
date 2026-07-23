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

export default function WallPaintCalculatorPage() {
  const [wallLength, setWallLength] = useState("5");
  const [wallHeight, setWallHeight] = useState("2.8");
  const [wallCount, setWallCount] = useState("1");

  const [coatCount, setCoatCount] = useState("2");
  const [coverage, setCoverage] = useState("10");
  const [wastePercent, setWastePercent] = useState("10");

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
    const coats = Number(coatCount);
    const paintCoverage = Number(coverage);
    const waste = Number(wastePercent);

    const validMainValues =
      Number.isFinite(length) &&
      length > 0 &&
      Number.isFinite(height) &&
      height > 0 &&
      Number.isFinite(count) &&
      count > 0 &&
      Number.isFinite(coats) &&
      coats > 0 &&
      Number.isFinite(paintCoverage) &&
      paintCoverage > 0 &&
      Number.isFinite(waste) &&
      waste >= 0;

    if (!validMainValues) {
      return null;
    }

    const grossWallArea = length * height * count;

    let openingsArea = 0;

    for (const opening of openings) {
      const openingWidth = Number(opening.width);
      const openingHeight = Number(opening.height);
      const quantity = Number(opening.quantity);

      if (
        !Number.isFinite(openingWidth) ||
        openingWidth < 0 ||
        !Number.isFinite(openingHeight) ||
        openingHeight < 0 ||
        !Number.isFinite(quantity) ||
        quantity < 0
      ) {
        continue;
      }

      openingsArea += openingWidth * openingHeight * quantity;
    }

    const netWallArea = Math.max(0, grossWallArea - openingsArea);
    const coatedArea = netWallArea * coats;

    const basePaintLiters = coatedArea / paintCoverage;
    const wasteAmount = basePaintLiters * (waste / 100);
    const totalPaintLiters = basePaintLiters + wasteAmount;

    return {
      grossWallArea,
      openingsArea,
      netWallArea,
      coatedArea,
      basePaintLiters,
      wasteAmount,
      totalPaintLiters,
      openingsExceedWall: openingsArea > grossWallArea,
    };
  }, [
    wallLength,
    wallHeight,
    wallCount,
    coatCount,
    coverage,
    wastePercent,
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
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
            Duvar ve Boya Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Duvar Alanı ve Boya Miktarı Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Duvar ölçülerini gir, kapı ve pencere boşluklarını düş ve kaç litre
            boya gerektiğini hesapla.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Duvar ölçüleri
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="wall-length"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Duvar uzunluğu (m)
                  </label>

                  <input
                    id="wall-length"
                    type="number"
                    min="0"
                    step="0.01"
                    value={wallLength}
                    onChange={(event) =>
                      setWallLength(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wall-height"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Duvar yüksekliği (m)
                  </label>

                  <input
                    id="wall-height"
                    type="number"
                    min="0"
                    step="0.01"
                    value={wallHeight}
                    onChange={(event) =>
                      setWallHeight(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wall-count"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Aynı ölçüde duvar sayısı
                  </label>

                  <input
                    id="wall-count"
                    type="number"
                    min="1"
                    step="1"
                    value={wallCount}
                    onChange={(event) =>
                      setWallCount(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Kapı ve pencere boşlukları
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Boyanmayacak alanları duvar alanından düş.
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

                      <div>
                        <label
                          htmlFor={`opening-width-${opening.id}`}
                          className="mb-2 block text-sm text-slate-400"
                        >
                          En (m)
                        </label>

                        <input
                          id={`opening-width-${opening.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={opening.width}
                          onChange={(event) =>
                            updateOpening(
                              opening.id,
                              "width",
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`opening-height-${opening.id}`}
                          className="mb-2 block text-sm text-slate-400"
                        >
                          Boy (m)
                        </label>

                        <input
                          id={`opening-height-${opening.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={opening.height}
                          onChange={(event) =>
                            updateOpening(
                              opening.id,
                              "height",
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`opening-quantity-${opening.id}`}
                          className="mb-2 block text-sm text-slate-400"
                        >
                          Adet
                        </label>

                        <input
                          id={`opening-quantity-${opening.id}`}
                          type="number"
                          min="0"
                          step="1"
                          value={opening.quantity}
                          onChange={(event) =>
                            updateOpening(
                              opening.id,
                              "quantity",
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeOpening(opening.id)}
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
                Boya özellikleri
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="coat-count"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Kat sayısı
                  </label>

                  <input
                    id="coat-count"
                    type="number"
                    min="1"
                    step="1"
                    value={coatCount}
                    onChange={(event) =>
                      setCoatCount(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="coverage"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Boya kaplama değeri (m²/L)
                  </label>

                  <input
                    id="coverage"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={coverage}
                    onChange={(event) =>
                      setCoverage(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="waste-percent"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Fire payı (%)
                  </label>

                  <input
                    id="waste-percent"
                    type="number"
                    min="0"
                    step="1"
                    value={wastePercent}
                    onChange={(event) =>
                      setWastePercent(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Kaplama değeri nedir?
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Bir litre boyanın tek katta kaç metrekare alan
                  kaplayabildiğini gösterir. Ürünün teknik föyündeki değeri
                  kullanmalısın.
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
                  Duvar ölçüleri, kat sayısı ve boya kaplama değeri sıfırdan
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
                    Gerekli boya miktarı
                  </p>

                  <p className="mt-5 text-5xl font-bold">
                    {formatNumber(result.totalPaintLiters)} L
                  </p>

                  <p className="mt-2 text-slate-300">
                    Fire payı dahil yaklaşık miktar
                  </p>

                  {result.openingsExceedWall && (
                    <p className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-red-300">
                      Kapı ve pencere alanları toplam duvar alanından büyük.
                      Ölçüleri kontrol et.
                    </p>
                  )}
                </section>

                <ResultCard
                  label="Brüt duvar alanı"
                  value={`${formatNumber(result.grossWallArea)} m²`}
                />

                <ResultCard
                  label="Kapı ve pencere alanı"
                  value={`${formatNumber(result.openingsArea)} m²`}
                />

                <ResultCard
                  label="Net boyanacak alan"
                  value={`${formatNumber(result.netWallArea)} m²`}
                />

                <ResultCard
                  label="Katlar dahil toplam uygulama alanı"
                  value={`${formatNumber(result.coatedArea)} m²`}
                />

                <ResultCard
                  label="Fire öncesi boya"
                  value={`${formatNumber(result.basePaintLiters)} L`}
                />

                <ResultCard
                  label="Fire payı"
                  value={`${formatNumber(result.wasteAmount)} L`}
                />

                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm font-semibold text-white">
                    Satın alma önerisi
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Hesaplanan miktarın üzerindeki en yakın ambalaj toplamını
                    seç. Boya kutuları genellikle farklı litre seçeneklerinde
                    satıldığı için küçük bir miktar fazla almak uygulamada daha
                    güvenlidir.
                  </p>
                </section>

                <p className="text-sm leading-6 text-slate-500">
                  Yüzey emiciliği, astar kullanımı, boya türü, renk değişimi ve
                  uygulama yöntemi gerçek tüketimi değiştirebilir.
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

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}