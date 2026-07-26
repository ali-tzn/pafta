"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";
import { degrees, PDFDocument } from "pdf-lib";

type PdfPageItem = {
  id: string;
  originalPageIndex: number;
  pageNumber: number;
  previewUrl: string;
  rotation: number;
};

const maxFileSize = 150 * 1024 * 1024;

export default function OrganizePdfPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageItem[]>([]);
  const [outputName, setOutputName] = useState(
    "PAFTA_DUZENLENMIS"
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

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

    clearPreviewUrls();

    setPdfFile(null);
    setPages([]);
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

      const pageItems: PdfPageItem[] = [];

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber += 1
      ) {
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: 0.35,
        });

        const canvas =
          document.createElement("canvas");

        const context = canvas.getContext("2d", {
          alpha: false,
        });

        if (!context) {
          throw new Error(
            "Ön izleme alanı oluşturulamadı."
          );
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

        const previewBlob =
          await canvasToPngBlob(canvas);

        const previewUrl =
          URL.createObjectURL(previewBlob);

        pageItems.push({
          id: createId(),
          originalPageIndex: pageNumber - 1,
          pageNumber,
          previewUrl,
          rotation: 0,
        });

        page.cleanup();

        canvas.width = 1;
        canvas.height = 1;

        setProgress(
          Math.round(
            (pageNumber / pdf.numPages) * 100
          )
        );
      }

      setPdfFile(file);
      setPages(pageItems);

      setOutputName(
        `${normalizeFileName(
          file.name.replace(/\.pdf$/i, "")
        )}_DUZENLENMIS`
      );

      setMessage(
        `${pdf.numPages} sayfalık PDF başarıyla yüklendi.`
      );

      await loadingTask.destroy();
    } catch {
      clearPreviewUrls();

      setPdfFile(null);
      setPages([]);

      setMessage(
        "PDF okunamadı. Dosya bozuk, şifreli veya desteklenmeyen bir yapıda olabilir."
      );
    } finally {
      setIsReading(false);
      setProgress(0);
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

  function movePage(
    id: string,
    direction: "up" | "down"
  ) {
    setPages((currentPages) => {
      const currentIndex =
        currentPages.findIndex(
          (page) => page.id === id
        );

      if (currentIndex === -1) {
        return currentPages;
      }

      const targetIndex =
        direction === "up"
          ? currentIndex - 1
          : currentIndex + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= currentPages.length
      ) {
        return currentPages;
      }

      const updatedPages = [...currentPages];

      const currentPage =
        updatedPages[currentIndex];

      updatedPages[currentIndex] =
        updatedPages[targetIndex];

      updatedPages[targetIndex] =
        currentPage;

      return updatedPages;
    });

    setMessage("");
  }

  function movePageToStart(id: string) {
    setPages((currentPages) => {
      const currentIndex =
        currentPages.findIndex(
          (page) => page.id === id
        );

      if (currentIndex <= 0) {
        return currentPages;
      }

      const updatedPages = [...currentPages];
      const [selectedPage] = updatedPages.splice(
        currentIndex,
        1
      );

      updatedPages.unshift(selectedPage);

      return updatedPages;
    });

    setMessage("");
  }

  function movePageToEnd(id: string) {
    setPages((currentPages) => {
      const currentIndex =
        currentPages.findIndex(
          (page) => page.id === id
        );

      if (
        currentIndex === -1 ||
        currentIndex === currentPages.length - 1
      ) {
        return currentPages;
      }

      const updatedPages = [...currentPages];
      const [selectedPage] = updatedPages.splice(
        currentIndex,
        1
      );

      updatedPages.push(selectedPage);

      return updatedPages;
    });

    setMessage("");
  }

  function rotatePage(id: string) {
    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === id
          ? {
              ...page,
              rotation:
                (page.rotation + 90) % 360,
            }
          : page
      )
    );

    setMessage("");
  }

  function deletePage(id: string) {
    setPages((currentPages) => {
      const removedPage = currentPages.find(
        (page) => page.id === id
      );

      if (removedPage) {
        URL.revokeObjectURL(
          removedPage.previewUrl
        );
      }

      return currentPages.filter(
        (page) => page.id !== id
      );
    });

    setMessage("");
  }

  function reversePages() {
    setPages((currentPages) => [
      ...currentPages,
    ].reverse());

    setMessage("");
  }

  function resetPageOrder() {
    setPages((currentPages) =>
      [...currentPages]
        .sort(
          (first, second) =>
            first.originalPageIndex -
            second.originalPageIndex
        )
        .map((page) => ({
          ...page,
          rotation: 0,
        }))
    );

    setMessage(
      "Sayfa sırası ve dönüşleri başlangıç durumuna getirildi."
    );
  }

  async function createOrganizedPdf() {
    if (!pdfFile) {
      setMessage("Önce bir PDF dosyası seç.");
      return;
    }

    if (pages.length === 0) {
      setMessage(
        "PDF oluşturmak için en az bir sayfa bırakmalısın."
      );
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setMessage("");

    try {
      const sourceBytes =
        await pdfFile.arrayBuffer();

      const sourcePdf =
        await PDFDocument.load(sourceBytes, {
          ignoreEncryption: false,
        });

      const outputPdf =
        await PDFDocument.create();

      for (
        let index = 0;
        index < pages.length;
        index += 1
      ) {
        const pageItem = pages[index];

        const [copiedPage] =
          await outputPdf.copyPages(
            sourcePdf,
            [pageItem.originalPageIndex]
          );

        const originalRotation =
          copiedPage.getRotation().angle;

        copiedPage.setRotation(
          degrees(
            normalizeRotation(
              originalRotation +
                pageItem.rotation
            )
          )
        );

        outputPdf.addPage(copiedPage);

        setProgress(
          Math.round(
            ((index + 1) / pages.length) * 100
          )
        );
      }

      outputPdf.setCreator("PAFTA");
      outputPdf.setProducer(
        "PAFTA PDF Araçları"
      );
      outputPdf.setCreationDate(new Date());
      outputPdf.setModificationDate(
        new Date()
      );

      const outputBytes =
        await outputPdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50,
        });

      const outputBuffer =
        outputBytes.slice().buffer as ArrayBuffer;

      const blob = new Blob([outputBuffer], {
        type: "application/pdf",
      });

      const downloadUrl =
        URL.createObjectURL(blob);

      const downloadLink =
        document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download =
        createOutputFileName(outputName);

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();
      downloadLink.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      setMessage(
        `${pages.length} sayfalık düzenlenmiş PDF oluşturuldu.`
      );
    } catch {
      setMessage(
        "PDF düzenlenirken bir sorun oluştu. Dosyanın şifreli veya bozuk olmadığını kontrol et."
      );
    } finally {
      setIsCreating(false);
      setProgress(0);
    }
  }

  function removePdf() {
    clearPreviewUrls();

    setPdfFile(null);
    setPages([]);
    setOutputName("PAFTA_DUZENLENMIS");
    setProgress(0);
    setMessage("");
  }

  function clearPreviewUrls() {
    pages.forEach((page) => {
      URL.revokeObjectURL(page.previewUrl);
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
            PDF Sayfalarını Düzenle
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF Sayfalarını Düzenle
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PDF sayfalarının sırasını değiştir,
            sayfaları döndür, istemediğin sayfaları
            sil ve yeni PDF’yi indir.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                PDF dosyasını seç
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Bir PDF seçebilir veya dosyayı
                aşağıdaki alana sürükleyebilirsin.
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
                    ▦
                  </div>

                  <p className="mt-5 text-lg font-semibold">
                    PDF dosyasını buraya bırak
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    En fazla 150 MB boyutunda bir
                    PDF seç.
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
                      ? `Ön izlemeler hazırlanıyor: %${progress}`
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
                        {pages.length} sayfa
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

            {pages.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Sayfa düzeni
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Sayfaları taşı, döndür veya
                      PDF’den çıkar.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={reversePages}
                      className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400"
                    >
                      Sırayı ters çevir
                    </button>

                    <button
                      type="button"
                      onClick={resetPageOrder}
                      className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400"
                    >
                      Sıfırla
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pages.map((page, index) => (
                    <article
                      key={page.id}
                      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"
                    >
                      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-slate-900 p-4">
                        {/* Blob URL is generated locally and cannot use next/image. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={page.previewUrl}
                          alt={`PDF sayfası ${page.pageNumber}`}
                          loading="lazy"
                          decoding="async"
                          className="max-h-full max-w-full object-contain transition"
                          style={{
                            transform: `rotate(${page.rotation}deg)`,
                          }}
                        />

                        <div className="absolute left-3 top-3 rounded-lg bg-slate-950/90 px-3 py-1 text-xs font-semibold text-cyan-300">
                          Yeni sıra: {index + 1}
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="font-semibold text-white">
                          Orijinal sayfa{" "}
                          {page.pageNumber}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {page.rotation === 0
                            ? "Döndürülmedi"
                            : `${page.rotation}° döndürüldü`}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              movePageToStart(page.id)
                            }
                            disabled={index === 0}
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            En başa
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              movePageToEnd(page.id)
                            }
                            disabled={
                              index ===
                              pages.length - 1
                            }
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            En sona
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              movePage(
                                page.id,
                                "up"
                              )
                            }
                            disabled={index === 0}
                            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            ← Önceki
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              movePage(
                                page.id,
                                "down"
                              )
                            }
                            disabled={
                              index ===
                              pages.length - 1
                            }
                            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Sonraki →
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              rotatePage(page.id)
                            }
                            className="rounded-lg border border-cyan-400/30 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                          >
                            Döndür
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deletePage(page.id)
                            }
                            className="rounded-lg border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

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
                    placeholder="PAFTA_DUZENLENMIS"
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
                Düzenleme özeti
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <SummaryValue
                  label="Kalan sayfa"
                  value={String(pages.length)}
                />

                <SummaryValue
                  label="Silinen sayfa"
                  value={
                    pdfFile
                      ? String(
                          Math.max(
                            0,
                            getOriginalPageCount(
                              pages
                            ) - pages.length
                          )
                        )
                      : "0"
                  }
                />
              </div>

              {isCreating && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">
                      PDF oluşturuluyor
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
                onClick={createOrganizedPdf}
                disabled={
                  !pdfFile ||
                  pages.length === 0 ||
                  isReading ||
                  isCreating
                }
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating
                  ? `PDF hazırlanıyor: %${progress}`
                  : "Düzenlenmiş PDF’yi indir"}
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
                PDF düzenleme işlemi tarayıcında
                gerçekleştirilir. Dosyan PAFTA
                sunucusuna gönderilmez.
              </p>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Silinen sayfalar
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Sayfalar yalnızca oluşturulan yeni
                PDF’den çıkarılır. Bilgisayarındaki
                orijinal PDF dosyası değiştirilmez.
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

function canvasToPngBlob(
  canvas: HTMLCanvasElement
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(
          new Error(
            "Sayfa ön izlemesi oluşturulamadı."
          )
        );
      }
    }, "image/png");
  });
}

function normalizeRotation(value: number) {
  return ((value % 360) + 360) % 360;
}

function getOriginalPageCount(
  pages: PdfPageItem[]
) {
  if (pages.length === 0) {
    return 0;
  }

  return (
    Math.max(
      ...pages.map(
        (page) => page.originalPageIndex
      )
    ) + 1
  );
}

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function createOutputFileName(value: string) {
  const normalizedName = normalizeFileName(
    value.replace(/\.pdf$/i, "")
  );

  return `${
    normalizedName || "PAFTA_DUZENLENMIS"
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
