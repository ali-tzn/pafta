"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CalculationMode = "hours" | "sessions";

export default function AttendanceCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("hours");

  const [weeklyAmount, setWeeklyAmount] = useState("3");
  const [termWeeks, setTermWeeks] = useState("14");
  const [requiredAttendanceRate, setRequiredAttendanceRate] =
    useState("80");
  const [currentAbsence, setCurrentAbsence] = useState("4");

  const result = useMemo(() => {
    const weekly = Number(weeklyAmount);
    const weeks = Number(termWeeks);
    const attendanceRateLimit = Number(requiredAttendanceRate);
    const usedAbsence = Number(currentAbsence);

    const unitStep = mode === "hours" ? 0.5 : 1;

    const valuesValid =
      Number.isFinite(weekly) &&
      weekly > 0 &&
      Number.isFinite(weeks) &&
      weeks > 0 &&
      Number.isFinite(attendanceRateLimit) &&
      attendanceRateLimit >= 0 &&
      attendanceRateLimit <= 100 &&
      Number.isFinite(usedAbsence) &&
      usedAbsence >= 0;

    if (!valuesValid) {
      return null;
    }

    const totalAmount = weekly * weeks;

    if (usedAbsence > totalAmount) {
      return null;
    }

    const allowedAbsencePercent = 100 - attendanceRateLimit;

    const rawMaximumAbsence =
      totalAmount * (allowedAbsencePercent / 100);

    const maximumAbsence =
      Math.floor(
        (rawMaximumAbsence + Number.EPSILON) / unitStep
      ) * unitStep;

    const remainingAbsence = Math.max(
      0,
      maximumAbsence - usedAbsence
    );

    const attendedAmount = Math.max(
      0,
      totalAmount - usedAbsence
    );

    const actualAttendanceRate =
      totalAmount > 0
        ? (attendedAmount / totalAmount) * 100
        : 0;

    const actualAbsenceRate =
      totalAmount > 0
        ? (usedAbsence / totalAmount) * 100
        : 0;

    const differenceFromLimit =
      actualAttendanceRate - attendanceRateLimit;

    return {
      totalAmount,
      allowedAbsencePercent,
      rawMaximumAbsence,
      maximumAbsence,
      remainingAbsence,
      attendedAmount,
      actualAttendanceRate,
      actualAbsenceRate,
      differenceFromLimit,
      limitExceeded: usedAbsence > maximumAbsence,
      limitReached:
        Math.abs(usedAbsence - maximumAbsence) < 0.0001,
    };
  }, [
    mode,
    weeklyAmount,
    termWeeks,
    requiredAttendanceRate,
    currentAbsence,
  ]);

  const unitLabel = mode === "hours" ? "saat" : "ders";

  const weeklyLabel =
    mode === "hours"
      ? "Haftalık ders saati"
      : "Haftalık ders sayısı";

  function changeMode(newMode: CalculationMode) {
    setMode(newMode);

    if (newMode === "sessions") {
      setWeeklyAmount((currentValue) =>
        String(
          Math.max(1, Math.round(Number(currentValue) || 1))
        )
      );

      setCurrentAbsence((currentValue) =>
        String(
          Math.max(0, Math.round(Number(currentValue) || 0))
        )
      );
    }
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
            href="/student-tools"
            className="transition hover:text-cyan-400"
          >
            Öğrenci Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Devamsızlık Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Öğrenci Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Devamsızlık Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Zorunlu devam oranına göre toplam devamsızlık
            hakkını, kullandığın miktarı ve kalan hakkını
            hesapla.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-300">
                Hesaplama yöntemi
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => changeMode("hours")}
                  className={`rounded-xl border px-5 py-3 font-semibold transition ${
                    mode === "hours"
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  Ders saatine göre
                </button>

                <button
                  type="button"
                  onClick={() => changeMode("sessions")}
                  className={`rounded-xl border px-5 py-3 font-semibold transition ${
                    mode === "sessions"
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  Ders sayısına göre
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="weekly-amount"
                  className="mb-2 block text-sm text-slate-400"
                >
                  {weeklyLabel}
                </label>

                <input
                  id="weekly-amount"
                  type="number"
                  min={mode === "hours" ? "0.5" : "1"}
                  step={mode === "hours" ? "0.5" : "1"}
                  value={weeklyAmount}
                  onChange={(event) =>
                    setWeeklyAmount(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="term-weeks"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Dönem hafta sayısı
                </label>

                <input
                  id="term-weeks"
                  type="number"
                  min="1"
                  step="1"
                  value={termWeeks}
                  onChange={(event) =>
                    setTermWeeks(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="required-attendance"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Zorunlu devam oranı %
                </label>

                <input
                  id="required-attendance"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={requiredAttendanceRate}
                  onChange={(event) =>
                    setRequiredAttendanceRate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />

                <p className="mt-2 text-sm text-slate-500">
                  Örneğin devam zorunluluğu %80 ise
                  devamsızlık hakkı %20 olur.
                </p>
              </div>

              <div>
                <label
                  htmlFor="current-absence"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Şu ana kadarki devamsızlık ({unitLabel})
                </label>

                <input
                  id="current-absence"
                  type="number"
                  min="0"
                  step={mode === "hours" ? "0.5" : "1"}
                  value={currentAbsence}
                  onChange={(event) =>
                    setCurrentAbsence(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm font-semibold text-white">
                Nasıl hesaplanır?
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Önce zorunlu devam oranı 100’den çıkarılarak
                izin verilen devamsızlık yüzdesi bulunur.
                Ardından bu yüzde toplam ders miktarına
                uygulanır.
              </p>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            {!result ? (
              <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-7">
                <p className="font-semibold text-red-300">
                  Geçerli değerler gir
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Ders miktarı ve dönem süresi sıfırdan büyük
                  olmalı. Devam oranı 0 ile 100 arasında
                  olmalı ve mevcut devamsızlık toplam ders
                  miktarını geçmemelidir.
                </p>
              </div>
            ) : (
              <>
                <section
                  className={`rounded-3xl border p-7 ${
                    result.limitExceeded
                      ? "border-red-400/30 bg-red-400/10"
                      : result.limitReached
                        ? "border-amber-400/30 bg-amber-400/10"
                        : "border-cyan-400/30 bg-cyan-400/10"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold uppercase tracking-wider ${
                      result.limitExceeded
                        ? "text-red-300"
                        : result.limitReached
                          ? "text-amber-300"
                          : "text-cyan-300"
                    }`}
                  >
                    Kalan devamsızlık hakkı
                  </p>

                  <p className="mt-5 text-4xl font-bold sm:text-5xl">
                    {formatNumber(result.remainingAbsence)}
                  </p>

                  <p className="mt-2 text-slate-300">
                    {unitLabel}
                  </p>

                  <div className="mt-6 rounded-2xl bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">
                      Durum
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {result.limitExceeded
                        ? "Sınır aşıldı"
                        : result.limitReached
                          ? "Sınıra ulaşıldı"
                          : "Devamsızlık hakkın var"}
                    </p>
                  </div>
                </section>

                <ResultCard
                  label="Toplam ders"
                  value={`${formatNumber(
                    result.totalAmount
                  )} ${unitLabel}`}
                />

                <ResultCard
                  label="Zorunlu devam oranı"
                  value={`%${formatNumber(
                    Number(requiredAttendanceRate)
                  )}`}
                />

                <ResultCard
                  label="İzin verilen devamsızlık oranı"
                  value={`%${formatNumber(
                    result.allowedAbsencePercent
                  )}`}
                />

                <ResultCard
                  label="Yüzdelik teorik devamsızlık"
                  value={`${formatNumber(
                    result.rawMaximumAbsence
                  )} ${unitLabel}`}
                />

                <ResultCard
                  label="Kullanılabilir azami devamsızlık"
                  value={`${formatNumber(
                    result.maximumAbsence
                  )} ${unitLabel}`}
                />

                <ResultCard
                  label="Kullanılan devamsızlık"
                  value={`${formatNumber(
                    Number(currentAbsence)
                  )} ${unitLabel}`}
                />

                <ResultCard
                  label="Mevcut devamsızlık oranı"
                  value={`%${formatNumber(
                    result.actualAbsenceRate
                  )}`}
                />

                <ResultCard
                  label="Mevcut katılım oranı"
                  value={`%${formatNumber(
                    result.actualAttendanceRate
                  )}`}
                />

                <p className="text-sm leading-6 text-slate-500">
                  Üniversiteler teorik ve uygulamalı dersler
                  için farklı devam oranları ve yuvarlama
                  kuralları uygulayabilir. Resmî ders
                  izlencesi ve yönetmelik esas alınmalıdır.
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