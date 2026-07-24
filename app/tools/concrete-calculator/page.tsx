"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ConcreteElementType =
  | "slab"
  | "column"
  | "beam"
  | "foundation"
  | "custom";

type ConcreteElement = {
  id: number;
  name: string;
  type: ConcreteElementType;
  length: string;
  width: string;
  height: string;
  quantity: string;
};

const elementTypeLabels: Record<ConcreteElementType, string> = {
  slab: "Döşeme",
  column: "Kolon",
  beam: "Kiriş",
  foundation: "Temel",
  custom: "Özel eleman",
};

export default function ConcreteCalculatorPage() {
  const [elements, setElements] = useState<ConcreteElement[]>([
    {
      id: 1,
      name: "Zemin kat döşemesi",
      type: "slab",
      length: "10",
      width: "8",
      height: "0.15",
      quantity: "1",
    },
  ]);

  const [wastePercent, setWastePercent] = useState("5");
  const [truckCapacity, setTruckCapacity] = useState("8");

  const result = useMemo(() => {
    let netVolume = 0;
    let validElementCount = 0;

    const calculatedElements = elements.map((element) => {
      const length = Number(element.length);
      const width = Number(element.width);
      const height = Number(element.height);
      const quantity = Number(element.quantity);

      const isValid =
        Number.isFinite(length) &&
        length > 0 &&
        Number.isFinite(width) &&
        width > 0 &&
        Number.isFinite(height) &&
        height > 0 &&
        Number.isFinite(quantity) &&
        quantity > 0;

      const volume = isValid
        ? length * width * height * quantity
        : 0;

      if (isValid) {
        netVolume += volume;
        validElementCount += 1;
      }

      return {
        ...element,
        volume,
        isValid,
      };
    });

    const waste = Number(wastePercent);
    const capacity = Number(truckCapacity);

    const validWaste =
      Number.isFinite(waste) && waste >= 0 ? waste : 0;

    const wasteVolume = netVolume * (validWaste / 100);
    const totalVolume = netVolume + wasteVolume;

    const validTruckCapacity =
      Number.isFinite(capacity) && capacity > 0
        ? capacity
        : null;

    const truckCount = validTruckCapacity
      ? Math.ceil(totalVolume / validTruckCapacity)
      : null;

    return {
      calculatedElements,
      netVolume,
      wasteVolume,
      totalVolume,
      validElementCount,
      truckCount,
      truckCapacity: validTruckCapacity,
    };
  }, [elements, wastePercent, truckCapacity]);

  function updateElement(
    id: number,
    field: keyof Omit<ConcreteElement, "id">,
    value: string
  ) {
    setElements((currentElements) =>
      currentElements.map((element) =>
        element.id === id
          ? {
              ...element,
              [field]: value,
            }
          : element
      )
    );
  }

  function changeElementType(
    id: number,
    newType: ConcreteElementType
  ) {
    setElements((currentElements) =>
      currentElements.map((element) => {
        if (element.id !== id) {
          return element;
        }

        return {
          ...element,
          type: newType,
          name:
            element.name.trim() === "" ||
            Object.values(elementTypeLabels).includes(element.name)
              ? elementTypeLabels[newType]
              : element.name,
        };
      })
    );
  }

  function addElement(type: ConcreteElementType = "custom") {
    setElements((currentElements) => [
      ...currentElements,
      {
        id: Date.now(),
        name: elementTypeLabels[type],
        type,
        length: "1",
        width: "1",
        height: type === "slab" ? "0.15" : "0.4",
        quantity: "1",
      },
    ]);
  }

  function removeElement(id: number) {
    setElements((currentElements) =>
      currentElements.filter((element) => element.id !== id)
    );
  }

  function clearElements() {
    setElements([
      {
        id: Date.now(),
        name: "Yeni eleman",
        type: "custom",
        length: "1",
        width: "1",
        height: "1",
        quantity: "1",
      },
    ]);
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
            Beton Hacmi Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Beton Hacmi Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Döşeme, kolon, kiriş ve temel ölçülerini girerek toplam
            beton hacmini, fire payını ve yaklaşık transmikser
            ihtiyacını hesapla.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Beton elemanları
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Tüm ölçüleri metre cinsinden gir.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => addElement("slab")}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    + Döşeme
                  </button>

                  <button
                    type="button"
                    onClick={() => addElement("column")}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    + Kolon
                  </button>

                  <button
                    type="button"
                    onClick={() => addElement("beam")}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    + Kiriş
                  </button>

                  <button
                    type="button"
                    onClick={() => addElement("foundation")}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    + Temel
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {elements.map((element, index) => {
                  const calculatedElement =
                    result.calculatedElements.find(
                      (item) => item.id === element.id
                    );

                  return (
                    <div
                      key={element.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <p className="font-semibold text-white">
                          Eleman {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeElement(element.id)}
                          disabled={elements.length === 1}
                          className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Sil
                        </button>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`element-name-${element.id}`}
                            className="mb-2 block text-sm text-slate-400"
                          >
                            Eleman adı
                          </label>

                          <input
                            id={`element-name-${element.id}`}
                            type="text"
                            value={element.name}
                            onChange={(event) =>
                              updateElement(
                                element.id,
                                "name",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`element-type-${element.id}`}
                            className="mb-2 block text-sm text-slate-400"
                          >
                            Eleman türü
                          </label>

                          <select
                            id={`element-type-${element.id}`}
                            value={element.type}
                            onChange={(event) =>
                              changeElementType(
                                element.id,
                                event.target
                                  .value as ConcreteElementType
                              )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                          >
                            {Object.entries(elementTypeLabels).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <label
                            htmlFor={`length-${element.id}`}
                            className="mb-2 block text-sm text-slate-400"
                          >
                            Uzunluk (m)
                          </label>

                          <input
                            id={`length-${element.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={element.length}
                            onChange={(event) =>
                              updateElement(
                                element.id,
                                "length",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`width-${element.id}`}
                            className="mb-2 block text-sm text-slate-400"
                          >
                            Genişlik (m)
                          </label>

                          <input
                            id={`width-${element.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={element.width}
                            onChange={(event) =>
                              updateElement(
                                element.id,
                                "width",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`height-${element.id}`}
                            className="mb-2 block text-sm text-slate-400"
                          >
                            Yükseklik / kalınlık (m)
                          </label>

                          <input
                            id={`height-${element.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={element.height}
                            onChange={(event) =>
                              updateElement(
                                element.id,
                                "height",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`quantity-${element.id}`}
                            className="mb-2 block text-sm text-slate-400"
                          >
                            Adet
                          </label>

                          <input
                            id={`quantity-${element.id}`}
                            type="number"
                            min="1"
                            step="1"
                            value={element.quantity}
                            onChange={(event) =>
                              updateElement(
                                element.id,
                                "quantity",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <p className="text-sm text-slate-400">
                          Bu elemanın beton hacmi
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          {formatNumber(
                            calculatedElement?.volume ?? 0
                          )}{" "}
                          m³
                        </p>

                        {calculatedElement &&
                          !calculatedElement.isValid && (
                            <p className="mt-2 text-sm text-red-300">
                              Ölçü ve adet değerleri sıfırdan büyük
                              olmalıdır.
                            </p>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => addElement("custom")}
                  className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  + Özel eleman ekle
                </button>

                <button
                  type="button"
                  onClick={clearElements}
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Listeyi temizle
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Sipariş ayarları
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="waste-percent"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Fire ve tolerans payı (%)
                  </label>

                  <input
                    id="waste-percent"
                    type="number"
                    min="0"
                    step="0.1"
                    value={wastePercent}
                    onChange={(event) =>
                      setWastePercent(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="truck-capacity"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Transmikser kapasitesi (m³)
                  </label>

                  <input
                    id="truck-capacity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={truckCapacity}
                    onChange={(event) =>
                      setTruckCapacity(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Kullanılan formül
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Hacim = Uzunluk × Genişlik × Yükseklik × Adet
                </p>
              </div>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Sipariş beton miktarı
              </p>

              <p className="mt-5 text-4xl font-bold sm:text-5xl">
                {formatNumber(result.totalVolume)} m³
              </p>

              <p className="mt-2 text-slate-300">
                Fire ve tolerans payı dahil
              </p>
            </section>

            <ResultCard
              label="Net beton hacmi"
              value={`${formatNumber(result.netVolume)} m³`}
            />

            <ResultCard
              label="Fire ve tolerans hacmi"
              value={`${formatNumber(result.wasteVolume)} m³`}
            />

            <ResultCard
              label="Hesaplanan eleman"
              value={String(result.validElementCount)}
            />

            <ResultCard
              label="Yaklaşık transmikser sayısı"
              value={
                result.truckCount === null
                  ? "—"
                  : `${result.truckCount} araç`
              }
            />

            {result.truckCount !== null &&
              result.truckCapacity !== null && (
                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm font-semibold text-white">
                    Transmikser hesabı
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Hesap, araç başına{" "}
                    {formatNumber(result.truckCapacity)} m³ kapasite
                    kabul edilerek yukarı yuvarlanmıştır.
                  </p>
                </section>
              )}

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Önemli uyarı
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Bu araç geometrik ön hesap yapar. Temel, döşeme,
                kolon ve kirişlerin birbirleriyle kesişen hacimleri
                ayrı ayrı girildiğinde bazı bölgeler iki kez
                hesaplanabilir.
              </p>
            </section>

            <p className="text-sm leading-6 text-slate-500">
              Gerçek sipariş miktarı; kalıp toleransları, saha
              koşulları, pompa hattında kalan beton, dökülme kayıpları
              ve beton santralinin sevkiyat koşullarına göre
              değişebilir.
            </p>
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