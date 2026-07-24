"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import JSZip from "jszip";

type ResolutionOption = {
  label: string;
  description: string;
  scale: number;
};

type ConvertedPage = {
  pageNumber: number;
  fileName: string;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
};

const resolutionOptions: ResolutionOption[] = [
  {
    label: "Standart",
    description: "Ekran görüntüleme ve hızlı dönüşüm",
    scale: 1.5,
  },
  {
    label: "Yüksek",
    description: "Sunumlar ve çoğu pafta kullanımı",
    scale: 2,
  },
  {
    label: "Çok yüksek",
    description: "Daha keskin çıktı, daha büyük dosya",
    scale: 3,
  },
];

const maxFileSize = 100 * 1024 * 1024;

export default function PdfToPngPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedScale, setSelectedScale] = useState(2);
  const [pageRange, setPageRange] = useState("");
  const [outputPrefix, setOutputPrefix] = useState("PAFTA");
  const [convertedPages, setConvertedPages] = useState<
    ConvertedPage[]
  >([]);

  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isPreparingZip, setIsPreparingZip] = useState(false);

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const totalConvertedSize = useMemo(
    () =>
      convertedPages.reduce(
        (total, page) => total + page.blob.size,
        0
      ),
    [convertedPages]
  );

  async function loadPdfJs() {
    const pdfjs = await import("pdfjs-dist");

    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    return pdfjs;
  }

  async function readPdf(file: File) {
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setMessage("Lütfen PDF formatında bir dosya seç.");
      return;
    }

    if (file.size > maxFileSize) {
      setMessage("PDF dosyası 100 MB sınırını aşıyor.");
      return;
    }

    clearConvertedPages();
    setPdfFile(null);
    setPageCount(0);
    setPageRange("");
    setMessage("");
    setIsReading(true);

    try {
      const pdfjs = await loadPdfJs();
      const bytes = new Uint8Array(await file.arrayBuffer());

      const pdf = await pdfjs.getDocument({
        data: bytes,
      }).promise;

      setPdfFile(file);
      setPageCount(pdf.numPages);
      setPageRange(`1-${pdf.numPages}`);
      setOutputPrefix(
        normalizeFileName(
          file.name.replace(/\.pdf$/i, "")
        ) || "PAFTA"
      );

      setMessage(
        `${pdf.numPages} sayfalık PDF başarıyla yüklendi.`
      );

      await pdf.destroy();
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

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      await readPdf(file);
    }
  }

  async function convertPdf() {
    if (!pdfFile || pageCount === 0) {
      setMessage("Önce bir PDF dosyası seç.");
      return;
    }

    const selectedPages = parsePageRange(
      pageRange,
      pageCount
    );

    if (selectedPages.length === 0) {
      setMessage(
        "Geçerli bir sayfa aralığı gir. Örneğin: 1-3, 5, 8"
      );
      return;
    }

    clearConvertedPages();
    setIsConverting(true);
    setProgress(0);
    setMessage("");

    try {
      const pdfjs = await loadPdfJs();
      const bytes = new Uint8Array(
        await pdfFile.arrayBuffer()
      );

      const pdf = await pdfjs.getDocument({
        data: bytes,
      }).promise;

      const newPages: ConvertedPage[] = [];

      for (
        let index = 0;
        index < selectedPages.length;
        index += 1
      ) {
        const pageNumber = selectedPages[index];
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: selectedScale,
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", {
          alpha: false,
        });

        if (!context) {
          throw new Error("Canvas context oluşturulamadı.");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        context.fillStyle = "#ffffff";
        context.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        await page.render({
          canvasContext: context,
          viewport,
          canvas,
        }).promise;

        const blob = await canvasToBlob(canvas);

        const fileName = `${normalizeFileName(
          outputPrefix
        )}_SAYFA_${String(pageNumber).padStart(
          2,
          "0"
        )}.png`;

        newPages.push({
          pageNumber,
          fileName,
          blob,
          previewUrl: URL.createObjectURL(blob),
          width: canvas.width,
          height: canvas.height,
        });

        page.cleanup();

        setProgress(
          Math.round(
            ((index + 1) / selectedPages.length) * 100
          )
        );
      }

      setConvertedPages(newPages);

      setMessage(
        `${newPages.length} sayfa PNG formatına dönüştürüldü.`
      );

      await pdf.destroy();
    } catch {
      setMessage(
        "PDF sayfaları dönüştürülürken bir sorun oluştu."
      );
    } finally {
      setIsConverting(false);
    }
  }

  function downloadPage(page: ConvertedPage) {
    triggerDownload(page.previewUrl, page.fileName);
  }

  async function downloadAllAsZip() {
    if (convertedPages.length === 0) {
      return;
    }

    setIsPreparingZip(true);
    setMessage("");

    try {
      const zip = new JSZip();
      const folderName =
        normalizeFileName(outputPrefix) || "PAFTA_PNG";

      const folder = zip.folder(folderName);

      if (!folder) {
        throw new Error("ZIP klasörü oluşturulamadı.");
      }

      convertedPages.forEach((page) => {
        folder.file(page.fileName, page.blob);
      });

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });

      const zipUrl = URL.createObjectURL(zipBlob);

      triggerDownload(
        zipUrl,
        `${folderName}_PNG.zip`
      );

      window.setTimeout(() => {
        URL.revokeObjectURL(zipUrl);
      }, 1000);

      setMessage(
        `${convertedPages.length} PNG dosyası ZIP olarak hazırlandı.`
      );
    } catch {
      setMessage(
        "ZIP dosyası hazırlanırken bir sorun oluştu."
      );
    } finally {
      setIsPreparingZip(false);
    }
  }

  function removePdf() {
    setPdfFile(null);
    setPageCount(0);
    setPageRange("");
    setProgress(0);
    setMessage("");
    clearConvertedPages();
  }

  function clearConvertedPages() {
    setConvertedPages((currentPages) => {
      currentPages.forEach((page) => {
        URL.revokeObjectURL(page.previewUrl);
      });

      return [];
    });
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
            href="/pdf-tools"
            className="transition hover:text-cyan-400"
          >
            PDF Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            PDF’den PNG’ye
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF’den PNG’ye Dönüştürme
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PDF sayfalarını yüksek çözünürlüklü PNG
            görsellerine dönüştür. Sayfaları ayrı ayrı veya
            tek ZIP dosyası içinde indir.
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
                    ▧
                  </div>

                  <p className="mt-5 text-lg font-semibold">
                    PDF dosyasını buraya bırak
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    En fazla 100 MB boyutunda bir PDF seç.
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
                Dönüşüm ayarları
              </h2>

              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-slate-300">
                  PNG çözünürlüğü
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {resolutionOptions.map((option) => {
                    const selected =
                      selectedScale === option.scale;

                    return (
                      <button
                        key={option.scale}
                        type="button"
                        onClick={() =>
                          setSelectedScale(option.scale)
                        }
                        className={`rounded-2xl border p-5 text-left transition ${
                          selected
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-slate-700 bg-slate-950 hover:border-slate-500"
                        }`}
                      >
                        <p
                          className={`font-semibold ${
                            selected
                              ? "text-cyan-300"
                              : "text-white"
                          }`}
                        >
                          {option.label}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {option.description}
                        </p>

                        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {option.scale}×
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div>
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

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Tüm sayfalar için 1-{pageCount || "10"} yaz.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="output-prefix"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Dosya adı başlangıcı
                  </label>

                  <input
                    id="output-prefix"
                    type="text"
                    value={outputPrefix}
                    onChange={(event) =>
                      setOutputPrefix(event.target.value)
                    }
                    placeholder="PAFTA"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Örnek: PAFTA_SAYFA_01.png
                  </p>
                </div>
              </div>
            </div>

            {convertedPages.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Dönüştürülen sayfalar
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      Görselleri ön izle ve ayrı ayrı indir.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearConvertedPages}
                    className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                  >
                    Sonuçları temizle
                  </button>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {convertedPages.map((page) => (
                    <div
                      key={page.pageNumber}
                      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"
                    >
                      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-800 p-3">
                        <img
                          src={page.previewUrl}
                          alt={`PDF sayfa ${page.pageNumber}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="p-4">
                        <p className="font-semibold text-white">
                          Sayfa {page.pageNumber}
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-400">
                          {page.fileName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {page.width} × {page.height} px
                          <span className="mx-2">•</span>
                          {formatFileSize(page.blob.size)}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            downloadPage(page)
                          }
                          className="mt-4 w-full rounded-xl border border-cyan-400/30 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                        >
                          PNG’yi indir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit space-y-5">
            <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Dönüşüm özeti
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <SummaryValue
                  label="PDF sayfası"
                  value={String(pageCount)}
                />

                <SummaryValue
                  label="PNG çıktısı"
                  value={String(convertedPages.length)}
                />
              </div>

              {convertedPages.length > 0 && (
                <div className="mt-4">
                  <SummaryValue
                    label="Toplam PNG boyutu"
                    value={formatFileSize(
                      totalConvertedSize
                    )}
                  />
                </div>
              )}

              {isConverting && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">
                      Dönüştürülüyor
                    </span>

                    <span className="font-semibold text-cyan-300">
                      %{progress}
                    </span>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={convertPdf}
                disabled={
                  !pdfFile ||
                  isReading ||
                  isConverting ||
                  isPreparingZip
                }
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConverting
                  ? `Dönüştürülüyor: %${progress}`
                  : "PDF’yi PNG’ye dönüştür"}
              </button>

              {convertedPages.length > 0 && (
                <button
                  type="button"
                  onClick={downloadAllAsZip}
                  disabled={
                    isConverting || isPreparingZip
                  }
                  className="mt-3 w-full rounded-xl border border-emerald-400/40 px-5 py-4 font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPreparingZip
                    ? "ZIP hazırlanıyor..."
                    : "Tümünü ZIP olarak indir"}
                </button>
              )}
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
                Tarayıcıda dönüşüm
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                PDF dosyası ve oluşturulan PNG görselleri
                cihazında işlenir. Dosyan PAFTA sunucusuna
                gönderilmez.
              </p>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Performans uyarısı
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Çok yüksek çözünürlükte ve çok sayfalı PDF’ler
                fazla bellek kullanabilir. Büyük dosyalarda
                sayfa aralığı seçerek işlem yap.
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

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(
          new Error("PNG dosyası oluşturulamadı.")
        );
      }
    }, "image/png");
  });
}

function parsePageRange(
  value: string,
  maximumPage: number
) {
  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return Array.from(
      { length: maximumPage },
      (_, index) => index + 1
    );
  }

  const pages = new Set<number>();
  const sections = cleanedValue.split(",");

  for (const section of sections) {
    const trimmedSection = section.trim();

    if (!trimmedSection) {
      continue;
    }

    if (trimmedSection.includes("-")) {
      const [startText, endText] =
        trimmedSection.split("-");

      const start = Number(startText);
      const end = Number(endText);

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