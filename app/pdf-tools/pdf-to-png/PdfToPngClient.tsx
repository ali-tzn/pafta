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
import { trackToolEvent } from "@/lib/analytics";

type ResolutionOption = {
  label: string;
  description: string;
  dpi: number;
};

type OutputFormat = "png" | "jpeg";

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
    dpi: 96,
  },
  {
    label: "Yüksek",
    description: "Sunumlar ve çoğu pafta kullanımı",
    dpi: 150,
  },
  {
    label: "Baskı",
    description: "Büyük pafta ve keskin baskı çıktısı",
    dpi: 300,
  },
];

const maxFileSize = 100 * 1024 * 1024;

export default function PdfToPngClient({
  frequentlyAskedQuestions,
}: {
  frequentlyAskedQuestions: {
    question: string;
    answer: string;
  }[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedDpi, setSelectedDpi] = useState(150);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [jpegQuality, setJpegQuality] = useState(90);
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

      const loadingTask = pdfjs.getDocument({
        data: bytes,
      });
      const pdf = await loadingTask.promise;

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

      await loadingTask.destroy();
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

      const loadingTask = pdfjs.getDocument({
        data: bytes,
      });
      const pdf = await loadingTask.promise;

      const newPages: ConvertedPage[] = [];

      for (
        let index = 0;
        index < selectedPages.length;
        index += 1
      ) {
        const pageNumber = selectedPages[index];
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: selectedDpi / 72,
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

        const blob = await canvasToBlob(
          canvas,
          outputFormat,
          jpegQuality / 100
        );
        const extension = outputFormat === "png" ? "png" : "jpg";

        const fileName = `${normalizeFileName(
          outputPrefix
        )}_SAYFA_${String(pageNumber).padStart(
          2,
          "0"
        )}.${extension}`;

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
        `${newPages.length} sayfa ${outputFormat === "png" ? "PNG" : "JPG"} formatına dönüştürüldü.`
      );
      trackToolEvent("pdf_to_image", "completed", {
        page_count: newPages.length,
        output_format: outputFormat,
        dpi: selectedDpi,
      });

      await loadingTask.destroy();
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
        normalizeFileName(outputPrefix) ||
        `PAFTA_${outputFormat === "png" ? "PNG" : "JPG"}`;

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
        `${folderName}_${outputFormat === "png" ? "PNG" : "JPG"}.zip`
      );

      window.setTimeout(() => {
        URL.revokeObjectURL(zipUrl);
      }, 1000);

      setMessage(
        `${convertedPages.length} ${outputFormat === "png" ? "PNG" : "JPG"} dosyası ZIP olarak hazırlandı.`
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
            PDF’yi PNG veya JPG’ye Dönüştür
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PDF sayfalarını 96, 150 veya 300 DPI çözünürlükte PNG ya da JPG
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
                  Çıktı çözünürlüğü
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {resolutionOptions.map((option) => {
                    const selected =
                      selectedDpi === option.dpi;

                    return (
                      <button
                        key={option.dpi}
                        type="button"
                        onClick={() =>
                          setSelectedDpi(option.dpi)
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
                          {option.dpi} DPI
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-300">
                    Çıktı formatı
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ["png", "PNG", "Çizgi ve yazılar için"],
                      ["jpeg", "JPG", "Daha küçük dosya için"],
                    ] as const).map(([value, label, detail]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setOutputFormat(value);
                          clearConvertedPages();
                        }}
                        className={`rounded-xl border p-4 text-left ${
                          outputFormat === value
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-slate-700 bg-slate-950"
                        }`}
                      >
                        <strong>{label}</strong>
                        <span className="mt-1 block text-xs text-slate-500">
                          {detail}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {outputFormat === "jpeg" && (
                  <label className="block">
                    <span className="text-sm font-medium text-slate-300">
                      JPG kalitesi: %{jpegQuality}
                    </span>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={jpegQuality}
                      onChange={(event) =>
                        setJpegQuality(Number(event.target.value))
                      }
                      className="mt-5 w-full accent-cyan-400"
                    />
                    <span className="mt-2 block text-xs text-slate-500">
                      Düşük kalite daha küçük, yüksek kalite daha net dosya oluşturur.
                    </span>
                  </label>
                )}
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
                    Örnek: PAFTA_SAYFA_01.
                    {outputFormat === "png" ? "png" : "jpg"}
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
                        {/* Blob URL is generated locally and cannot use next/image. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={page.previewUrl}
                          alt={`PDF sayfa ${page.pageNumber}`}
                          loading="lazy"
                          decoding="async"
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
                          {outputFormat === "png" ? "PNG" : "JPG"}’yi indir
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
                  label={`${outputFormat === "png" ? "PNG" : "JPG"} çıktısı`}
                  value={String(convertedPages.length)}
                />
              </div>

              {convertedPages.length > 0 && (
                <div className="mt-4">
                  <SummaryValue
                    label={`Toplam ${outputFormat === "png" ? "PNG" : "JPG"} boyutu`}
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
                  : `PDF’yi ${outputFormat === "png" ? "PNG" : "JPG"}’ye dönüştür`}
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

        <section className="mt-16 border-t border-slate-800 pt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Kullanım rehberi
          </p>
          <h2 className="mt-3 text-3xl font-bold">
                PDF’den görsele nasıl dönüştürülür?
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                "1. PDF dosyanı seç",
                "Dosyanı seçim alanına sürükle veya PDF dosyası seç düğmesini kullan.",
              ],
              [
                "2. Çıktıyı ayarla",
                "Çözünürlüğü, dönüştürülecek sayfaları ve dosya adı başlangıcını belirle.",
              ],
              [
                "3. PNG’leri indir",
                "Sayfaları ayrı ayrı indir veya tüm görselleri tek bir ZIP dosyasında al.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
              >
                <h3 className="text-lg font-semibold text-cyan-300">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-8 rounded-3xl border border-slate-800 bg-slate-900 p-7 lg:grid-cols-2 lg:p-10">
          <div>
            <h2 className="text-2xl font-bold">
              Mimari paftalar için çözünürlük seçimi
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              PDF içindeki vektörel çizgiler PNG’ye çevrildiğinde piksellere
              dönüşür. Büyük paftalarda küçük yazıların, ölçülerin ve ince
              çizgilerin okunabilirliği için daha yüksek çözünürlük seçmek
              önemlidir.
            </p>
            <p className="mt-4 leading-7 text-slate-300">
              Ekranda hızlı ön izleme için Standart; portfolyo ve dijital
              sunumlar için Yüksek; büyük paftalar ve yakınlaştırıldığında
              daha keskin görüntü için Çok yüksek seçeneğini kullanabilirsin.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">DPI ne anlama gelir?</h2>
            <p className="mt-4 leading-7 text-slate-300">
              DPI, baskıda bir inç içindeki nokta yoğunluğunu ifade eder.
              PDF’yi PNG’ye dönüştürürken son kalite yalnızca DPI etiketine
              değil, oluşturulan görselin piksel ölçülerine de bağlıdır.
              PAFTA’daki seçenekler sayfayı daha yüksek piksel ölçülerinde
              oluşturarak çizgi ve metinleri keskinleştirir.
            </p>
            <p className="mt-4 leading-7 text-slate-300">
              Baskı alınacak dosyalarda PNG’yi göndermeden önce hedef kâğıt
              ölçüsü ve gerekli kaliteyi matbaayla doğrulamanı öneririz.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-bold">
            PNG, JPG ve çözünürlük seçimi
          </h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            Doğru çıktı ayarı kullanım amacına bağlıdır. Çizgi, yazı ve
            şeffaflık gereken paftalarda PNG; daha küçük dosya istenen fotoğraf
            ağırlıklı sunumlarda JPG daha uygun olabilir.
          </p>
          <div className="mt-7 overflow-hidden rounded-3xl border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-slate-900 text-sm text-slate-300">
                  <tr>
                    <th className="px-6 py-4">Kullanım</th>
                    <th className="px-6 py-4">Öneri</th>
                    <th className="px-6 py-4">Neden?</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-950 text-sm text-slate-400">
                  {[
                    ["Hızlı ekran ön izlemesi", "PNG/JPG · 96 DPI", "Daha hızlı dönüşüm ve daha küçük çıktı"],
                    ["Portfolyo ve dijital sunum", "PNG · 150 DPI", "Metin ve çizgiler için dengeli keskinlik"],
                    ["Büyük pafta ve yakın inceleme", "PNG · 300 DPI", "İnce çizgi ve küçük yazılarda daha fazla piksel"],
                    ["Fotoğraf ağırlıklı sayfa", "JPG · 150 DPI", "Ayarlanabilir kaliteyle daha küçük dosya"],
                  ].map(([usage, suggestion, reason]) => (
                    <tr key={usage} className="border-t border-slate-800">
                      <td className="px-6 py-4 font-semibold text-white">{usage}</td>
                      <td className="px-6 py-4 text-cyan-300">{suggestion}</td>
                      <td className="px-6 py-4">{reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-7">
          <h2 className="text-2xl font-bold text-amber-200">
            Dönüştürürken sık yapılan hatalar
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Gereksiz yere 300 DPI seçmek", "Çok sayfalı ve büyük ebatlı PDF’lerde bellek kullanımı hızla artar. Ön izleme için 96 veya 150 DPI yeterlidir."],
              ["JPG kalitesini fazla düşürmek", "Düşük kalite küçük yazıların ve ince çizgilerin çevresinde bozulma oluşturabilir. Mimari çizimde PNG daha güvenlidir."],
              ["Piksel boyutunu kontrol etmemek", "DPI tek başına kalite garantisi değildir. İndirdiğin görselin piksel ölçülerini ve hedef kullanımını birlikte değerlendir."],
              ["Orijinal PDF’yi silmek", "PNG ve JPG piksellidir; vektörel PDF kadar esnek değildir. Düzenleme ve baskı için kaynak PDF’yi sakla."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl bg-slate-950/70 p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-bold">Sık sorulan sorular</h2>
          <div className="mt-7 space-y-4">
            {frequentlyAskedQuestions.map((item) => (
              <details
                key={item.question}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <summary className="cursor-pointer list-none pr-6 font-semibold text-white">
                  {item.question}
                </summary>
                <p className="mt-4 leading-7 text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-7">
          <h2 className="text-2xl font-bold text-cyan-300">
            Diğer ücretsiz PDF araçları
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/pdf-tools/merge", "PDF birleştirme"],
              ["/pdf-tools/compress", "PDF sıkıştırma"],
              ["/pdf-tools/split", "PDF sayfalarını ayırma"],
              ["/pdf-tools/resize-pages", "Pafta boyutu ve ölçek ayarlama"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl border border-cyan-300/30 bg-slate-950 px-4 py-3 font-semibold text-cyan-300 transition hover:border-cyan-300"
              >
                {label} →
              </Link>
            ))}
          </div>
        </section>
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

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(
          new Error("Görsel dosyası oluşturulamadı.")
        );
      }
    }, format === "png" ? "image/png" : "image/jpeg", quality);
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
