"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Separator = "_" | "-" | " ";

type CaseMode = "uppercase" | "lowercase" | "title";

type FileExtension =
  | "pdf"
  | "dwg"
  | "rvt"
  | "skp"
  | "jpg"
  | "png"
  | "pptx"
  | "zip";

type DeliveryType =
  | "FINAL"
  | "VIZE"
  | "JURI"
  | "SUNUM"
  | "PAFTA"
  | "PROJE"
  | "REVIZYON"
  | "TESLIM";

const deliveryTypes: DeliveryType[] = [
  "FINAL",
  "VIZE",
  "JURI",
  "SUNUM",
  "PAFTA",
  "PROJE",
  "REVIZYON",
  "TESLIM",
];

const extensions: FileExtension[] = [
  "pdf",
  "dwg",
  "rvt",
  "skp",
  "jpg",
  "png",
  "pptx",
  "zip",
];

export default function FileNameGeneratorPage() {
  const [fullName, setFullName] = useState("Ali Tüzüngüven");
  const [studentNumber, setStudentNumber] = useState("");
  const [courseCode, setCourseCode] = useState("MIM301");
  const [projectName, setProjectName] = useState("Kültür Merkezi");
  const [deliveryType, setDeliveryType] =
    useState<DeliveryType>("FINAL");
  const [date, setDate] = useState("2026-07-23");
  const [revision, setRevision] = useState("01");
  const [extension, setExtension] =
    useState<FileExtension>("pdf");

  const [separator, setSeparator] = useState<Separator>("_");
  const [caseMode, setCaseMode] =
    useState<CaseMode>("uppercase");

  const [includeStudentNumber, setIncludeStudentNumber] =
    useState(false);
  const [includeDate, setIncludeDate] = useState(true);
  const [includeRevision, setIncludeRevision] = useState(true);

  const [copied, setCopied] = useState(false);

  const generatedFileName = useMemo(() => {
    const parts: string[] = [];

    const normalizedName = normalizeText(fullName);
    const normalizedStudentNumber = normalizeText(studentNumber);
    const normalizedCourseCode = normalizeText(courseCode);
    const normalizedProjectName = normalizeText(projectName);
    const normalizedDeliveryType = normalizeText(deliveryType);
    const normalizedDate = normalizeDate(date);
    const normalizedRevision = normalizeRevision(revision);

    if (normalizedName) {
      parts.push(normalizedName);
    }

    if (includeStudentNumber && normalizedStudentNumber) {
      parts.push(normalizedStudentNumber);
    }

    if (normalizedCourseCode) {
      parts.push(normalizedCourseCode);
    }

    if (normalizedProjectName) {
      parts.push(normalizedProjectName);
    }

    if (normalizedDeliveryType) {
      parts.push(normalizedDeliveryType);
    }

    if (includeDate && normalizedDate) {
      parts.push(normalizedDate);
    }

    if (includeRevision && normalizedRevision) {
      parts.push(normalizedRevision);
    }

    const formattedParts = parts.map((part) =>
      applyCaseMode(part, caseMode)
    );

    const baseName = formattedParts.join(separator);

    if (!baseName) {
      return `dosya.${extension}`;
    }

    return `${baseName}.${extension}`;
  }, [
    fullName,
    studentNumber,
    courseCode,
    projectName,
    deliveryType,
    date,
    revision,
    extension,
    separator,
    caseMode,
    includeStudentNumber,
    includeDate,
    includeRevision,
  ]);

  async function copyFileName() {
    try {
      await navigator.clipboard.writeText(generatedFileName);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  function resetValues() {
    setFullName("Ali Tüzüngüven");
    setStudentNumber("");
    setCourseCode("MIM301");
    setProjectName("Kültür Merkezi");
    setDeliveryType("FINAL");
    setDate("2026-07-23");
    setRevision("01");
    setExtension("pdf");
    setSeparator("_");
    setCaseMode("uppercase");
    setIncludeStudentNumber(false);
    setIncludeDate(true);
    setIncludeRevision(true);
    setCopied(false);
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
            href="/student-tools"
            className="transition hover:text-cyan-400"
          >
            Öğrenci Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Dosya Adı Oluşturucu
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Öğrenci Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Dosya Adı Oluşturucu
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Ad, ders, proje, teslim türü ve revizyon bilgilerini
            kullanarak düzenli ve teslim kurallarına uygun dosya
            adları oluştur.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_380px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Dosya bilgileri
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Dosya adına eklemek istediğin bilgileri gir.
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
                <InputField
                  id="full-name"
                  label="Ad soyad"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Ali Tüzüngüven"
                />

                <InputField
                  id="student-number"
                  label="Öğrenci numarası"
                  value={studentNumber}
                  onChange={setStudentNumber}
                  placeholder="123456"
                />

                <InputField
                  id="course-code"
                  label="Ders kodu"
                  value={courseCode}
                  onChange={setCourseCode}
                  placeholder="MIM301"
                />

                <InputField
                  id="project-name"
                  label="Proje adı"
                  value={projectName}
                  onChange={setProjectName}
                  placeholder="Kültür Merkezi"
                />

                <div>
                  <label
                    htmlFor="delivery-type"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Teslim türü
                  </label>

                  <select
                    id="delivery-type"
                    value={deliveryType}
                    onChange={(event) =>
                      setDeliveryType(
                        event.target.value as DeliveryType
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  >
                    {deliveryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="file-extension"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Dosya uzantısı
                  </label>

                  <select
                    id="file-extension"
                    value={extension}
                    onChange={(event) =>
                      setExtension(
                        event.target.value as FileExtension
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  >
                    {extensions.map((item) => (
                      <option key={item} value={item}>
                        .{item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="delivery-date"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Teslim tarihi
                  </label>

                  <input
                    id="delivery-date"
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <InputField
                  id="revision"
                  label="Revizyon numarası"
                  value={revision}
                  onChange={setRevision}
                  placeholder="01"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Dosya adı biçimi
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="separator"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Kelime ayırıcı
                  </label>

                  <select
                    id="separator"
                    value={separator}
                    onChange={(event) =>
                      setSeparator(
                        event.target.value as Separator
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  >
                    <option value="_">Alt çizgi (_)</option>
                    <option value="-">Tire (-)</option>
                    <option value=" ">Boşluk</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="case-mode"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Harf biçimi
                  </label>

                  <select
                    id="case-mode"
                    value={caseMode}
                    onChange={(event) =>
                      setCaseMode(
                        event.target.value as CaseMode
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  >
                    <option value="uppercase">
                      BÜYÜK HARF
                    </option>

                    <option value="lowercase">
                      küçük harf
                    </option>

                    <option value="title">
                      Baş Harfleri Büyük
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <ToggleRow
                  label="Öğrenci numarasını ekle"
                  checked={includeStudentNumber}
                  onChange={setIncludeStudentNumber}
                />

                <ToggleRow
                  label="Teslim tarihini ekle"
                  checked={includeDate}
                  onChange={setIncludeDate}
                />

                <ToggleRow
                  label="Revizyon numarasını ekle"
                  checked={includeRevision}
                  onChange={setIncludeRevision}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Dosya adı kuralları
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoCard
                  title="Türkçe karakterler"
                  description="Ç, Ğ, İ, Ö, Ş ve Ü harfleri dosya uyumluluğu için Latin karşılıklarına dönüştürülür."
                />

                <InfoCard
                  title="Özel karakterler"
                  description="Noktalama işaretleri ve dosya adında sorun çıkarabilecek semboller otomatik olarak temizlenir."
                />

                <InfoCard
                  title="Boşluklar"
                  description="Birden fazla boşluk tek ayırıcıya dönüştürülür ve baştaki veya sondaki ayırıcılar kaldırılır."
                />

                <InfoCard
                  title="Revizyon"
                  description="Revizyon değeri R01, R02 veya R10 biçiminde oluşturulur."
                />
              </div>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Oluşturulan dosya adı
              </p>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-5">
                <p className="break-all font-mono text-lg font-semibold leading-8 text-white">
                  {generatedFileName}
                </p>
              </div>

              <button
                type="button"
                onClick={copyFileName}
                className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                {copied ? "Kopyalandı ✓" : "Dosya adını kopyala"}
              </button>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="font-semibold text-white">
                Örnek çıktı
              </p>

              <p className="mt-3 break-all font-mono text-sm leading-7 text-slate-400">
                ALI_TUZUNGUVEN_MIM301_KULTUR_MERKEZI_FINAL_2026-07-23_R01.pdf
              </p>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Teslim kuralını kontrol et
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Bazı üniversiteler veya ders yürütücüleri özel dosya
                adı biçimi isteyebilir. Teslim yönergesinde verilen
                sırayı ve yazım biçimini ayrıca kontrol et.
              </p>
            </section>
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
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <span className="font-medium text-white">
        {label}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-cyan-400" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <p className="font-semibold text-white">
        {title}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function normalizeText(value: string) {
  return value
    .trim()
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeDate(value: string) {
  if (!value) {
    return "";
  }

  const parts = value.split("-");

  if (parts.length !== 3) {
    return normalizeText(value);
  }

  return `${parts[0]}-${parts[1]}-${parts[2]}`;
}

function normalizeRevision(value: string) {
  const numberOnly = value.replace(/\D/g, "");

  if (!numberOnly) {
    return "";
  }

  return `R${numberOnly.padStart(2, "0")}`;
}

function applyCaseMode(
  value: string,
  mode: CaseMode
) {
  if (mode === "uppercase") {
    return value.toUpperCase();
  }

  if (mode === "lowercase") {
    return value.toLowerCase();
  }

  return value
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : ""
    )
    .join(" ");
}