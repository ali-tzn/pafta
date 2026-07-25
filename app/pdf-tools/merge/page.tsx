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
import { trackToolEvent } from "@/lib/analytics";
import RelatedTools from "@/app/components/RelatedTools";

type PdfFileItem = {
  id: string;
  file: File;
  pageCount: number | null;
  pageRange: string;
  error: string | null;
};

const maxFileSize = 100 * 1024 * 1024;

export default function MergePdfPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [outputName, setOutputName] = useState(
    "PAFTA_BIRLESTIRILMIS"
  );

  const [isReading, setIsReading] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null);

  const [message, setMessage] = useState("");

  const validFiles = useMemo(
    () => files.filter((item) => item.error === null),
    [files]
  );

  const totalFileSize = useMemo(
    () =>
      files.reduce(
        (total, item) => total + item.file.size,
        0
      ),
    [files]
  );

  async function addFiles(selectedFiles: File[]) {
    const pdfFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length === 0) {
      setMessage("Lütfen PDF formatında dosya seç.");
      return;
    }

    setMessage("");
    setIsReading(true);

    const existingSignatures = new Set(
      files.map(
        (item) =>
          `${item.file.name}-${item.file.size}-${item.file.lastModified}`
      )
    );

    const newItems: PdfFileItem[] = [];

    for (const file of pdfFiles) {
      const signature = `${file.name}-${file.size}-${file.lastModified}`;

      if (existingSignatures.has(signature)) {
        continue;
      }

      if (file.size > maxFileSize) {
        newItems.push({
          id: createId(),
          file,
          pageCount: null,
          pageRange: "",
          error: "Dosya boyutu 100 MB sınırını aşıyor.",
        });

        continue;
      }

      try {
        const bytes = await file.arrayBuffer();

        const pdf = await PDFDocument.load(bytes, {
          ignoreEncryption: false,
        });

        newItems.push({
          id: createId(),
          file,
          pageCount: pdf.getPageCount(),
          pageRange: `1-${pdf.getPageCount()}`,
          error: null,
        });
      } catch {
        newItems.push({
          id: createId(),
          file,
          pageCount: null,
          pageRange: "",
          error:
            "Dosya okunamadı. Şifreli veya bozuk bir PDF olabilir.",
        });
      }
    }

    setFiles((currentFiles) => [
      ...currentFiles,
      ...newItems,
    ]);

    setIsReading(false);

    if (newItems.length === 0) {
      setMessage(
        "Seçilen dosyalar zaten listede bulunuyor."
      );
    }
  }

  async function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    await addFiles(selectedFiles);

    event.target.value = "";
  }

  async function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(
      event.dataTransfer.files
    );

    await addFiles(droppedFiles);
  }

  function removeFile(id: string) {
    setFiles((currentFiles) =>
      currentFiles.filter((item) => item.id !== id)
    );

    setMessage("");
  }

  function moveFile(
    id: string,
    direction: "up" | "down"
  ) {
    setFiles((currentFiles) => {
      const currentIndex =
        currentFiles.findIndex(
          (item) => item.id === id
        );

      if (currentIndex === -1) {
        return currentFiles;
      }

      const targetIndex =
        direction === "up"
          ? currentIndex - 1
          : currentIndex + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= currentFiles.length
      ) {
        return currentFiles;
      }

      const updatedFiles = [...currentFiles];

      const currentItem =
        updatedFiles[currentIndex];

      updatedFiles[currentIndex] =
        updatedFiles[targetIndex];

      updatedFiles[targetIndex] = currentItem;

      return updatedFiles;
    });
  }

  function clearFiles() {
    setFiles([]);
    setMessage("");
  }

  function updatePageRange(id: string, pageRange: string) {
    setFiles((currentFiles) =>
      currentFiles.map((item) =>
        item.id === id ? { ...item, pageRange } : item
      )
    );
  }

  function reorderFiles(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;

    setFiles((currentFiles) => {
      const sourceIndex = currentFiles.findIndex((item) => item.id === sourceId);
      const targetIndex = currentFiles.findIndex((item) => item.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return currentFiles;

      const updated = [...currentFiles];
      const [movedItem] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, movedItem);
      return updated;
    });
  }

  const selectedPageCount = useMemo(
    () =>
      validFiles.reduce(
        (total, item) =>
          total +
          parsePageRange(item.pageRange, item.pageCount ?? 0).length,
        0
      ),
    [validFiles]
  );

  async function mergeFiles() {
    if (validFiles.length < 2) {
      setMessage(
        "Birleştirmek için en az iki geçerli PDF ekle."
      );
      return;
    }

    setIsMerging(true);
    setMessage("");

    try {
      const mergedPdf =
        await PDFDocument.create();

      for (const item of validFiles) {
        const fileBytes =
          await item.file.arrayBuffer();

        const sourcePdf =
          await PDFDocument.load(fileBytes, {
            ignoreEncryption: false,
          });

        const selectedIndices = parsePageRange(
          item.pageRange,
          sourcePdf.getPageCount()
        ).map((pageNumber) => pageNumber - 1);

        if (selectedIndices.length === 0) {
          throw new Error(`${item.file.name} için geçerli sayfa seçilmedi.`);
        }

        const copiedPages = await mergedPdf.copyPages(sourcePdf, selectedIndices);

        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      mergedPdf.setCreator("PAFTA");
      mergedPdf.setProducer(
        "PAFTA PDF Araçları"
      );
      mergedPdf.setCreationDate(new Date());
      mergedPdf.setModificationDate(
        new Date()
      );

      const mergedBytes =
        await mergedPdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50,
        });

      const mergedBuffer =
        mergedBytes.slice().buffer as ArrayBuffer;

      const blob = new Blob(
        [mergedBuffer],
        {
          type: "application/pdf",
        }
      );

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
        `${validFiles.length} PDF ve ${selectedPageCount} seçili sayfa başarıyla birleştirildi.`
      );
      trackToolEvent("pdf_merge", "completed", {
        file_count: validFiles.length,
        page_count: selectedPageCount,
      });
    } catch {
      setMessage(
        "PDF dosyaları birleştirilirken bir sorun oluştu. Şifreli veya hasarlı dosya bulunup bulunmadığını kontrol et."
      );
    } finally {
      setIsMerging(false);
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
            href="/pdf-tools"
            className="transition hover:text-cyan-400"
          >
            PDF Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            PDF Birleştirme
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF Birleştirme
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Birden fazla PDF dosyasını yükle,
            sıralamasını düzenle ve tek bir PDF
            olarak indir.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_360px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                PDF dosyalarını ekle
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Dosyaları seçebilir veya aşağıdaki
                alana sürükleyebilirsin.
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={handleInputChange}
                className="hidden"
              />

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
                  +
                </div>

                <p className="mt-5 text-lg font-semibold">
                  PDF dosyalarını buraya bırak
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Birden fazla dosyayı aynı anda
                  seçebilirsin.
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
                    ? "Dosyalar okunuyor..."
                    : "PDF dosyalarını seç"}
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Her dosya için önerilen üst sınır
                100 MB’dir. Büyük dosyalar tarayıcı
                belleğini zorlayabilir.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Dosya sırası
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Kartları sürükleyerek sırala; istersen her dosyadan alınacak
                    sayfaları ayrıca seç.
                  </p>
                </div>

                {files.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                  >
                    Tümünü temizle
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {files.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                    Henüz PDF dosyası eklenmedi.
                  </div>
                ) : (
                  files.map((item, index) => (
                    <div
                      key={item.id}
                      draggable={!item.error}
                      onDragStart={() => setDraggedFileId(item.id)}
                      onDragEnd={() => setDraggedFileId(null)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (draggedFileId) reorderFiles(draggedFileId, item.id);
                        setDraggedFileId(null);
                      }}
                      className={`rounded-2xl border p-4 ${
                        item.error
                          ? "border-red-400/30 bg-red-400/10"
                          : draggedFileId === item.id
                            ? "border-cyan-400 bg-cyan-400/10 opacity-70"
                            : "cursor-grab border-slate-800 bg-slate-950 active:cursor-grabbing"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 font-bold text-cyan-300">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">
                            {item.file.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {formatFileSize(
                              item.file.size
                            )}

                            {item.pageCount !== null && (
                              <>
                                <span className="mx-2">
                                  •
                                </span>

                                {item.pageCount} sayfa
                              </>
                            )}
                          </p>

                          {item.error && (
                            <p className="mt-2 text-sm text-red-300">
                              {item.error}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              moveFile(
                                item.id,
                                "up"
                              )
                            }
                            disabled={index === 0}
                            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Yukarı taşı"
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveFile(
                                item.id,
                                "down"
                              )
                            }
                            disabled={
                              index ===
                              files.length - 1
                            }
                            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Aşağı taşı"
                          >
                            ↓
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeFile(item.id)
                            }
                            className="rounded-lg border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                          >
                            Sil
                          </button>
                        </div>
                      </div>

                      {!item.error && item.pageCount !== null && (
                        <div className="mt-4 border-t border-slate-800 pt-4">
                          <label className="block">
                            <span className="text-xs font-semibold text-slate-400">
                              Alınacak sayfalar
                            </span>
                            <input
                              value={item.pageRange}
                              onChange={(event) =>
                                updatePageRange(item.id, event.target.value)
                              }
                              onMouseDown={(event) => event.stopPropagation()}
                              placeholder="Örnek: 1-3, 5, 8"
                              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
                            />
                          </label>
                          <p className="mt-2 text-xs text-slate-500">
                            {parsePageRange(item.pageRange, item.pageCount).length} /{" "}
                            {item.pageCount} sayfa seçili
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
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
                    placeholder="PAFTA_BIRLESTIRILMIS"
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
                Birleştirme özeti
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <SummaryValue
                  label="Geçerli dosya"
                  value={String(
                    validFiles.length
                  )}
                />

                <SummaryValue
                  label="Seçili sayfa"
                  value={String(
                    selectedPageCount
                  )}
                />
              </div>

              <div className="mt-4">
                <SummaryValue
                  label="Toplam dosya boyutu"
                  value={formatFileSize(
                    totalFileSize
                  )}
                />
              </div>

              <button
                type="button"
                onClick={mergeFiles}
                disabled={
                  validFiles.length < 2 ||
                  isReading ||
                  isMerging
                }
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isMerging
                  ? "PDF hazırlanıyor..."
                  : "PDF’leri birleştir"}
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
                Dosyaların cihazında kalır
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Birleştirme işlemi bu tarayıcıda
                gerçekleştirilir. Seçtiğin PDF
                dosyaları PAFTA sunucusuna
                gönderilmez.
              </p>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Şifreli PDF uyarısı
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Parola korumalı, bozuk veya bazı
                özel güvenlik ayarlarına sahip PDF
                dosyaları birleştirilemeyebilir.
              </p>
            </section>
          </aside>
        </div>
        <RelatedTools currentHref="/pdf-tools/merge" kind="pdf" />
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

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function createOutputFileName(
  value: string
) {
  const normalizedName = value
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
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[_-]+|[_-]+$/g, "");

  return `${
    normalizedName ||
    "PAFTA_BIRLESTIRILMIS"
  }.pdf`;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 KB";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const unitIndex = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    ),
    units.length - 1
  );

  const value =
    bytes / 1024 ** unitIndex;

  return `${value.toLocaleString(
    "tr-TR",
    {
      maximumFractionDigits: 2,
    }
  )} ${units[unitIndex]}`;
}

function parsePageRange(value: string, pageCount: number) {
  if (pageCount < 1) return [];

  const normalized = value.trim();
  if (!normalized) return [];

  const pages = new Set<number>();

  normalized.split(",").forEach((part) => {
    const piece = part.trim();
    if (!piece) return;

    if (piece.includes("-")) {
      const [rawStart, rawEnd] = piece.split("-");
      const start = Number.parseInt(rawStart, 10);
      const end = Number.parseInt(rawEnd, 10);
      if (!Number.isInteger(start) || !Number.isInteger(end)) return;

      const lower = Math.max(1, Math.min(start, end));
      const upper = Math.min(pageCount, Math.max(start, end));
      for (let page = lower; page <= upper; page += 1) pages.add(page);
      return;
    }

    const page = Number.parseInt(piece, 10);
    if (Number.isInteger(page) && page >= 1 && page <= pageCount) {
      pages.add(page);
    }
  });

  return Array.from(pages).sort((a, b) => a - b);
}
