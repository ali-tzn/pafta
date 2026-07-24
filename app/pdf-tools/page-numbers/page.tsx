"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  StandardFonts,
} from "pdf-lib";

type NumberPosition =
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "top-left"
  | "top-center"
  | "top-right";

type NumberFormat =
  | "number"
  | "page-number"
  | "number-total"
  | "page-number-total";

type TextColor = "black" | "gray" | "white" | "blue";

const maxFileSize = 150 * 1024 * 1024;

const positions: {
  id: NumberPosition;
  title: string;
  shortTitle: string;
}[] = [
  {
    id: "top-left",
    title: "Üst sol",
    shortTitle: "↖",
  },
  {
    id: "top-center",
    title: "Üst orta",
    shortTitle: "↑",
  },
  {
    id: "top-right",
    title: "Üst sağ",
    shortTitle: "↗",
  },
  {
    id: "bottom-left",
    title: "Alt sol",
    shortTitle: "↙",
  },
  {
    id: "bottom-center",
    title: "Alt orta",
    shortTitle: "↓",
  },
  {
    id: "bottom-right",
    title: "Alt sağ",
    shortTitle: "↘",
  },
];

const formats: {
  id: NumberFormat;
  title: string;
  example: string;
}[] = [
  {
    id: "number",
    title: "Yalnızca numara",
    example: "5",
  },
  {
    id: "page-number",
    title: "Sayfa numarası",
    example: "Sayfa 5",
  },
  {
    id: "number-total",
    title: "Numara / toplam",
    example: "5 / 20",
  },
  {
    id: "page-number-total",
    title: "Sayfa numarası / toplam",
    example: "Sayfa 5 / 20",
  },
];

const textColors: {
  id: TextColor;
  title: string;
}[] = [
  {
    id: "black",
    title: "Siyah",
  },
  {
    id: "gray",
    title: "Gri",
  },
  {
    id: "white",
    title: "Beyaz",
  },
  {
    id: "blue",
    title: "Mavi",
  },
];

export default function PageNumbersPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const [position, setPosition] =
    useState<NumberPosition>("bottom-center");

  const [numberFormat, setNumberFormat] =
    useState<NumberFormat>("number");

  const [textColor, setTextColor] =
    useState<TextColor>("black");

  const [fontSize, setFontSize] = useState("12");
  const [marginMm, setMarginMm] = useState("12");
  const [startNumber, setStartNumber] = useState("1");
  const [skipFirstPages, setSkipFirstPages] = useState("0");

  const [outputName, setOutputName] = useState(
    "PAFTA_NUMARALANDIRILMIS"
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const parsedStartNumber = Number(startNumber);
  const parsedSkipFirstPages = Number(skipFirstPages);
  const parsedFontSize = Number(fontSize);
  const parsedMarginMm = Number(marginMm);

  const numberedPageCount = useMemo(() => {
    if (pageCount === 0) {
      return 0;
    }

    if (
      !Number.isInteger(parsedSkipFirstPages) ||
      parsedSkipFirstPages < 0
    ) {
      return 0;
    }

    return Math.max(
      0,
      pageCount - parsedSkipFirstPages
    );
  }, [pageCount, parsedSkipFirstPages]);

  const previewText = useMemo(() => {
    const safeStartNumber =
      Number.isInteger(parsedStartNumber) &&
      parsedStartNumber >= 0
        ? parsedStartNumber
        : 1;

    return createPageNumberText({
      format: numberFormat,
      currentNumber: safeStartNumber,
      totalNumberedPages: numberedPageCount,
    });
  }, [
    numberFormat,
    numberedPageCount,
    parsedStartNumber,
  ]);

  async function readPdf(file: File) {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setMessage(
        "Lütfen PDF formatında bir dosya seç."
      );
      return;
    }

    if (file.size > maxFileSize) {
      setMessage(
        "PDF dosyası 150 MB sınırını aşıyor."
      );
      return;
    }

    setPdfFile(null);
    setPageCount(0);
    setProgress(0);
    setMessage("");
    setIsReading(true);

    try {
      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
      });

      const totalPages = pdf.getPageCount();

      setPdfFile(file);
      setPageCount(totalPages);
      setSkipFirstPages("0");

      setOutputName(
        `${normalizeFileName(
          file.name.replace(/\.pdf$/i, "")
        )}_NUMARALANDIRILMIS`
      );

      setMessage(
        `${totalPages} sayfalık PDF başarıyla yüklendi.`
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

  function validateSettings() {
    if (!pdfFile) {
      return "Önce bir PDF dosyası seç.";
    }

    if (
      !Number.isInteger(parsedStartNumber) ||
      parsedStartNumber < 0 ||
      parsedStartNumber > 999999
    ) {
      return "Başlangıç numarası 0 ile 999999 arasında tam sayı olmalıdır.";
    }

    if (
      !Number.isInteger(parsedSkipFirstPages) ||
      parsedSkipFirstPages < 0 ||
      parsedSkipFirstPages >= pageCount
    ) {
      return `Atlanacak sayfa sayısı 0 ile ${
        Math.max(0, pageCount - 1)
      } arasında olmalıdır.`;
    }

    if (
      !Number.isFinite(parsedFontSize) ||
      parsedFontSize < 6 ||
      parsedFontSize > 72
    ) {
      return "Yazı boyutu 6 ile 72 punto arasında olmalıdır.";
    }

    if (
      !Number.isFinite(parsedMarginMm) ||
      parsedMarginMm < 0 ||
      parsedMarginMm > 100
    ) {
      return "Kenar uzaklığı 0 ile 100 mm arasında olmalıdır.";
    }

    return null;
  }

  async function createNumberedPdf() {
    const validationError = validateSettings();

    if (validationError) {
      setMessage(validationError);
      return;
    }

    if (!pdfFile) {
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setMessage("");

    try {
      const sourceBytes =
        await pdfFile.arrayBuffer();

      const pdf = await PDFDocument.load(
        sourceBytes,
        {
          ignoreEncryption: false,
        }
      );

      const font = await pdf.embedFont(
        StandardFonts.Helvetica
      );

      const pages = pdf.getPages();

      const totalPagesToNumber =
        pages.length - parsedSkipFirstPages;

      const marginPoints =
        mmToPoints(parsedMarginMm);

      for (
        let pageIndex = 0;
        pageIndex < pages.length;
        pageIndex += 1
      ) {
        if (pageIndex >= parsedSkipFirstPages) {
          const page = pages[pageIndex];

          const numberedPageIndex =
            pageIndex - parsedSkipFirstPages;

          const currentNumber =
            parsedStartNumber +
            numberedPageIndex;

          const finalNumber =
            parsedStartNumber +
            totalPagesToNumber -
            1;

          const pageText =
            createPageNumberText({
              format: numberFormat,
              currentNumber,
              totalNumberedPages:
                numberFormat === "number-total" ||
                numberFormat ===
                  "page-number-total"
                  ? finalNumber
                  : totalPagesToNumber,
            });

          drawPageNumber({
            page,
            font,
            text: pageText,
            fontSize: parsedFontSize,
            marginPoints,
            position,
            textColor,
          });
        }

        setProgress(
          Math.round(
            ((pageIndex + 1) / pages.length) *
              100
          )
        );
      }

      pdf.setCreator("PAFTA");
      pdf.setProducer("PAFTA PDF Araçları");
      pdf.setModificationDate(new Date());

      const outputBytes = await pdf.save({
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
        `${totalPagesToNumber} sayfaya numara eklendi ve PDF indirildi.`
      );
    } catch {
      setMessage(
        "PDF’e sayfa numarası eklenirken bir sorun oluştu. Dosyanın şifreli veya bozuk olmadığını kontrol et."
      );
    } finally {
      setIsCreating(false);
      setProgress(0);
    }
  }

  function removePdf() {
    setPdfFile(null);
    setPageCount(0);
    setProgress(0);
    setSkipFirstPages("0");
    setOutputName(
      "PAFTA_NUMARALANDIRILMIS"
    );
    setMessage("");
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
            PDF’e Sayfa Numarası Ekle
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF’e Sayfa Numarası Ekle
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PDF sayfalarına otomatik numara ekle;
            konumu, biçimi, başlangıç numarasını ve
            yazı boyutunu belirle.
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
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-3xl font-bold text-cyan-300">
                    123
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
                Numara konumu
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sayfa numarasının PDF üzerinde
                görüneceği konumu seç.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {positions.map((option) => {
                  const selected =
                    position === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setPosition(option.id)
                      }
                      className={`rounded-2xl border p-4 text-center transition ${
                        selected
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="block text-2xl">
                        {option.shortTitle}
                      </span>

                      <span className="mt-2 block text-sm font-semibold">
                        {option.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Numara biçimi
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {formats.map((format) => {
                  const selected =
                    numberFormat === format.id;

                  return (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() =>
                        setNumberFormat(format.id)
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
                        {format.title}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        Örnek: {format.example}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Numaralandırma ayarları
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <NumberInput
                  id="start-number"
                  label="Başlangıç numarası"
                  value={startNumber}
                  min="0"
                  max="999999"
                  step="1"
                  onChange={setStartNumber}
                />

                <NumberInput
                  id="skip-pages"
                  label="İlk kaç sayfa atlansın?"
                  value={skipFirstPages}
                  min="0"
                  max={String(
                    Math.max(0, pageCount - 1)
                  )}
                  step="1"
                  onChange={setSkipFirstPages}
                />

                <NumberInput
                  id="font-size"
                  label="Yazı boyutu (punto)"
                  value={fontSize}
                  min="6"
                  max="72"
                  step="1"
                  onChange={setFontSize}
                />

                <NumberInput
                  id="margin"
                  label="Kenardan uzaklık (mm)"
                  value={marginMm}
                  min="0"
                  max="100"
                  step="1"
                  onChange={setMarginMm}
                />
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm text-slate-400">
                  Yazı rengi
                </p>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {textColors.map((color) => {
                    const selected =
                      textColor === color.id;

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() =>
                          setTextColor(color.id)
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          selected
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        {color.title}
                      </button>
                    );
                  })}
                </div>
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
                    placeholder="PAFTA_NUMARALANDIRILMIS"
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
                Numaralandırma özeti
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <SummaryValue
                  label="Toplam sayfa"
                  value={String(pageCount)}
                />

                <SummaryValue
                  label="Numaralı sayfa"
                  value={String(numberedPageCount)}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Numara örneği
                </p>

                <p
                  className={`mt-4 font-semibold ${
                    textColor === "white"
                      ? "rounded-lg bg-slate-600 p-2 text-white"
                      : textColor === "gray"
                        ? "text-slate-400"
                        : textColor === "blue"
                          ? "text-blue-400"
                          : "rounded-lg bg-white p-2 text-black"
                  }`}
                  style={{
                    fontSize: `${Math.min(
                      30,
                      Math.max(
                        12,
                        Number(fontSize) || 12
                      )
                    )}px`,
                  }}
                >
                  {previewText}
                </p>
              </div>

              {isCreating && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">
                      PDF hazırlanıyor
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
                onClick={createNumberedPdf}
                disabled={
                  !pdfFile ||
                  isReading ||
                  isCreating
                }
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating
                  ? `PDF hazırlanıyor: %${progress}`
                  : "Numaralandırılmış PDF’yi indir"}
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
                Sayfa numaraları tarayıcında eklenir.
                PDF dosyan PAFTA sunucusuna
                gönderilmez.
              </p>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                İlk sayfaları atlama
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Kapak, içindekiler veya proje künyesi
                gibi sayfalara numara eklememek için
                atlanacak sayfa sayısını kullan.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function NumberInput({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  min: string;
  max: string;
  step: string;
  onChange: (value: string) => void;
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
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
      />
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

function drawPageNumber({
  page,
  font,
  text,
  fontSize,
  marginPoints,
  position,
  textColor,
}: {
  page: PDFPage;
  font: PDFFont;
  text: string;
  fontSize: number;
  marginPoints: number;
  position: NumberPosition;
  textColor: TextColor;
}) {
  const { width, height } = page.getSize();

  const textWidth = font.widthOfTextAtSize(
    text,
    fontSize
  );

  const safeMargin = Math.max(
    0,
    marginPoints
  );

  let x = safeMargin;
  let y = safeMargin;

  if (position.endsWith("center")) {
    x = (width - textWidth) / 2;
  }

  if (position.endsWith("right")) {
    x = width - safeMargin - textWidth;
  }

  if (position.startsWith("top")) {
    y = height - safeMargin - fontSize;
  }

  x = Math.max(
    0,
    Math.min(x, width - textWidth)
  );

  y = Math.max(
    0,
    Math.min(y, height - fontSize)
  );

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: getPdfColor(textColor),
  });
}

function createPageNumberText({
  format,
  currentNumber,
  totalNumberedPages,
}: {
  format: NumberFormat;
  currentNumber: number;
  totalNumberedPages: number;
}) {
  if (format === "page-number") {
    return `Sayfa ${currentNumber}`;
  }

  if (format === "number-total") {
    return `${currentNumber} / ${totalNumberedPages}`;
  }

  if (format === "page-number-total") {
    return `Sayfa ${currentNumber} / ${totalNumberedPages}`;
  }

  return String(currentNumber);
}

function getPdfColor(color: TextColor) {
  if (color === "white") {
    return rgb(1, 1, 1);
  }

  if (color === "gray") {
    return rgb(0.45, 0.45, 0.45);
  }

  if (color === "blue") {
    return rgb(0.1, 0.35, 0.85);
  }

  return rgb(0, 0, 0);
}

function mmToPoints(value: number) {
  return value * 2.8346456693;
}

function createOutputFileName(value: string) {
  const normalizedName = normalizeFileName(
    value.replace(/\.pdf$/i, "")
  );

  return `${
    normalizedName ||
    "PAFTA_NUMARALANDIRILMIS"
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