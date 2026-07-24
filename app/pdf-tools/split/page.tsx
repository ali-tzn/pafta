"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

const maxFileSize = 150 * 1024 * 1024;

export default function SplitPdfPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [outputName, setOutputName] = useState("PAFTA_AYRILMIS");

  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isPreparingZip, setIsPreparingZip] = useState(false);

  const [message, setMessage] = useState("");

  const selectedPages = useMemo(
    () => parsePageRange(pageRange, pageCount),
    [pageRange, pageCount]
  );

  async function readPdf(file: File) {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setMessage("Lütfen PDF formatında bir dosya seç.");
      return;
    }

    if (file.size > maxFileSize) {
      setMessage("PDF dosyası 150 MB sınırını aşıyor.");
      return;
    }

    setPdfFile(null);
    setPageCount(0);
    setPageRange("");
    setMessage("");
    setIsReading(true);

    try {
      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
      });

      setPdfFile(file);
      setPageCount(pdf.getPageCount());
      setPageRange(`1-${pdf.getPageCount()}`);
      setOutputName(
        `${normalizeFileName(
          file.name.replace(/\.pdf$/i, "")
        )}_AYRILMIS`
      );

      setMessage(
        `${pdf.getPageCount()} sayfalık PDF başarıyla yüklendi.`
      );
    } catch {
      setMessage(
        "PDF okunamadı. Dosya bozuk, şifreli veya desteklenmeyen bir yapıda olabilir."
      );
    } finally {
      setIsReading(false);
    }
  }

  async function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      await readPdf(file);
    }

    event.target.value = "";
  }

  async function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      await readPdf(file);
    }
  }

  async function createSelectedPdf() {
    if (!pdfFile) {
      setMessage("Önce bir PDF dosyası seç.");
      return;
    }

    if (selectedPages.length === 0) {
      setMessage(
        "Geçerli bir sayfa aralığı gir. Örneğin: 1-3, 5, 8"
      );
      return;
    }

    setIsCreating(true);
    setMessage("");

    try {
      const sourceBytes = await pdfFile.arrayBuffer();

      const sourcePdf = await PDFDocument.load(sourceBytes, {
        ignoreEncryption: false,
      });

      const outputPdf = await PDFDocument.create();

      const pageIndices = selectedPages.map(
        (pageNumber) => pageNumber - 1
      );

      const copiedPages = await outputPdf.copyPages(
        sourcePdf,
        pageIndices
      );

      copiedPages.forEach((page) => {
        outputPdf.addPage(page);
      });

      outputPdf.setCreator("PAFTA");
      outputPdf.setProducer("PAFTA PDF Araçları");
      outputPdf.setCreationDate(new Date());
      outputPdf.setModificationDate(new Date());

      const outputBytes = await outputPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      const outputBuffer =
        outputBytes.slice().buffer as ArrayBuffer;

      const blob = new Blob([outputBuffer], {
        type: "application/pdf",
      });

      const downloadUrl = URL.createObjectURL(blob);

      triggerDownload(
        downloadUrl,
        createOutputFileName(outputName)
      );

      window.setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      setMessage(
        `${selectedPages.length} sayfalık yeni PDF oluşturuldu.`
      );
    } catch {
      setMessage(
        "Seçilen sayfalardan PDF oluşturulurken bir sorun oluştu."
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function downloadPagesAsZip() {
    if (!pdfFile) {
      setMessage("Önce bir PDF dosyası seç.");
      return;
    }

    if (selectedPages.length === 0) {
      setMessage(
        "Geçerli bir sayfa aralığı gir. Örneğin: 1-3, 5, 8"
      );
      return;
    }

    setIsPreparingZip(true);
    setMessage("");

    try {
      const sourceBytes = await pdfFile.arrayBuffer();

      const sourcePdf = await PDFDocument.load(sourceBytes, {
        ignoreEncryption: false,
      });

      const zip = new JSZip();
      const folderName =
        normalizeFileName(outputName) || "PAFTA_SAYFALAR";

      const folder = zip.folder(folderName);

      if (!folder) {
        throw new Error("ZIP klasörü oluşturulamadı.");
      }

      for (const pageNumber of selectedPages) {
        const singlePdf = await PDFDocument.create();

        const [copiedPage] = await singlePdf.copyPages(
          sourcePdf,
          [pageNumber - 1]
        );

        singlePdf.addPage(copiedPage);
        singlePdf.setCreator("PAFTA");
        singlePdf.setProducer("PAFTA PDF Araçları");

        const pageBytes = await singlePdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50,
        });

        const pageBuffer =
          pageBytes.slice().buffer as ArrayBuffer;

        folder.file(
          `${folderName}_SAYFA_${String(pageNumber).padStart(
            2,
            "0"
          )}.pdf`,
          pageBuffer
        );
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });

      const zipUrl = URL.createObjectURL(zipBlob);

      triggerDownload(zipUrl, `${folderName}.zip`);

      window.setTimeout(() => {
        URL.revokeObjectURL(zipUrl);
      }, 1000);

      setMessage(
        `${selectedPages.length} sayfa ayrı PDF dosyaları halinde hazırlandı.`
      );
    } catch {
      setMessage(
        "Sayfalar ayrı PDF dosyalarına dönüştürülürken bir sorun oluştu."
      );
    } finally {
      setIsPreparingZip(false);
    }
  }

  function removePdf() {
    setPdfFile(null);
    setPageCount(0);
    setPageRange("");
    setOutputName("PAFTA_AYRILMIS");
    setMessage("");
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
            href="/pdf-tools"
            className="transition hover:text-cyan-400"
          >
            PDF Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            PDF Sayfalarını Ayır
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF Sayfalarını Ayır
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PDF içinden istediğin sayfaları seç, tek bir yeni PDF
            oluştur veya sayfaları ayrı PDF dosyaları halinde indir.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                PDF dosyasını seç
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Bir PDF seçebilir veya dosyayı aşağıdaki alana
                sürükleyebilirsin.
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleInputChange}
                className="hidden"
              />

              {!pdfFile ? (
                <div
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();

                    if (
                      event.currentTarget === event.target
                    ) {
                      setIsDragging(false);
                    }
                  }}
                  onDrop={handleDrop}
                  className={`mt-6 rounded-3xl border-2 border-dashed p-10 text-center transition ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-950"
                  }`}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-3xl text-cyan-300">
                    ✂
                  </div>

                  <p className="mt-5 text-lg font-semibold">
                    PDF dosyasını buraya bırak
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    En fazla 150 MB boyutunda bir PDF seç.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      inputRef.current?.click()
                    }
                    disabled={isReading}
                    className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isReading
                      ? "PDF okunuyor..."
                      : "PDF dosyası seç"}
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {pdfFile.name}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        {pageCount} sayfa
                        <span className="mx-2">•</span>
                        {formatFileSize(pdfFile.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removePdf}
                      className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                    >
                      PDF’yi kaldır
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Sayfa seçimi
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="page-range"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Sayfa aralığı
                </label>

                <input
                  id="page-range"
                  type="text"
                  value={pageRange}
                  onChange={(event) =>
                    setPageRange(event.target.value)
                  }
                  placeholder="Örneğin: 1-3, 5, 8"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Aralıkları tire ile, ayrı sayfaları virgülle yaz.
                  Örnek: 1-4, 7, 10-12
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Seçilen sayfalar
                </p>

                <p className="mt-3 break-words text-sm leading-6 text-slate-400">
                  {selectedPages.length > 0
                    ? selectedPages.join(", ")
                    : "Geçerli bir sayfa seçimi bulunmuyor."}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Çıktı ayarları
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="output-name"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Oluşturulacak dosyanın adı
                </label>

                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 focus-within:border-cyan-400">
                  <input
                    id="output-name"
                    type="text"
                    value={outputName}
                    onChange={(event) =>
                      setOutputName(event.target.value)
                    }
                    placeholder="PAFTA_AYRILMIS"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                  />

                  <span className="border-l border-slate-700 px-4 text-slate-400">
                    .pdf
                  </span>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Ayırma özeti
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <SummaryValue
                  label="Toplam sayfa"
                  value={String(pageCount)}
                />

                <SummaryValue
                  label="Seçilen sayfa"
                  value={String(selectedPages.length)}
                />
              </div>

              <button
                type="button"
                onClick={createSelectedPdf}
                disabled={
                  !pdfFile ||
                  selectedPages.length === 0 ||
                  isReading ||
                  isCreating ||
                  isPreparingZip
                }
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating
                  ? "PDF oluşturuluyor..."
                  : "Seçilen sayfaları PDF yap"}
              </button>

              <button
                type="button"
                onClick={downloadPagesAsZip}
                disabled={
                  !pdfFile ||
                  selectedPages.length === 0 ||
                  isReading ||
                  isCreating ||
                  isPreparingZip
                }
                className="mt-3 w-full rounded-xl border border-emerald-400/40 px-5 py-4 font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPreparingZip
                  ? "ZIP hazırlanıyor..."
                  : "Her sayfayı ayrı PDF indir"}
              </button>
            </section>

            {message && (
              <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
                <p className="text-sm leading-6 text-slate-300">
                  {message}
                </p>
              </section>
            )}

            <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
              <p className="font-semibold text-emerald-300">
                Dosyan cihazında kalır
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Sayfa ayırma işlemi tarayıcında gerçekleştirilir.
                PDF dosyan PAFTA sunucusuna gönderilmez.
              </p>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Sayfa sırası
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Yeni PDF’de sayfalar küçükten büyüğe sıralanır.
                Aynı sayfa birden fazla kez eklenmez.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SummaryValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function parsePageRange(
  value: string,
  maximumPage: number
) {
  if (maximumPage <= 0) {
    return [];
  }

  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return [];
  }

  const pages = new Set<number>();
  const sections = cleanedValue.split(",");

  for (const section of sections) {
    const trimmedSection = section.trim();

    if (!trimmedSection) {
      continue;
    }

    if (trimmedSection.includes("-")) {
      const parts = trimmedSection.split("-");

      if (parts.length !== 2) {
        return [];
      }

      const start = Number(parts[0]);
      const end = Number(parts[1]);

      if (
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 1 ||
        end < start ||
        end > maximumPage
      ) {
        return [];
      }

      for (let page = start; page <= end; page += 1) {
        pages.add(page);
      }
    } else {
      const page = Number(trimmedSection);

      if (
        !Number.isInteger(page) ||
        page < 1 ||
        page > maximumPage
      ) {
        return [];
      }

      pages.add(page);
    }
  }

  return Array.from(pages).sort(
    (first, second) => first - second
  );
}

function triggerDownload(url: string, fileName: string) {
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();
}

function createOutputFileName(value: string) {
  const normalizedName = normalizeFileName(
    value.replace(/\.pdf$/i, "")
  );

  return `${
    normalizedName || "PAFTA_AYRILMIS"
  }.pdf`;
}

function normalizeFileName(value: string) {
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
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[_-]+|[_-]+$/g, "")
    .toUpperCase();
}

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 KB";
  }

  const units = ["B", "KB", "MB", "GB"];

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / 1024 ** unitIndex;

  return `${value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  })} ${units[unitIndex]}`;
}