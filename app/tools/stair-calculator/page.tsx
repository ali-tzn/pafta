"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/app/components/RelatedTools";
import ToolLearningGuide from "@/app/components/ToolLearningGuide";
import { trackToolEvent } from "@/lib/analytics";

type StairOption = {
  riserCount: number;
  riserHeight: number;
  treadDepth: number;
  comfortValue: number;
  horizontalLength: number;
  status: "Uygun" | "Sınırda";
};

export default function StairCalculatorPage() {
  const [floorHeight, setFloorHeight] = useState("300");
  const [copyStatus, setCopyStatus] = useState("");

  const options = useMemo<StairOption[]>(() => {
    const height = Number(floorHeight);

    if (!height || height <= 0) {
      return [];
    }

    const results: StairOption[] = [];

    for (let riserCount = 10; riserCount <= 30; riserCount++) {
      const riserHeight = height / riserCount;

      if (riserHeight < 15 || riserHeight > 19) {
        continue;
      }

      const treadDepth = 63 - 2 * riserHeight;
      const comfortValue = 2 * riserHeight + treadDepth;
      const horizontalLength = treadDepth * (riserCount - 1);

      if (treadDepth < 25 || treadDepth > 33) {
        continue;
      }

      results.push({
        riserCount,
        riserHeight,
        treadDepth,
        comfortValue,
        horizontalLength,
        status:
          riserHeight >= 16 &&
          riserHeight <= 18 &&
          treadDepth >= 27 &&
          treadDepth <= 30
            ? "Uygun"
            : "Sınırda",
      });
    }

    return results.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "Uygun" ? -1 : 1;
      }

      return (
        Math.abs(a.comfortValue - 63) - Math.abs(b.comfortValue - 63)
      );
    });
  }, [floorHeight]);

  const recommendedOption = options[0];

  async function copyRecommendedOption() {
    if (!recommendedOption) return;
    const text = [
      "PAFTA MERDİVEN HESAP ÖZETİ",
      `Kat yüksekliği: ${floorHeight} cm`,
      `Rıht sayısı: ${recommendedOption.riserCount}`,
      `Rıht yüksekliği: ${recommendedOption.riserHeight.toFixed(2)} cm`,
      `Basamak genişliği: ${recommendedOption.treadDepth.toFixed(2)} cm`,
      `Basamak sayısı: ${recommendedOption.riserCount - 1}`,
      `Toplam yatay uzunluk: ${recommendedOption.horizontalLength.toFixed(2)} cm`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopyStatus("Önerilen çözüm kopyalandı.");
    trackToolEvent("stair_calculator", "result_copied");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Hesap Araçları
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Merdiven Hesaplayıcı
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Kat yüksekliğini girerek uygun rıht sayısını, rıht yüksekliğini,
            basamak genişliğini ve toplam yatay merdiven uzunluğunu hesapla.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <section className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <label
              htmlFor="floorHeight"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Kat yüksekliği
            </label>

            <div className="relative">
              <input
                id="floorHeight"
                type="number"
                min="1"
                step="1"
                value={floorHeight}
                onChange={(event) => setFloorHeight(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-14 text-lg outline-none transition focus:border-cyan-400"
                placeholder="Örneğin 300"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                cm
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Kullanılan formül</p>
              <p className="mt-1 text-lg font-semibold">2R + B = 63 cm</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                R: rıht yüksekliği, B: basamak genişliği.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-sm leading-6 text-amber-100">
                Bu araç ön tasarım ve öğrenci çalışmaları içindir. Uygulama
                projesinde yürürlükteki yönetmelikler ve proje koşulları ayrıca
                kontrol edilmelidir.
              </p>
            </div>
          </section>

          <section>
            {!recommendedOption ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                <h2 className="text-2xl font-semibold">
                  Uygun bir seçenek bulunamadı
                </h2>
                <p className="mt-3 text-slate-400">
                  Pozitif ve gerçekçi bir kat yüksekliği gir.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                    Önerilen çözüm
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <ResultCard
                      label="Rıht sayısı"
                      value={`${recommendedOption.riserCount}`}
                    />

                    <ResultCard
                      label="Rıht yüksekliği"
                      value={`${recommendedOption.riserHeight.toFixed(2)} cm`}
                    />

                    <ResultCard
                      label="Basamak genişliği"
                      value={`${recommendedOption.treadDepth.toFixed(2)} cm`}
                    />

                    <ResultCard
                      label="Toplam yatay uzunluk"
                      value={`${recommendedOption.horizontalLength.toFixed(
                        2
                      )} cm`}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-slate-950 px-4 py-2 text-slate-200">
                      Basamak sayısı: {recommendedOption.riserCount - 1}
                    </span>

                    <span className="rounded-full bg-slate-950 px-4 py-2 text-slate-200">
                      2R + B: {recommendedOption.comfortValue.toFixed(2)} cm
                    </span>

                    <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-200">
                      {recommendedOption.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyRecommendedOption}
                    className="mt-5 rounded-xl border border-cyan-400/40 bg-slate-950 px-4 py-3 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/10"
                  >
                    Önerilen çözümü kopyala
                  </button>
                  {copyStatus && (
                    <span className="ml-3 text-sm text-slate-400">{copyStatus}</span>
                  )}
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
                  <div className="border-b border-slate-800 px-6 py-5">
                    <h2 className="text-xl font-semibold">
                      Alternatif çözümler
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Aynı kat yüksekliği için kullanılabilecek diğer değerler.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left">
                      <thead className="bg-slate-950 text-sm text-slate-400">
                        <tr>
                          <th className="px-6 py-4">Rıht</th>
                          <th className="px-6 py-4">Rıht yüksekliği</th>
                          <th className="px-6 py-4">Basamak genişliği</th>
                          <th className="px-6 py-4">Yatay uzunluk</th>
                          <th className="px-6 py-4">Durum</th>
                        </tr>
                      </thead>

                      <tbody>
                        {options.map((option) => (
                          <tr
                            key={option.riserCount}
                            className="border-t border-slate-800"
                          >
                            <td className="px-6 py-4 font-semibold">
                              {option.riserCount}
                            </td>

                            <td className="px-6 py-4 text-slate-300">
                              {option.riserHeight.toFixed(2)} cm
                            </td>

                            <td className="px-6 py-4 text-slate-300">
                              {option.treadDepth.toFixed(2)} cm
                            </td>

                            <td className="px-6 py-4 text-slate-300">
                              {option.horizontalLength.toFixed(2)} cm
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  option.status === "Uygun"
                                    ? "bg-emerald-500/20 text-emerald-200"
                                    : "bg-amber-500/20 text-amber-200"
                                }`}
                              >
                                {option.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
        <ToolLearningGuide
          title="Rıht ve basamak ölçüsü nasıl belirlenir?"
          description="Merdiven rahatlığı yalnızca kat yüksekliğini eşit rıhtlara bölmekle bitmez. Rıht yüksekliği, basamak genişliği, kol boyu, sahanlık ve yürürlükteki kurallar birlikte değerlendirilmelidir."
          steps={[
            { title: "Kat yüksekliğini ölç", text: "Bitmiş döşemeden bitmiş döşemeye düşey mesafeyi santimetre olarak gir. Kaba döşeme yüksekliğiyle karıştırma." },
            { title: "Öneriyi incele", text: "Araç uygun rıht sayılarını tarar ve 2R + B yaklaşımına göre rahat çözümleri öne çıkarır." },
            { title: "Plana yerleştir", text: "Toplam yatay uzunluğu, sahanlığı, merdiven genişliğini ve baş kurtarma yüksekliğini plan-kesit üzerinde kontrol et." },
          ]}
          formulas={[
            { title: "Rıht yüksekliği", text: "Rıht yüksekliği = kat yüksekliği ÷ rıht sayısı. Tüm rıhtların eşit olması güvenli kullanım için önemlidir." },
            { title: "Konfor bağıntısı", text: "Yaygın ön tasarım yaklaşımı 2R + B ≈ 63 cm’dir. R rıht yüksekliği, B basamak genişliğidir." },
            { title: "Yaklaşık kol uzunluğu", text: "Düz bir kolda yatay uzunluk yaklaşık olarak basamak genişliği × basamak sayısıdır. Sahanlık ayrıca eklenir." },
          ]}
          example={{ title: "300 cm kat yüksekliği örneği", text: "17 rıht seçildiğinde rıht yüksekliği yaklaşık 17,65 cm olur. 2R + B = 63 yaklaşımı basamağı yaklaşık 27,71 cm verir. Planda sahanlık ve taşıyıcı sistem için ayrıca yer ayrılmalıdır." }}
          mistakes={[
            { title: "Döşeme kalınlığını yanlış okumak", text: "Kat yüksekliği, bitmiş kotlar arasındaki değerdir. Kesitteki kaba beton kotunu doğrudan kullanmak son rıhtı bozabilir." },
            { title: "Rıht ve basamak sayısını eşit sanmak", text: "İki kat arasındaki düzende basamak sayısı çoğu durumda rıht sayısından bir eksik değerlendirilir." },
            { title: "Sahanlığı hesaba katmamak", text: "Araç düz yatay uzunluğu verir. U, L veya çift kollu çözümde sahanlık geometrisi ayrıca yerleştirilmelidir." },
            { title: "Yalnızca konfor formülüne güvenmek", text: "Yangın kaçışı, erişilebilirlik, merdiven genişliği, korkuluk ve baş mesafesi ilgili mevzuata göre kontrol edilmelidir." },
          ]}
          faqs={[
            { question: "300 cm kat yüksekliğinde kaç rıht olur?", answer: "Seçilen hedef rıht yüksekliğine göre genellikle 17 veya 18 rıht değerlendirilebilir. Kesin seçim plan geometrisi ve yönetmelik koşullarıyla doğrulanmalıdır." },
            { question: "Rıht yüksekliği kaç santimetre olmalı?", answer: "Yapı kullanımına ve mevzuata göre değişir. Araç ön tasarımda 15–19 cm aralığını tarar ve 16–18 cm aralığını daha rahat seçenek olarak öne çıkarır." },
            { question: "Basamak genişliği nasıl hesaplanır?", answer: "Ön tasarımda B = 63 − 2R bağıntısı kullanılabilir. Ancak kullanım türüne ilişkin minimum ölçüler ayrıca kontrol edilmelidir." },
            { question: "Döner merdiven hesaplanabilir mi?", answer: "Bu araç düz koşu için ön boyut verir. Döner ve dengelenmiş basamaklarda yürüyüş hattı, iç-dış basamak ölçüleri ve özel kurallar ayrıca çözülmelidir." },
          ]}
          relatedLinks={[
            { href: "/tools/ramp-calculator", label: "Rampa hesaplama", description: "Kot farkına göre eğim ve rampa uzunluğunu hesapla." },
            { href: "/proje-araclari/mekan-olculeri", label: "Mekân ölçüleri", description: "Dolaşım ve yapı elemanları için başlangıç ölçülerini incele." },
            { href: "/proje-araclari/yonetmelik-kontrol", label: "Yönetmelik kontrolü", description: "Proje girdilerini daha kapsamlı bir ön kontrolden geçir." },
          ]}
        />
        <RelatedTools currentHref="/tools/stair-calculator" kind="calculation" />
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
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
