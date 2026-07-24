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

type CompressionPreset = {
  id: "light" | "balanced" | "strong";
  title: string;
  description: string;
  scale: number;
  jpegQuality: number;
};

const compressionPresets: CompressionPreset[] = [
  {
    id: "light",
    title: "Hafif sıkıştırma",
    description:
      "Daha yüksek görüntü kalitesi, daha büyük çıktı dosyası.",
    scale: 1.75,
    jpegQuality: 0.86,
  },
  {
    id: "balanced",
    title: "Dengeli",
    description:
      "Pafta, sunum ve genel kullanım için dengeli sonuç.",
    scale: 1.4,
    jpegQuality: 0.72,
  },
  {
    id: "strong",
    title: "Güçlü sıkıştırma",
    description:
      "Daha küçük dosya, görüntü kalitesinde daha fazla kayıp.",
    scale: 1,
    jpegQuality: 0.55,
  },
];

const maxFileSize = 150 * 1024 * 1024;

export default function CompressPdfPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const [selectedPreset, setSelectedPreset] =
    useState<CompressionPreset["id"]>("balanced");

  const [outputName, setOutputName] = useState(
    "PAFTA_SIKISTIRILMIS"
  );

  const [compressedBlob, setCompressedBlob] =
    useState<Blob | null>(null);

  const [compressedUrl, setCompressedUrl] =
    useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const preset = useMemo(
    () =>
      compressionPresets.find(
        (item) => item.id === selectedPreset
      ) ?? compressionPresets[1],
    [selectedPreset]
  );

  const compressionResult = useMemo(() => {
    if (!pdfFile || !compressedBlob) {
      return null;
    }

    const originalSize = pdfFile.size;
    const compressedSize = compressedBlob.size;

    const savedBytes = originalSize - compressedSize;
    const savedPercent =
      originalSize > 0
        ? (savedBytes / originalSize) * 100
        : 0;

    return {
      originalSize,
      compressedSize,
      savedBytes,
      savedPercent,
      isSmaller: compressedSize < originalSize,
    };
  }, [pdfFile, compressedBlob]);

  async function loadPdfJs() {
    const pdfjs = await import("pdfjs-dist");

    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    return pdfjs;
  }

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

    clearCompressedResult();

    setPdfFile(null);
    setPageCount(0);
    setProgress(0);
    setMessage("");
    setIsReading(true);

    try {
      const pdfjs = await loadPdfJs();

      const bytes = new Uint8Array(
        await file.arrayBuffer()
      );

      const loadingTask = pdfjs.getDocument({
        data: bytes,
      });

      const pdf = await loadingTask.promise;

      setPdfFile(file);
      setPageCount(pdf.numPages);

      setOutputName(
        `${normalizeFileName(
          file.name.replace(/\.pdf$/i, "")
        )}_SIKISTIRILMIS`
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

  async function compressPdf() {
    if (!pdfFile || pageCount === 0) {
      setMessage("Önce bir PDF dosyası seç.");
      return;
    }

    clearCompressedResult();

    setIsCompressing(true);
    setProgress(0);
    setMessage("");

    try {
      const pdfjs = await loadPdfJs();

      const sourceBytes = new Uint8Array(
        await pdfFile.arrayBuffer()
      );

      const loadingTask = pdfjs.getDocument({
        data: sourceBytes,
      });

      const sourcePdf = await loadingTask.promise;

      const outputPdf = await PDFDocument.create();

      outputPdf.setCreator("PAFTA");
      outputPdf.setProducer("PAFTA PDF Araçları");
      outputPdf.setCreationDate(new Date());
      outputPdf.setModificationDate(new Date());

      for (
        let pageNumber = 1;
        pageNumber <= sourcePdf.numPages;
        pageNumber += 1
      ) {
        const sourcePage =
          await sourcePdf.getPage(pageNumber);

        const originalViewport =
          sourcePage.getViewport({
            scale: 1,
          });

        const renderViewport =
          sourcePage.getViewport({
            scale: preset.scale,
          });

        const canvas =
          document.createElement("canvas");

        const context = canvas.getContext("2d", {
          alpha: false,
        });

        if (!context) {
          throw new Error(
            "Canvas alanı oluşturulamadı."
          );
        }

        canvas.width = Math.ceil(
          renderViewport.width
        );

        canvas.height = Math.ceil(
          renderViewport.height
        );

        context.fillStyle = "#ffffff";

        context.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        await sourcePage.render({
          canvasContext: context,
          viewport: renderViewport,
          canvas,
        }).promise;

        const jpegBlob = await canvasToJpegBlob(
          canvas,
          preset.jpegQuality
        );

        const jpegBytes =
          await jpegBlob.arrayBuffer();

        const embeddedImage =
          await outputPdf.embedJpg(jpegBytes);

        const outputPage = outputPdf.addPage([
          originalViewport.width,
          originalViewport.height,
        ]);

        outputPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: originalViewport.width,
          height: originalViewport.height,
        });

        sourcePage.cleanup();

        canvas.width = 1;
        canvas.height = 1;

        setProgress(
          Math.round(
            (pageNumber / sourcePdf.numPages) * 100
          )
        );
      }

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

      const url = URL.createObjectURL(blob);

      setCompressedBlob(blob);
      setCompressedUrl(url);

      if (blob.size < pdfFile.size) {
        const savedPercent =
          ((pdfFile.size - blob.size) /
            pdfFile.size) *
          100;

        setMessage(
          `PDF başarıyla hazırlandı. Dosya boyutu yaklaşık %${formatNumber(
            savedPercent
          )} azaltıldı.`
        );
      } else {
        setMessage(
          "PDF hazırlandı ancak çıktı dosyası orijinalden daha küçük olmadı. Daha güçlü sıkıştırma seçeneğini dene."
        );
      }

      await loadingTask.destroy();
    } catch {
      setMessage(
        "PDF sıkıştırılırken bir sorun oluştu. Şifreli, bozuk veya çok büyük bir dosya olup olmadığını kontrol et."
      );
    } finally {
      setIsCompressing(false);
    }
  }

  function downloadCompressedPdf() {
    if (!compressedUrl) {
      return;
    }

    const link = document.createElement("a");

    link.href = compressedUrl;
    link.download = createOutputFileName(outputName);

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function removePdf() {
    setPdfFile(null);
    setPageCount(0);
    setProgress(0);
    setMessage("");
    setOutputName("PAFTA_SIKISTIRILMIS");

    clearCompressedResult();
  }

  function clearCompressedResult() {
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }

    setCompressedBlob(null);
    setCompressedUrl(null);
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
            PDF Sıkıştırma
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF Sıkıştırma
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PDF dosyanın görüntü kalitesi ile dosya boyutu
            arasındaki dengeyi seçerek daha küçük bir PDF
            oluştur.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                PDF dosyasını seç
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Bir PDF seçebilir veya dosyayı aşağıdaki
                alana sürükleyebilirsin.
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
                      event.currentTarget ===
                      event.target
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
                    ⇲
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
                        <span className="mx-2">
                          •
                        </span>
                        {formatFileSize(
                          pdfFile.size
                        )}
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
                Sıkıştırma seviyesi
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Daha güçlü sıkıştırma daha küçük dosya
                oluşturur ancak görüntü kalitesini azaltabilir.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {compressionPresets.map((option) => {
                  const selected =
                    selectedPreset === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(option.id);
                        clearCompressedResult();
                      }}
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
                        {option.title}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
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
                      setOutputName(
                        event.target.value
                      )
                    }
                    placeholder="PAFTA_SIKISTIRILMIS"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                  />

                  <span className="border-l border-slate-700 px-4 text-slate-400">
                    .pdf
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Sıkıştırma yöntemi hakkında
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Bu araç PDF sayfalarını sıkıştırılmış
                görseller olarak yeniden oluşturur. Bu nedenle
                metin seçme, metin arama, bağlantılar, form
                alanları ve bazı PDF katmanları yeni dosyada
                korunmayabilir.
              </p>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Sıkıştırma özeti
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <SummaryValue
                  label="Sayfa"
                  value={String(pageCount)}
                />

                <SummaryValue
                  label="Orijinal"
                  value={
                    pdfFile
                      ? formatFileSize(pdfFile.size)
                      : "—"
                  }
                />
              </div>

              {compressionResult && (
                <>
                  <div className="mt-4">
                    <SummaryValue
                      label="Yeni dosya"
                      value={formatFileSize(
                        compressionResult.compressedSize
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <SummaryValue
                      label={
                        compressionResult.isSmaller
                          ? "Boyut azalması"
                          : "Boyut değişimi"
                      }
                      value={
                        compressionResult.isSmaller
                          ? `%${formatNumber(
                              compressionResult.savedPercent
                            )}`
                          : "Küçülmedi"
                      }
                    />
                  </div>
                </>
              )}

              {isCompressing && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">
                      Sıkıştırılıyor
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
                onClick={compressPdf}
                disabled={
                  !pdfFile ||
                  isReading ||
                  isCompressing
                }
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCompressing
                  ? `Sıkıştırılıyor: %${progress}`
                  : "PDF’yi sıkıştır"}
              </button>

              {compressedUrl && (
                <button
                  type="button"
                  onClick={downloadCompressedPdf}
                  className="mt-3 w-full rounded-xl border border-emerald-400/40 px-5 py-4 font-semibold text-emerald-300 transition hover:bg-emerald-400/10"
                >
                  Sıkıştırılmış PDF’yi indir
                </button>
              )}
            </section>

            {compressionResult &&
              !compressionResult.isSmaller && (
                <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
                  <p className="font-semibold text-amber-300">
                    Dosya küçülmedi
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Orijinal PDF zaten optimize edilmiş olabilir.
                    Güçlü sıkıştırmayı deneyebilir veya orijinal
                    dosyayı kullanmaya devam edebilirsin.
                  </p>
                </section>
              )}

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
                PDF dosyası bu tarayıcıda işlenir. Dosyan
                sıkıştırma için PAFTA sunucusuna gönderilmez.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="font-semibold text-white">
                Hangi seviyeyi seçmelisin?
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Baskı veya büyük paftalarda hafif, dijital
                teslimlerde dengeli, yalnızca dosya sınırını
                aşmamak için güçlü sıkıştırmayı kullan.
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

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(
            new Error(
              "JPEG görüntüsü oluşturulamadı."
            )
          );
        }
      },
      "image/jpeg",
      quality
    );
  });
}

function createOutputFileName(value: string) {
  const normalizedName = normalizeFileName(
    value.replace(/\.pdf$/i, "")
  );

  return `${
    normalizedName || "PAFTA_SIKISTIRILMIS"
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

function formatNumber(value: number) {
  return value.toLocaleString("tr-TR", {
    maximumFractionDigits: 1,
  });
}

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 KB";
  }

  const units = ["B", "KB", "MB", "GB"];

  const unitIndex = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    ),
    units.length - 1
  );

  const value =
    bytes / 1024 ** unitIndex;

  return `${value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  })} ${units[unitIndex]}`;
}