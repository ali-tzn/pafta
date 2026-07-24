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

type PageInformation = {
  pageNumber: number;
  widthPt: number;
  heightPt: number;
  widthMm: number;
  heightMm: number;
  orientation: "Dikey" | "Yatay" | "Kare";
  sizeName: string;
  rotation: number;
};

type PdfInformation = {
  fileName: string;
  fileSize: number;
  pageCount: number;
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: Date | null;
  modificationDate: Date | null;
  portraitCount: number;
  landscapeCount: number;
  squareCount: number;
  uniquePageSizes: string[];
  pages: PageInformation[];
};

const maxFileSize = 150 * 1024 * 1024;

export default function PdfInfoPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] =
    useState<PdfInformation | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [message, setMessage] = useState("");

  const metadataCount = useMemo(() => {
    if (!pdfInfo) {
      return 0;
    }

    return [
      pdfInfo.title,
      pdfInfo.author,
      pdfInfo.subject,
      pdfInfo.keywords,
      pdfInfo.creator,
      pdfInfo.producer,
      pdfInfo.creationDate,
      pdfInfo.modificationDate,
    ].filter(Boolean).length;
  }, [pdfInfo]);

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
    setPdfInfo(null);
    setMessage("");
    setIsReading(true);

    try {
      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
        updateMetadata: false,
      });

      const pages = pdf.getPages();

      const pageInformation: PageInformation[] = pages.map(
        (page, index) => {
          const { width, height } = page.getSize();
          const widthMm = pointsToMm(width);
          const heightMm = pointsToMm(height);
          const rotation = normalizeRotation(
            page.getRotation().angle
          );

          const rotated =
            rotation === 90 || rotation === 270;

          const visibleWidthPt = rotated ? height : width;
          const visibleHeightPt = rotated ? width : height;

          const visibleWidthMm = rotated
            ? heightMm
            : widthMm;

          const visibleHeightMm = rotated
            ? widthMm
            : heightMm;

          return {
            pageNumber: index + 1,
            widthPt: visibleWidthPt,
            heightPt: visibleHeightPt,
            widthMm: visibleWidthMm,
            heightMm: visibleHeightMm,
            orientation: getOrientation(
              visibleWidthPt,
              visibleHeightPt
            ),
            sizeName: detectPageSize(
              visibleWidthMm,
              visibleHeightMm
            ),
            rotation,
          };
        }
      );

      const portraitCount = pageInformation.filter(
        (page) => page.orientation === "Dikey"
      ).length;

      const landscapeCount = pageInformation.filter(
        (page) => page.orientation === "Yatay"
      ).length;

      const squareCount = pageInformation.filter(
        (page) => page.orientation === "Kare"
      ).length;

      const uniquePageSizes = Array.from(
        new Set(
          pageInformation.map(
            (page) =>
              `${page.sizeName} — ${formatMeasurement(
                page.widthMm
              )} × ${formatMeasurement(
                page.heightMm
              )} mm`
          )
        )
      );

      setPdfFile(file);

      setPdfInfo({
        fileName: file.name,
        fileSize: file.size,
        pageCount: pdf.getPageCount(),
        title: safeText(pdf.getTitle()),
        author: safeText(pdf.getAuthor()),
        subject: safeText(pdf.getSubject()),
        keywords: formatKeywords(
          pdf.getKeywords()
        ),
        creator: safeText(pdf.getCreator()),
        producer: safeText(pdf.getProducer()),
        creationDate: safeDate(
          pdf.getCreationDate()
        ),
        modificationDate: safeDate(
          pdf.getModificationDate()
        ),
        portraitCount,
        landscapeCount,
        squareCount,
        uniquePageSizes,
        pages: pageInformation,
      });

      setMessage(
        `${pdf.getPageCount()} sayfalık PDF başarıyla analiz edildi.`
      );
    } catch {
      setPdfFile(null);
      setPdfInfo(null);

      setMessage(
        "PDF bilgileri okunamadı. Dosya bozuk, parola korumalı veya desteklenmeyen bir yapıda olabilir."
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

  function removePdf() {
    setPdfFile(null);
    setPdfInfo(null);
    setMessage("");
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
            href="/pdf-tools"
            className="transition hover:text-cyan-400"
          >
            PDF Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            PDF Bilgilerini Görüntüle
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF Bilgilerini Görüntüle
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PDF dosyanın sayfa ölçülerini, yönlerini,
            dosya bilgilerini ve belge metaverilerini
            incele.
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
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-3xl font-bold text-cyan-300">
                    i
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
                      ? "PDF analiz ediliyor..."
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
                        {pdfInfo?.pageCount ?? 0} sayfa
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

            {pdfInfo && (
              <>
                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-2xl font-semibold">
                    Dosya bilgileri
                  </h2>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <InformationItem
                      label="Dosya adı"
                      value={pdfInfo.fileName}
                    />

                    <InformationItem
                      label="Dosya boyutu"
                      value={formatFileSize(
                        pdfInfo.fileSize
                      )}
                    />

                    <InformationItem
                      label="Toplam sayfa"
                      value={`${pdfInfo.pageCount} sayfa`}
                    />

                    <InformationItem
                      label="Farklı sayfa ölçüsü"
                      value={String(
                        pdfInfo.uniquePageSizes.length
                      )}
                    />
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-2xl font-semibold">
                    Sayfa dağılımı
                  </h2>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <SummaryValue
                      label="Dikey"
                      value={String(
                        pdfInfo.portraitCount
                      )}
                    />

                    <SummaryValue
                      label="Yatay"
                      value={String(
                        pdfInfo.landscapeCount
                      )}
                    />

                    <SummaryValue
                      label="Kare"
                      value={String(
                        pdfInfo.squareCount
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-white">
                      Kullanılan sayfa ölçüleri
                    </p>

                    <div className="mt-3 space-y-3">
                      {pdfInfo.uniquePageSizes.map(
                        (size) => (
                          <div
                            key={size}
                            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300"
                          >
                            {size}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-2xl font-semibold">
                    Belge bilgileri
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Bazı PDF dosyalarında bu alanlar
                    oluşturulurken boş bırakılmış olabilir.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <InformationItem
                      label="Başlık"
                      value={displayValue(
                        pdfInfo.title
                      )}
                    />

                    <InformationItem
                      label="Yazar"
                      value={displayValue(
                        pdfInfo.author
                      )}
                    />

                    <InformationItem
                      label="Konu"
                      value={displayValue(
                        pdfInfo.subject
                      )}
                    />

                    <InformationItem
                      label="Anahtar kelimeler"
                      value={displayValue(
                        pdfInfo.keywords
                      )}
                    />

                    <InformationItem
                      label="Oluşturucu uygulama"
                      value={displayValue(
                        pdfInfo.creator
                      )}
                    />

                    <InformationItem
                      label="PDF üreticisi"
                      value={displayValue(
                        pdfInfo.producer
                      )}
                    />

                    <InformationItem
                      label="Oluşturulma tarihi"
                      value={formatDate(
                        pdfInfo.creationDate
                      )}
                    />

                    <InformationItem
                      label="Değiştirilme tarihi"
                      value={formatDate(
                        pdfInfo.modificationDate
                      )}
                    />
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-2xl font-semibold">
                    Sayfa ölçüleri
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Ölçüler PDF sayfasının görünen yönü
                    dikkate alınarak hesaplanır.
                  </p>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[720px] border-separate border-spacing-y-3 text-left">
                      <thead>
                        <tr className="text-xs uppercase tracking-wider text-slate-500">
                          <th className="px-4 py-2">
                            Sayfa
                          </th>

                          <th className="px-4 py-2">
                            Standart
                          </th>

                          <th className="px-4 py-2">
                            Ölçü
                          </th>

                          <th className="px-4 py-2">
                            Yön
                          </th>

                          <th className="px-4 py-2">
                            Dönüş
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {pdfInfo.pages.map((page) => (
                          <tr
                            key={page.pageNumber}
                            className="bg-slate-950 text-sm text-slate-300"
                          >
                            <td className="rounded-l-xl px-4 py-4 font-semibold text-white">
                              {page.pageNumber}
                            </td>

                            <td className="px-4 py-4">
                              {page.sizeName}
                            </td>

                            <td className="px-4 py-4">
                              {formatMeasurement(
                                page.widthMm
                              )}{" "}
                              ×{" "}
                              {formatMeasurement(
                                page.heightMm
                              )}{" "}
                              mm
                            </td>

                            <td className="px-4 py-4">
                              {page.orientation}
                            </td>

                            <td className="rounded-r-xl px-4 py-4">
                              {page.rotation}°
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </section>

          <aside className="h-fit space-y-5">
            <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                PDF özeti
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <SummaryValue
                  label="Sayfa"
                  value={String(
                    pdfInfo?.pageCount ?? 0
                  )}
                />

                <SummaryValue
                  label="Belge bilgisi"
                  value={String(metadataCount)}
                />
              </div>

              <div className="mt-4">
                <SummaryValue
                  label="Dosya boyutu"
                  value={
                    pdfInfo
                      ? formatFileSize(
                          pdfInfo.fileSize
                        )
                      : "—"
                  }
                />
              </div>
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
                PDF bilgileri bu tarayıcıda okunur.
                Dosyan analiz için PAFTA sunucusuna
                gönderilmez.
              </p>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Güvenlik bilgisi
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Parola korumalı PDF dosyaları
                açılamayabilir. Dosyanın yüklenebilmesi,
                tüm güvenlik kısıtlamalarının kaldırılmış
                olduğu anlamına gelmez.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="font-semibold text-white">
                Sayfa standardı
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                A0, A1, A2, A3, A4 ve A5 adları
                yaklaşık ölçü eşleşmesiyle belirlenir.
                Özel boyutlu paftalar “Özel ölçü”
                olarak gösterilir.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InformationItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-3 break-words text-sm leading-6 text-slate-200">
        {value}
      </p>
    </div>
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

function safeText(value: string | undefined) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function safeDate(value: Date | undefined) {
  if (!(value instanceof Date)) {
    return null;
  }

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return value;
}

function formatKeywords(
  value: string | undefined
) {
  if (!value) {
    return "";
  }

  return value
    .replace(/[\[\]()]/g, "")
    .replace(/,\s*/g, ", ")
    .trim();
}

function displayValue(value: string) {
  return value || "Bilgi bulunamadı";
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Bilgi bulunamadı";
  }

  return value.toLocaleString("tr-TR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function getOrientation(
  width: number,
  height: number
): "Dikey" | "Yatay" | "Kare" {
  const difference = Math.abs(width - height);
  const tolerance = Math.max(width, height) * 0.01;

  if (difference <= tolerance) {
    return "Kare";
  }

  return width > height ? "Yatay" : "Dikey";
}

function detectPageSize(
  widthMm: number,
  heightMm: number
) {
  const shortSide = Math.min(widthMm, heightMm);
  const longSide = Math.max(widthMm, heightMm);

  const standardSizes = [
    {
      name: "A0",
      width: 841,
      height: 1189,
    },
    {
      name: "A1",
      width: 594,
      height: 841,
    },
    {
      name: "A2",
      width: 420,
      height: 594,
    },
    {
      name: "A3",
      width: 297,
      height: 420,
    },
    {
      name: "A4",
      width: 210,
      height: 297,
    },
    {
      name: "A5",
      width: 148,
      height: 210,
    },
    {
      name: "Letter",
      width: 215.9,
      height: 279.4,
    },
    {
      name: "Legal",
      width: 215.9,
      height: 355.6,
    },
  ];

  const toleranceMm = 3;

  const matchedSize = standardSizes.find(
    (size) =>
      Math.abs(shortSide - size.width) <=
        toleranceMm &&
      Math.abs(longSide - size.height) <=
        toleranceMm
  );

  return matchedSize?.name ?? "Özel ölçü";
}

function normalizeRotation(value: number) {
  return ((value % 360) + 360) % 360;
}

function pointsToMm(value: number) {
  return value / 2.8346456693;
}

function formatMeasurement(value: number) {
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

  const value = bytes / 1024 ** unitIndex;

  return `${value.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  })} ${units[unitIndex]}`;
}