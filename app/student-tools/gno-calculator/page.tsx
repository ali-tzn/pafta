"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Course = {
  id: number;
  name: string;
  credit: string;
  grade: string;
};

type GradeSystemKey = "aa" | "plusMinus" | "simple" | "custom";

type GradeSystem = {
  name: string;
  grades: Record<string, number>;
};

const gradeSystems: Record<Exclude<GradeSystemKey, "custom">, GradeSystem> = {
  aa: {
    name: "AA–FF Sistemi",
    grades: {
      AA: 4,
      BA: 3.5,
      BB: 3,
      CB: 2.5,
      CC: 2,
      DC: 1.5,
      DD: 1,
      FD: 0.5,
      FF: 0,
    },
  },

  plusMinus: {
    name: "A / A− / B+ Sistemi",
    grades: {
      A: 4,
      "A-": 3.7,
      "B+": 3.3,
      B: 3,
      "B-": 2.7,
      "C+": 2.3,
      C: 2,
      "C-": 1.7,
      "D+": 1.3,
      D: 1,
      "D-": 0.7,
      F: 0,
    },
  },

  simple: {
    name: "A–F Sistemi",
    grades: {
      A: 4,
      B: 3,
      C: 2,
      D: 1,
      F: 0,
    },
  },
};

const initialCustomGrades: Record<string, number> = {
  AA: 4,
  BA: 3.5,
  BB: 3,
  CB: 2.5,
  CC: 2,
  DC: 1.5,
  DD: 1,
  FF: 0,
};

export default function GnoCalculatorPage() {
  const [gradeSystem, setGradeSystem] =
    useState<GradeSystemKey>("aa");

  const [customGrades, setCustomGrades] =
    useState<Record<string, number>>(initialCustomGrades);

  const [usePreviousRecord, setUsePreviousRecord] = useState(true);
  const [previousGno, setPreviousGno] = useState("3.18");
  const [previousCredits, setPreviousCredits] = useState("120");

  const [targetGno, setTargetGno] = useState("3.25");

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "Mimari Proje",
      credit: "6",
      grade: "BA",
    },
    {
      id: 2,
      name: "Yapı Bilgisi",
      credit: "4",
      grade: "BB",
    },
    {
      id: 3,
      name: "Mimarlık Tarihi",
      credit: "3",
      grade: "AA",
    },
  ]);

  const activeGrades =
    gradeSystem === "custom"
      ? customGrades
      : gradeSystems[gradeSystem].grades;

  const gradeOptions = Object.entries(activeGrades);

  const result = useMemo(() => {
    let semesterCredits = 0;
    let semesterQualityPoints = 0;

    for (const course of courses) {
      const credit = Number(course.credit);
      const gradePoint = activeGrades[course.grade];

      if (
        !Number.isFinite(credit) ||
        credit <= 0 ||
        gradePoint === undefined
      ) {
        continue;
      }

      semesterCredits += credit;
      semesterQualityPoints += credit * gradePoint;
    }

    const semesterGno =
      semesterCredits > 0
        ? semesterQualityPoints / semesterCredits
        : 0;

    const oldGno = Number(previousGno);
    const oldCredits = Number(previousCredits);

    const validPreviousRecord =
      usePreviousRecord &&
      Number.isFinite(oldGno) &&
      oldGno >= 0 &&
      oldGno <= 4 &&
      Number.isFinite(oldCredits) &&
      oldCredits > 0;

    const previousQualityPoints = validPreviousRecord
      ? oldGno * oldCredits
      : 0;

    const totalCredits =
      (validPreviousRecord ? oldCredits : 0) + semesterCredits;

    const totalQualityPoints =
      previousQualityPoints + semesterQualityPoints;

    const newCumulativeGno =
      totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    const target = Number(targetGno);

    const requiredSemesterGno =
      validPreviousRecord &&
      semesterCredits > 0 &&
      Number.isFinite(target)
        ? (target * (oldCredits + semesterCredits) -
            oldGno * oldCredits) /
          semesterCredits
        : null;

    return {
      semesterCredits,
      semesterQualityPoints,
      semesterGno,
      validPreviousRecord,
      oldCredits,
      totalCredits,
      totalQualityPoints,
      newCumulativeGno,
      requiredSemesterGno,
    };
  }, [
    courses,
    activeGrades,
    usePreviousRecord,
    previousGno,
    previousCredits,
    targetGno,
  ]);

  function changeGradeSystem(newSystem: GradeSystemKey) {
    const newGrades =
      newSystem === "custom"
        ? customGrades
        : gradeSystems[newSystem].grades;

    const firstGrade = Object.keys(newGrades)[0];

    setGradeSystem(newSystem);

    setCourses((currentCourses) =>
      currentCourses.map((course) => ({
        ...course,
        grade: firstGrade,
      }))
    );
  }

  function updateCourse(
    id: number,
    field: keyof Omit<Course, "id">,
    value: string
  ) {
    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === id
          ? {
              ...course,
              [field]: value,
            }
          : course
      )
    );
  }

  function addCourse() {
    const firstGrade = Object.keys(activeGrades)[0];

    setCourses((currentCourses) => [
      ...currentCourses,
      {
        id: Date.now(),
        name: "",
        credit: "3",
        grade: firstGrade,
      },
    ]);
  }

  function removeCourse(id: number) {
    setCourses((currentCourses) =>
      currentCourses.filter((course) => course.id !== id)
    );
  }

  function clearCourses() {
    const firstGrade = Object.keys(activeGrades)[0];

    setCourses([
      {
        id: Date.now(),
        name: "",
        credit: "3",
        grade: firstGrade,
      },
    ]);
  }

  function updateCustomGrade(
    oldName: string,
    newName: string,
    newPoint: string
  ) {
    const trimmedName = newName.trim().toUpperCase();
    const point = Number(newPoint);

    if (
      !trimmedName ||
      !Number.isFinite(point) ||
      point < 0 ||
      point > 4
    ) {
      return;
    }

    setCustomGrades((currentGrades) => {
      const nextGrades = { ...currentGrades };

      delete nextGrades[oldName];
      nextGrades[trimmedName] = point;

      return nextGrades;
    });

    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.grade === oldName
          ? {
              ...course,
              grade: trimmedName,
            }
          : course
      )
    );
  }

  function addCustomGrade() {
    let newName = "YENİ";
    let counter = 1;

    while (customGrades[newName] !== undefined) {
      newName = `YENİ${counter}`;
      counter += 1;
    }

    setCustomGrades((currentGrades) => ({
      ...currentGrades,
      [newName]: 0,
    }));
  }

  function removeCustomGrade(gradeName: string) {
    if (Object.keys(customGrades).length <= 2) {
      return;
    }

    const remainingGrades = Object.entries(customGrades).filter(
      ([name]) => name !== gradeName
    );

    const replacementGrade = remainingGrades[0][0];

    setCustomGrades(Object.fromEntries(remainingGrades));

    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.grade === gradeName
          ? {
              ...course,
              grade: replacementGrade,
            }
          : course
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-400">
            Ana Sayfa
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/student-tools"
            className="hover:text-cyan-400"
          >
            Öğrenci Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            GNO Hesaplayıcı
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Öğrenci Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            GNO ve Dönem Ortalaması Hesaplayıcı
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Mevcut GNO ve tamamlanan kredilerini gir, yeni
            dönem derslerini ekle ve oluşacak yeni genel
            ortalamanı hesapla.
          </p>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <label
            htmlFor="grade-system"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Üniversitenin not sistemi
          </label>

          <select
            id="grade-system"
            value={gradeSystem}
            onChange={(event) =>
              changeGradeSystem(
                event.target.value as GradeSystemKey
              )
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400 md:max-w-md"
          >
            <option value="aa">AA–FF sistemi</option>
            <option value="plusMinus">
              A, A−, B+, B− sistemi
            </option>
            <option value="simple">A–F sistemi</option>
            <option value="custom">
              Özel katsayı sistemi
            </option>
          </select>

          <div className="mt-5 flex flex-wrap gap-2">
            {gradeOptions.map(([grade, point]) => (
              <span
                key={grade}
                className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-300"
              >
                {grade}: {formatNumber(point)}
              </span>
            ))}
          </div>
        </section>

        {gradeSystem === "custom" && (
          <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Özel harf notları
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Üniversitenin kullandığı harfleri ve 4,00
              üzerinden katsayılarını düzenle.
            </p>

            <div className="mt-5 grid gap-3">
              {Object.entries(customGrades).map(
                ([grade, point]) => (
                  <div
                    key={grade}
                    className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <input
                      type="text"
                      defaultValue={grade}
                      onBlur={(event) =>
                        updateCustomGrade(
                          grade,
                          event.target.value,
                          String(point)
                        )
                      }
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                    />

                    <input
                      type="number"
                      min="0"
                      max="4"
                      step="0.01"
                      defaultValue={point}
                      onBlur={(event) =>
                        updateCustomGrade(
                          grade,
                          grade,
                          event.target.value
                        )
                      }
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeCustomGrade(grade)
                      }
                      className="rounded-xl border border-red-400/30 px-4 py-3 text-red-300 hover:bg-red-400/10"
                    >
                      Sil
                    </button>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={addCustomGrade}
              className="mt-5 rounded-xl border border-cyan-400/40 px-5 py-3 font-semibold text-cyan-300 hover:bg-cyan-400/10"
            >
              + Harf notu ekle
            </button>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <input
              id="previous-record"
              type="checkbox"
              checked={usePreviousRecord}
              onChange={(event) =>
                setUsePreviousRecord(event.target.checked)
              }
              className="h-5 w-5 accent-cyan-400"
            />

            <label
              htmlFor="previous-record"
              className="font-semibold"
            >
              Daha önce tamamladığım dersleri GNO’ya ekle
            </label>
          </div>

          {usePreviousRecord && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="previous-gno"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Mevcut GNO
                </label>

                <input
                  id="previous-gno"
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={previousGno}
                  onChange={(event) =>
                    setPreviousGno(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="previous-credits"
                  className="mb-2 block text-sm text-slate-400"
                >
                  GNO’ya dahil tamamlanan kredi
                </label>

                <input
                  id="previous-credits"
                  type="number"
                  min="0"
                  step="0.5"
                  value={previousCredits}
                  onChange={(event) =>
                    setPreviousCredits(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Transkriptinde GNO hesabında kullanılan toplam
            krediyi gir. Üniversiten yerel kredi kullanıyorsa
            yerel krediyi, AKTS kullanıyorsa AKTS değerini
            kullan.
          </p>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">
              Yeni dönem dersleri
            </h2>

            <div className="mt-6 space-y-4">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 md:grid-cols-[1fr_120px_150px_auto]"
                >
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Ders {index + 1}
                    </label>

                    <input
                      type="text"
                      value={course.name}
                      onChange={(event) =>
                        updateCourse(
                          course.id,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Ders adı"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Kredi
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={course.credit}
                      onChange={(event) =>
                        updateCourse(
                          course.id,
                          "credit",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Harf notu
                    </label>

                    <select
                      value={course.grade}
                      onChange={(event) =>
                        updateCourse(
                          course.id,
                          "grade",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                    >
                      {gradeOptions.map(([grade, point]) => (
                        <option key={grade} value={grade}>
                          {grade} ({formatNumber(point)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        removeCourse(course.id)
                      }
                      disabled={courses.length === 1}
                      className="rounded-xl border border-red-400/30 px-4 py-3 text-red-300 hover:bg-red-400/10 disabled:opacity-40"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addCourse}
                className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
              >
                + Ders ekle
              </button>

              <button
                type="button"
                onClick={clearCourses}
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:text-white"
              >
                Listeyi temizle
              </button>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Yeni genel ortalama
              </p>

              <p className="mt-5 text-6xl font-bold">
                {formatGno(result.newCumulativeGno)}
              </p>

              <p className="mt-2 text-slate-300">
                4,00 üzerinden
              </p>

              {result.validPreviousRecord && (
                <p className="mt-4 text-sm text-slate-400">
                  Mevcut {formatGno(Number(previousGno))}
                  {" → "}
                  Yeni{" "}
                  {formatGno(result.newCumulativeGno)}
                </p>
              )}
            </div>

            <ResultCard
              label="Bu dönem ortalaması"
              value={formatGno(result.semesterGno)}
            />

            <ResultCard
              label="Bu dönem kredisi"
              value={formatNumber(result.semesterCredits)}
            />

            <ResultCard
              label="Yeni toplam kredi"
              value={formatNumber(result.totalCredits)}
            />

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <label
                htmlFor="target-gno"
                className="block text-sm text-slate-400"
              >
                Hedef GNO
              </label>

              <input
                id="target-gno"
                type="number"
                min="0"
                max="4"
                step="0.01"
                value={targetGno}
                onChange={(event) =>
                  setTargetGno(event.target.value)
                }
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />

              {result.requiredSemesterGno !== null && (
                <div className="mt-5">
                  <p className="text-sm text-slate-400">
                    Bu kredi yüküyle gereken dönem ortalaması
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {result.requiredSemesterGno > 4
                      ? "Mümkün değil"
                      : result.requiredSemesterGno < 0
                        ? "Hedef zaten sağlanıyor"
                        : formatGno(
                            result.requiredSemesterGno
                          )}
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm leading-6 text-slate-500">
              Tekrar edilen derslerin eski notunun silinmesi,
              iki notun birlikte sayılması veya yalnızca son
              notun geçerli olması üniversite yönetmeliğine
              göre değişebilir.
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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function formatGno(value: number) {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}