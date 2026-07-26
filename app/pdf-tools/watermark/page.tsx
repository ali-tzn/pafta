"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  degrees,
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  StandardFonts,
} from "pdf-lib";

type WatermarkPosition =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "repeated";

type TextColor =
  | "gray"
  | "black"
  | "red"
  | "blue"
  | "white";

type PreviewPageSize = {
  width: number;
  height: number;
};

type WritableFileStream = {
  write: (data: Blob) => Promise<void>;
  close: () => Promise<void>;
};

type SaveFileHandle = {
  createWritable: () => Promise<WritableFileStream>;
};

type SaveFilePickerOptions = {
  suggestedName?: string;
  types?: {
    description?: string;
    accept: Record<string, string[]>;
  }[];
  excludeAcceptAllOption?: boolean;
};

type WindowWithSavePicker = Window & {
  showSaveFilePicker?: (
    options?: SaveFilePickerOptions
  ) => Promise<SaveFileHandle>;
};

const maxFileSize = 150 * 1024 * 1024;

const positions: {
  id: WatermarkPosition;
  title: string;
  icon: string;
}[] = [
  {
    id: "top-left",
    title: "Üst sol",
    icon: "↖",
  },
  {
    id: "top-center",
    title: "Üst orta",
    icon: "↑",
  },
  {
    id: "top-right",
    title: "Üst sağ",
    icon: "↗",
  },
  {
    id: "center",
    title: "Orta",
    icon: "●",
  },
  {
    id: "bottom-left",
    title: "Alt sol",
    icon: "↙",
  },
  {
    id: "bottom-center",
    title: "Alt orta",
    icon: "↓",
  },
  {
    id: "bottom-right",
    title: "Alt sağ",
    icon: "↘",
  },
  {
    id: "repeated",
    title: "Tekrarlı",
    icon: "▦",
  },
];

const textColors: {
  id: TextColor;
  title: string;
}[] = [
  {
    id: "gray",
    title: "Gri",
  },
  {
    id: "black",
    title: "Siyah",
  },
  {
    id: "red",
    title: "Kırmızı",
  },
  {
    id: "blue",
    title: "Mavi",
  },
  {
    id: "white",
    title: "Beyaz",
  },
];

export default function WatermarkPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const [watermarkText, setWatermarkText] =
    useState("PAFTA");

  const [position, setPosition] =
    useState<WatermarkPosition>("center");

  const [textColor, setTextColor] =
    useState<TextColor>("gray");

  const [fontSize, setFontSize] = useState("48");
  const [opacity, setOpacity] = useState("20");
  const [rotation, setRotation] = useState("-35");
  const [marginMm, setMarginMm] = useState("15");

  const [pageRange, setPageRange] = useState("");

  const [outputName, setOutputName] = useState(
    "PAFTA_FILIGRANLI"
  );

  const [preparedBlob, setPreparedBlob] =
    useState<Blob | null>(null);

  const [previewPageNumber, setPreviewPageNumber] =
    useState(1);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [previewPageSize, setPreviewPageSize] =
    useState<PreviewPageSize>({
      width: 0,
      height: 0,
    });

  const [isPreviewLoading, setIsPreviewLoading] =
    useState(false);

  const [previewError, setPreviewError] =
    useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDownloading, setIsDownloading] =
    useState(false);

  const [progress, setProgress] = useState(0);
  const [processStage, setProcessStage] = useState("");
  const [message, setMessage] = useState("");

  const parsedFontSize = Number(fontSize);
  const parsedOpacity = Number(opacity);
  const parsedRotation = Number(rotation);
  const parsedMarginMm = Number(marginMm);

  const selectedPages = useMemo(
    () => parsePageRange(pageRange, pageCount),
    [pageRange, pageCount]
  );

  const normalizedPreviewText = useMemo(
    () =>
      normalizeWatermarkText(
        watermarkText || "PAFTA"
      ),
    [watermarkText]
  );

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(
          previewUrlRef.current
        );
      }
    };
  }, []);

  async function loadPdfJs() {
    const pdfjs = await import("pdfjs-dist");

    pdfjs.GlobalWorkerOptions.workerSrc =
      new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

    return pdfjs;
  }

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(
        previewUrlRef.current
      );

      previewUrlRef.current = null;
    }

    setPreviewUrl(null);

    setPreviewPageSize({
      width: 0,
      height: 0,
    });

    setPreviewError("");
  }

  function clearPreparedResult() {
    setPreparedBlob(null);
  }

  function handleSettingChange(
    callback: () => void
  ) {
    callback();

    clearPreparedResult();

    setProgress(0);
    setProcessStage("");
    setMessage("");
  }

  async function createPagePreview(
    file: File,
    pageNumber: number
  ) {
    clearPreview();

    setIsPreviewLoading(true);
    setPreviewError("");

    try {
      const pdfjs = await loadPdfJs();

      const bytes = new Uint8Array(
        await file.arrayBuffer()
      );

      const loadingTask = pdfjs.getDocument({
        data: bytes,
      });

      const pdf = await loadingTask.promise;

      const safePageNumber = Math.min(
        Math.max(1, pageNumber),
        pdf.numPages
      );

      const page =
        await pdf.getPage(safePageNumber);

      const baseViewport = page.getViewport({
        scale: 1,
      });

      setPreviewPageSize({
        width: baseViewport.width,
        height: baseViewport.height,
      });

      const longestSide = Math.max(
        baseViewport.width,
        baseViewport.height
      );

      const renderScale = Math.min(
        2,
        Math.max(1, 1400 / longestSide)
      );

      const renderViewport = page.getViewport({
        scale: renderScale,
      });

      const canvas =
        document.createElement("canvas");

      const context = canvas.getContext("2d", {
        alpha: false,
      });

      if (!context) {
        throw new Error(
          "Önizleme tuvali oluşturulamadı."
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

      await page.render({
        canvas,
        canvasContext: context,
        viewport: renderViewport,
      }).promise;

      const previewBlob =
        await canvasToPngBlob(canvas);

      const objectUrl =
        URL.createObjectURL(previewBlob);

      previewUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);

      page.cleanup();

      canvas.width = 1;
      canvas.height = 1;

      await loadingTask.destroy();
    } catch (error) {
      console.error(
        "PDF önizleme hatası:",
        error
      );

      setPreviewError(
        "Bu PDF sayfasının önizlemesi oluşturulamadı."
      );
    } finally {
      setIsPreviewLoading(false);
    }
  }

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

    clearPreparedResult();
    clearPreview();

    setPdfFile(null);
    setPageCount(0);
    setPageRange("");
    setPreviewPageNumber(1);
    setProgress(0);
    setProcessStage("PDF okunuyor");
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
      setPageRange(`1-${totalPages}`);
      setPreviewPageNumber(1);

      setOutputName(
        `${normalizeFileName(
          file.name.replace(/\.pdf$/i, "")
        )}_FILIGRANLI`
      );

      setMessage(
        `${totalPages} sayfalık PDF başarıyla yüklendi.`
      );

      await createPagePreview(file, 1);
    } catch (error) {
      console.error(
        "PDF okuma hatası:",
        error
      );

      setMessage(
        "PDF okunamadı. Dosya bozuk, şifreli veya desteklenmeyen bir yapıda olabilir."
      );
    } finally {
      setIsReading(false);
      setProcessStage("");
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

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      await readPdf(file);
    }
  }

  async function changePreviewPage(
    nextPageNumber: number
  ) {
    if (!pdfFile || pageCount === 0) {
      return;
    }

    const safePageNumber = Math.min(
      Math.max(1, nextPageNumber),
      pageCount
    );

    setPreviewPageNumber(safePageNumber);

    await createPagePreview(
      pdfFile,
      safePageNumber
    );
  }

  function validateSettings() {
    if (!pdfFile) {
      return "Önce bir PDF dosyası seç.";
    }

    if (!watermarkText.trim()) {
      return "Filigran metni boş bırakılamaz.";
    }

    if (watermarkText.trim().length > 100) {
      return "Filigran metni en fazla 100 karakter olabilir.";
    }

    if (!normalizedPreviewText) {
      return "Filigran metninde desteklenen bir karakter bulunmalıdır.";
    }

    if (selectedPages.length === 0) {
      return "Geçerli bir sayfa aralığı gir. Örneğin: 1-3, 5, 8";
    }

    if (
      !Number.isFinite(parsedFontSize) ||
      parsedFontSize < 8 ||
      parsedFontSize > 200
    ) {
      return "Yazı boyutu 8 ile 200 punto arasında olmalıdır.";
    }

    if (
      !Number.isFinite(parsedOpacity) ||
      parsedOpacity < 5 ||
      parsedOpacity > 100
    ) {
      return "Görünürlük değeri %5 ile %100 arasında olmalıdır.";
    }

    if (
      !Number.isFinite(parsedRotation) ||
      parsedRotation < -180 ||
      parsedRotation > 180
    ) {
      return "Döndürme açısı -180° ile 180° arasında olmalıdır.";
    }

    if (
      !Number.isFinite(parsedMarginMm) ||
      parsedMarginMm < 0 ||
      parsedMarginMm > 100
    ) {
      return "Kenardan uzaklık 0 ile 100 mm arasında olmalıdır.";
    }

    return null;
  }

  async function createWatermarkedPdf() {
    const validationError =
      validateSettings();

    if (validationError) {
      setMessage(validationError);
      return;
    }

    if (!pdfFile) {
      return;
    }

    const finalWatermarkText =
      normalizeWatermarkText(watermarkText);

    clearPreparedResult();

    setIsCreating(true);
    setProgress(1);
    setProcessStage("PDF belleğe alınıyor");

    if (
      finalWatermarkText !==
      watermarkText.trim()
    ) {
      setMessage(
        `Türkçe karakterler PDF uyumluluğu için “${finalWatermarkText}” olarak dönüştürüldü.`
      );
    } else {
      setMessage("");
    }

    try {
      await allowScreenUpdate();

      const sourceBytes =
        await pdfFile.arrayBuffer();

      setProgress(5);
      setProcessStage("PDF açılıyor");

      await allowScreenUpdate();

      const pdf = await PDFDocument.load(
        sourceBytes,
        {
          ignoreEncryption: false,
        }
      );

      setProgress(10);
      setProcessStage(
        "Yazı tipi hazırlanıyor"
      );

      await allowScreenUpdate();

      const font = await pdf.embedFont(
        StandardFonts.HelveticaBold
      );

      const pages = pdf.getPages();

      const selectedPageSet = new Set(
        selectedPages.map(
          (pageNumber) => pageNumber - 1
        )
      );

      const marginPoints =
        mmToPoints(parsedMarginMm);

      let processedSelectedPages = 0;

      for (
        let pageIndex = 0;
        pageIndex < pages.length;
        pageIndex += 1
      ) {
        if (!selectedPageSet.has(pageIndex)) {
          continue;
        }

        const page = pages[pageIndex];

        if (position === "repeated") {
          drawRepeatedWatermark({
            page,
            font,
            text: finalWatermarkText,
            fontSize: parsedFontSize,
            opacity: parsedOpacity / 100,
            rotation: parsedRotation,
            textColor,
          });
        } else {
          drawSingleWatermark({
            page,
            font,
            text: finalWatermarkText,
            fontSize: parsedFontSize,
            opacity: parsedOpacity / 100,
            rotation: parsedRotation,
            textColor,
            position,
            marginPoints,
          });
        }

        processedSelectedPages += 1;

        const pageProgress =
          10 +
          Math.round(
            (processedSelectedPages /
              selectedPages.length) *
              70
          );

        setProgress(
          Math.min(80, pageProgress)
        );

        setProcessStage(
          `Filigran ekleniyor: ${processedSelectedPages} / ${selectedPages.length} sayfa`
        );

        await allowScreenUpdate();
      }

      pdf.setCreator("PAFTA");

      pdf.setProducer(
        "PAFTA PDF Araçları"
      );

      pdf.setModificationDate(new Date());

      setProgress(85);

      setProcessStage(
        "PDF dosyası oluşturuluyor"
      );

      await allowScreenUpdate();

      const outputBytes =
        await pdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 20,
        });

      setProgress(95);

      setProcessStage(
        "İndirme dosyası hazırlanıyor"
      );

      await allowScreenUpdate();

      const outputBuffer =
        outputBytes.slice()
          .buffer as ArrayBuffer;

      const blob = new Blob(
        [outputBuffer],
        {
          type: "application/pdf",
        }
      );

      setPreparedBlob(blob);

      setProgress(100);
      setProcessStage("Tamamlandı");

      const conversionMessage =
        finalWatermarkText !==
        watermarkText.trim()
          ? ` Filigran metni “${finalWatermarkText}” olarak kullanıldı.`
          : "";

      setMessage(
        `${selectedPages.length} sayfaya filigran eklendi. Dosya indirmeye hazır.${conversionMessage}`
      );
    } catch (error) {
      console.error(
        "Filigran oluşturma hatası:",
        error
      );

      setPreparedBlob(null);
      setProgress(0);
      setProcessStage("");

      setMessage(
        "PDF’e filigran eklenirken bir sorun oluştu. Dosyanın şifreli veya bozuk olmadığını kontrol et."
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function downloadWatermarkedPdf() {
    if (!preparedBlob) {
      setMessage(
        "Önce filigranlı PDF dosyasını hazırla."
      );

      return;
    }

    const fileName =
      createOutputFileName(outputName);

    setIsDownloading(true);
    setMessage(
      "Dosya kaydetme işlemi başlatılıyor..."
    );

    try {
      const browserWindow =
        window as WindowWithSavePicker;

      if (browserWindow.showSaveFilePicker) {
        const fileHandle =
          await browserWindow.showSaveFilePicker({
            suggestedName: fileName,
            types: [
              {
                description: "PDF dosyası",
                accept: {
                  "application/pdf": [".pdf"],
                },
              },
            ],
            excludeAcceptAllOption: false,
          });

        const writable =
          await fileHandle.createWritable();

        await writable.write(preparedBlob);
        await writable.close();

        setMessage(
          `“${fileName}” başarıyla kaydedildi.`
        );

        return;
      }

      fallbackBlobDownload(
        preparedBlob,
        fileName
      );

      setMessage(
        "İndirme başlatıldı. Tarayıcının indirme bölümünü kontrol et."
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        setMessage(
          "Dosya kaydetme işlemi iptal edildi."
        );

        return;
      }

      console.error(
        "PDF kaydetme hatası:",
        error
      );

      try {
        fallbackBlobDownload(
          preparedBlob,
          fileName
        );

        setMessage(
          "Normal indirme yöntemi başlatıldı. Tarayıcının indirme bölümünü kontrol et."
        );
      } catch (fallbackError) {
        console.error(
          "Yedek indirme hatası:",
          fallbackError
        );

        setMessage(
          "Dosya indirilemedi. PDF’yi yeni sekmede aç düğmesini kullan."
        );
      }
    } finally {
      setIsDownloading(false);
    }
  }

  function openPreparedPdf() {
    if (!preparedBlob) {
      setMessage(
        "Önce filigranlı PDF dosyasını hazırla."
      );

      return;
    }

    const objectUrl =
      URL.createObjectURL(preparedBlob);

    const openedWindow = window.open(
      objectUrl,
      "_blank"
    );

    if (!openedWindow) {
      setMessage(
        "Tarayıcı yeni sekmeyi engelledi. Açılır pencere izni verip tekrar dene."
      );

      URL.revokeObjectURL(objectUrl);

      return;
    }

    setMessage(
      "PDF yeni sekmede açıldı. Açılan sayfadaki indirme düğmesini kullanabilirsin."
    );

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 120000);
  }

  function removePdf() {
    clearPreparedResult();
    clearPreview();

    setPdfFile(null);
    setPageCount(0);
    setPageRange("");
    setPreviewPageNumber(1);
    setProgress(0);
    setProcessStage("");
    setOutputName("PAFTA_FILIGRANLI");
    setMessage("");
  }

  const previewProps = {
    previewUrl,
    previewPageNumber,
    pageCount,
    pageWidth: previewPageSize.width,
    pageHeight: previewPageSize.height,
    position,
    watermarkText:
      normalizedPreviewText || "PAFTA",
    fontSize: parsedFontSize,
    opacity: parsedOpacity,
    rotation: parsedRotation,
    marginMm: parsedMarginMm,
    textColor,
    isLoading: isPreviewLoading,
    error: previewError,
    onPrevious: () =>
      changePreviewPage(
        previewPageNumber - 1
      ),
    onNext: () =>
      changePreviewPage(
        previewPageNumber + 1
      ),
  };

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
            PDF’e Filigran Ekle
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            PDF’e Filigran Ekle
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PDF sayfalarına metin filigranı ekle.
            Gerçek sayfa önizlemesi üzerinden
            boyutu, açıyı, konumu, rengi ve
            görünürlüğü kontrol et.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0 space-y-8">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
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
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-2xl font-bold text-cyan-300">
                    WM
                  </div>

                  <p className="mt-5 text-lg font-semibold">
                    PDF dosyasını buraya bırak
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    En fazla 150 MB boyutunda
                    bir PDF seç.
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
            </section>

            {pdfFile && (
              <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6 xl:hidden">
                <WatermarkPreview
                  {...previewProps}
                />
              </section>
            )}

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Filigran metni
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="watermark-text"
                  className="mb-2 block text-sm text-slate-400"
                >
                  PDF üzerine eklenecek yazı
                </label>

                <input
                  id="watermark-text"
                  type="text"
                  maxLength={100}
                  value={watermarkText}
                  onChange={(event) =>
                    handleSettingChange(() =>
                      setWatermarkText(
                        event.target.value
                      )
                    )
                  }
                  placeholder="Örneğin: TASLAK"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />

                <p className="mt-2 text-right text-xs text-slate-500">
                  {watermarkText.length} / 100
                </p>

                {normalizedPreviewText !==
                  watermarkText.trim() && (
                  <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
                    <p className="text-sm leading-6 text-amber-200">
                      PDF üzerinde şu şekilde
                      kullanılacak:{" "}
                      <span className="font-semibold">
                        {normalizedPreviewText}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Filigran konumu
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Tekrarlı seçeneği filigranı bütün
                sayfaya yayar.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {positions.map((option) => {
                  const selected =
                    position === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        handleSettingChange(() =>
                          setPosition(option.id)
                        )
                      }
                      className={`rounded-2xl border p-4 text-center transition ${
                        selected
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="block text-2xl">
                        {option.icon}
                      </span>

                      <span className="mt-2 block text-sm font-semibold">
                        {option.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Görünüm ayarları
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <NumberInput
                  id="font-size"
                  label="Yazı boyutu (punto)"
                  value={fontSize}
                  min="8"
                  max="200"
                  step="1"
                  onChange={(value) =>
                    handleSettingChange(() =>
                      setFontSize(value)
                    )
                  }
                />

                <NumberInput
                  id="opacity"
                  label="Görünürlük (%)"
                  value={opacity}
                  min="5"
                  max="100"
                  step="1"
                  onChange={(value) =>
                    handleSettingChange(() =>
                      setOpacity(value)
                    )
                  }
                />

                <NumberInput
                  id="rotation"
                  label="Döndürme açısı (°)"
                  value={rotation}
                  min="-180"
                  max="180"
                  step="1"
                  onChange={(value) =>
                    handleSettingChange(() =>
                      setRotation(value)
                    )
                  }
                />

                <NumberInput
                  id="margin"
                  label="Kenardan uzaklık (mm)"
                  value={marginMm}
                  min="0"
                  max="100"
                  step="1"
                  disabled={
                    position === "center" ||
                    position === "repeated"
                  }
                  onChange={(value) =>
                    handleSettingChange(() =>
                      setMarginMm(value)
                    )
                  }
                />
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm text-slate-400">
                  Filigran rengi
                </p>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {textColors.map((color) => {
                    const selected =
                      textColor === color.id;

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() =>
                          handleSettingChange(() =>
                            setTextColor(color.id)
                          )
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
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Sayfa seçimi
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="page-range"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Filigran eklenecek sayfalar
                </label>

                <input
                  id="page-range"
                  type="text"
                  value={pageRange}
                  onChange={(event) =>
                    handleSettingChange(() =>
                      setPageRange(
                        event.target.value
                      )
                    )
                  }
                  placeholder="Örneğin: 1-3, 5, 8"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Aralıkları tire ile, ayrı
                  sayfaları virgülle yaz. Örnek:
                  1-4, 7, 10-12
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
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
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
                    placeholder="PAFTA_FILIGRANLI"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                  />

                  <span className="border-l border-slate-700 px-4 text-slate-400">
                    .pdf
                  </span>
                </div>
              </div>
            </section>
          </section>

          <aside className="hidden max-h-[calc(100vh-7rem)] self-start overflow-y-auto pr-1 xl:sticky xl:top-24 xl:block">
            <div className="space-y-5">
              <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
                <WatermarkPreview
                  {...previewProps}
                />
              </section>

              <ActionPanel
                pageCount={pageCount}
                selectedPageCount={
                  selectedPages.length
                }
                isReading={isReading}
                isCreating={isCreating}
                isDownloading={isDownloading}
                progress={progress}
                processStage={processStage}
                preparedBlob={preparedBlob}
                pdfFile={pdfFile}
                onCreate={createWatermarkedPdf}
                onDownload={
                  downloadWatermarkedPdf
                }
                onOpen={openPreparedPdf}
              />

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
                  Filigran ekleme ve önizleme
                  işlemleri tarayıcında yapılır.
                  PDF dosyan PAFTA sunucusuna
                  gönderilmez.
                </p>
              </section>
            </div>
          </aside>
        </div>

        <div className="mt-8 space-y-5 xl:hidden">
          <ActionPanel
            pageCount={pageCount}
            selectedPageCount={
              selectedPages.length
            }
            isReading={isReading}
            isCreating={isCreating}
            isDownloading={isDownloading}
            progress={progress}
            processStage={processStage}
            preparedBlob={preparedBlob}
            pdfFile={pdfFile}
            onCreate={createWatermarkedPdf}
            onDownload={downloadWatermarkedPdf}
            onOpen={openPreparedPdf}
          />

          {message && (
            <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
              <p className="text-sm leading-6 text-slate-300">
                {message}
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function WatermarkPreview({
  previewUrl,
  previewPageNumber,
  pageCount,
  pageWidth,
  pageHeight,
  position,
  watermarkText,
  fontSize,
  opacity,
  rotation,
  marginMm,
  textColor,
  isLoading,
  error,
  onPrevious,
  onNext,
}: {
  previewUrl: string | null;
  previewPageNumber: number;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
  position: WatermarkPosition;
  watermarkText: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  marginMm: number;
  textColor: TextColor;
  isLoading: boolean;
  error: string;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Gerçek sayfa önizlemesi
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Sayfa {previewPageNumber} /{" "}
            {pageCount || 0}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={
              previewPageNumber <= 1 ||
              isLoading
            }
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Önceki sayfa"
          >
            ←
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={
              previewPageNumber >= pageCount ||
              isLoading
            }
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Sonraki sayfa"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-5 flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-3">
        {isLoading ? (
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

            <p className="mt-4 text-sm text-slate-400">
              Sayfa önizlemesi hazırlanıyor...
            </p>
          </div>
        ) : error ? (
          <p className="max-w-xs text-center text-sm leading-6 text-red-300">
            {error}
          </p>
        ) : previewUrl &&
          pageWidth > 0 &&
          pageHeight > 0 ? (
          <div
            className="relative w-full overflow-hidden bg-white shadow-2xl"
            style={{
              aspectRatio: `${pageWidth} / ${pageHeight}`,
              maxHeight: "560px",
            }}
          >
            {/* Blob URL is generated locally and cannot use next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={`PDF sayfası ${previewPageNumber}`}
              decoding="async"
              className="absolute inset-0 h-full w-full object-fill"
            />

            <WatermarkSvgOverlay
              pageWidth={pageWidth}
              pageHeight={pageHeight}
              position={position}
              watermarkText={watermarkText}
              fontSize={fontSize}
              opacity={opacity}
              rotation={rotation}
              marginMm={marginMm}
              textColor={textColor}
            />
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500">
            Önizleme için bir PDF yükle.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Önizleme, PDF ile aynı sayfa ölçüsü ve
        punto değerlerini kullanır.
      </p>
    </div>
  );
}

function WatermarkSvgOverlay({
  pageWidth,
  pageHeight,
  position,
  watermarkText,
  fontSize,
  opacity,
  rotation,
  marginMm,
  textColor,
}: {
  pageWidth: number;
  pageHeight: number;
  position: WatermarkPosition;
  watermarkText: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  marginMm: number;
  textColor: TextColor;
}) {
  const safeFontSize =
    Number.isFinite(fontSize)
      ? Math.max(8, fontSize)
      : 48;

  const safeOpacity = Math.min(
    1,
    Math.max(
      0.05,
      Number.isFinite(opacity)
        ? opacity / 100
        : 0.2
    )
  );

  const safeRotation =
    Number.isFinite(rotation)
      ? rotation
      : -35;

  const marginPoints = mmToPoints(
    Number.isFinite(marginMm)
      ? Math.max(0, marginMm)
      : 15
  );

  const color = getPreviewColor(textColor);

  if (position === "repeated") {
    return (
      <svg
        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
        aria-hidden="true"
      >
        <RepeatedSvgWatermark
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          watermarkText={watermarkText}
          fontSize={safeFontSize}
          opacity={safeOpacity}
          rotation={safeRotation}
          color={color}
        />
      </svg>
    );
  }

  if (position === "center") {
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    return (
      <svg
        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
        aria-hidden="true"
      >
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fillOpacity={safeOpacity}
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="700"
          fontSize={safeFontSize}
          transform={`rotate(${-safeRotation} ${centerX} ${centerY})`}
        >
          {watermarkText}
        </text>
      </svg>
    );
  }

  const coordinates =
    getSvgWatermarkCoordinates({
      pageWidth,
      pageHeight,
      position,
      marginPoints,
      watermarkText,
      fontSize: safeFontSize,
    });

  return (
    <svg
      viewBox={`0 0 ${pageWidth} ${pageHeight}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      <text
        x={coordinates.x}
        y={coordinates.y}
        fill={color}
        fillOpacity={safeOpacity}
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="700"
        fontSize={safeFontSize}
        transform={`rotate(${-safeRotation} ${coordinates.x} ${coordinates.y})`}
      >
        {watermarkText}
      </text>
    </svg>
  );
}

function RepeatedSvgWatermark({
  pageWidth,
  pageHeight,
  watermarkText,
  fontSize,
  opacity,
  rotation,
  color,
}: {
  pageWidth: number;
  pageHeight: number;
  watermarkText: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  color: string;
}) {
  const estimatedTextWidth =
    estimateHelveticaBoldTextWidth(
      watermarkText,
      fontSize
    );

  const horizontalGap = Math.max(
    estimatedTextWidth + 90,
    pageWidth / 3
  );

  const verticalGap = Math.max(
    fontSize + 110,
    pageHeight / 4
  );

  const items: {
    x: number;
    y: number;
    key: string;
  }[] = [];

  let rowIndex = 0;

  for (
    let pdfY = -fontSize;
    pdfY < pageHeight + verticalGap;
    pdfY += verticalGap
  ) {
    const rowOffset =
      rowIndex % 2 === 0
        ? -horizontalGap / 3
        : horizontalGap / 5;

    for (
      let x = rowOffset;
      x < pageWidth + horizontalGap;
      x += horizontalGap
    ) {
      items.push({
        x,
        y: pageHeight - pdfY,
        key: `${rowIndex}-${Math.round(x)}`,
      });
    }

    rowIndex += 1;
  }

  return (
    <>
      {items.map((item) => (
        <text
          key={item.key}
          x={item.x}
          y={item.y}
          fill={color}
          fillOpacity={opacity}
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="700"
          fontSize={fontSize}
          transform={`rotate(${-rotation} ${item.x} ${item.y})`}
        >
          {watermarkText}
        </text>
      ))}
    </>
  );
}

function getSvgWatermarkCoordinates({
  pageWidth,
  pageHeight,
  position,
  marginPoints,
  watermarkText,
  fontSize,
}: {
  pageWidth: number;
  pageHeight: number;
  position: Exclude<
    WatermarkPosition,
    "repeated" | "center"
  >;
  marginPoints: number;
  watermarkText: string;
  fontSize: number;
}) {
  const textWidth =
    estimateHelveticaBoldTextWidth(
      watermarkText,
      fontSize
    );

  const textHeight =
    estimateHelveticaTextHeight(fontSize);

  let pdfX = marginPoints;
  let pdfY = marginPoints;

  if (
    position === "top-center" ||
    position === "bottom-center"
  ) {
    pdfX =
      (pageWidth - textWidth) / 2;
  }

  if (
    position === "top-right" ||
    position === "bottom-right"
  ) {
    pdfX =
      pageWidth -
      marginPoints -
      textWidth;
  }

  if (
    position === "top-left" ||
    position === "top-center" ||
    position === "top-right"
  ) {
    pdfY =
      pageHeight -
      marginPoints -
      textHeight;
  }

  pdfX = Math.max(
    0,
    Math.min(
      pdfX,
      Math.max(0, pageWidth - textWidth)
    )
  );

  pdfY = Math.max(
    0,
    Math.min(
      pdfY,
      Math.max(0, pageHeight - textHeight)
    )
  );

  return {
    x: pdfX,
    y: pageHeight - pdfY,
  };
}

function ActionPanel({
  pageCount,
  selectedPageCount,
  isReading,
  isCreating,
  isDownloading,
  progress,
  processStage,
  preparedBlob,
  pdfFile,
  onCreate,
  onDownload,
  onOpen,
}: {
  pageCount: number;
  selectedPageCount: number;
  isReading: boolean;
  isCreating: boolean;
  isDownloading: boolean;
  progress: number;
  processStage: string;
  preparedBlob: Blob | null;
  pdfFile: File | null;
  onCreate: () => void;
  onDownload: () => void;
  onOpen: () => void;
}) {
  return (
    <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
      <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
        Filigran özeti
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <SummaryValue
          label="Toplam sayfa"
          value={String(pageCount)}
        />

        <SummaryValue
          label="Seçilen sayfa"
          value={String(selectedPageCount)}
        />
      </div>

      {(isCreating || progress > 0) && (
        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-300">
              {processStage || "İşlem durumu"}
            </span>

            <span className="font-bold text-cyan-300">
              %{progress}
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onCreate}
        disabled={
          !pdfFile ||
          selectedPageCount === 0 ||
          isReading ||
          isCreating ||
          isDownloading
        }
        className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCreating
          ? `Hazırlanıyor: %${progress}`
          : preparedBlob
            ? "PDF’yi yeniden hazırla"
            : "Filigranlı PDF’yi hazırla"}
      </button>

      {preparedBlob && (
        <>
          <button
            type="button"
            onClick={onDownload}
            disabled={
              isDownloading || isCreating
            }
            className="mt-3 w-full rounded-xl bg-emerald-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloading
              ? "Kaydetme penceresi açılıyor..."
              : "Hazır PDF’yi indir"}
          </button>

          <button
            type="button"
            onClick={onOpen}
            disabled={
              isDownloading || isCreating
            }
            className="mt-3 w-full rounded-xl border border-slate-600 px-5 py-4 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            PDF’yi yeni sekmede aç
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Hazır dosya:{" "}
            {formatFileSize(
              preparedBlob.size
            )}
          </p>
        </>
      )}
    </section>
  );
}

function NumberInput({
  id,
  label,
  value,
  min,
  max,
  step,
  disabled = false,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  min: string;
  max: string;
  step: string;
  disabled?: boolean;
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
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
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

function drawSingleWatermark({
  page,
  font,
  text,
  fontSize,
  opacity,
  rotation,
  textColor,
  position,
  marginPoints,
}: {
  page: PDFPage;
  font: PDFFont;
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  textColor: TextColor;
  position: Exclude<
    WatermarkPosition,
    "repeated"
  >;
  marginPoints: number;
}) {
  const { width, height } =
    page.getSize();

  const textWidth =
    font.widthOfTextAtSize(
      text,
      fontSize
    );

  const textHeight =
    font.heightAtSize(fontSize);

  const safeMargin = Math.max(
    0,
    marginPoints
  );

  let x = safeMargin;
  let y = safeMargin;

  if (position === "center") {
    x = (width - textWidth) / 2;
    y = (height - textHeight) / 2;
  }

  if (
    position === "top-center" ||
    position === "bottom-center"
  ) {
    x = (width - textWidth) / 2;
  }

  if (
    position === "top-right" ||
    position === "bottom-right"
  ) {
    x =
      width -
      safeMargin -
      textWidth;
  }

  if (
    position === "top-left" ||
    position === "top-center" ||
    position === "top-right"
  ) {
    y =
      height -
      safeMargin -
      textHeight;
  }

  x = Math.max(
    0,
    Math.min(
      x,
      Math.max(0, width - textWidth)
    )
  );

  y = Math.max(
    0,
    Math.min(
      y,
      Math.max(0, height - textHeight)
    )
  );

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: getPdfColor(textColor),
    opacity,
    rotate: degrees(rotation),
  });
}

function drawRepeatedWatermark({
  page,
  font,
  text,
  fontSize,
  opacity,
  rotation,
  textColor,
}: {
  page: PDFPage;
  font: PDFFont;
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  textColor: TextColor;
}) {
  const { width, height } =
    page.getSize();

  const textWidth =
    font.widthOfTextAtSize(
      text,
      fontSize
    );

  const horizontalGap = Math.max(
    textWidth + 90,
    width / 3
  );

  const verticalGap = Math.max(
    fontSize + 110,
    height / 4
  );

  let rowIndex = 0;

  for (
    let y = -fontSize;
    y < height + verticalGap;
    y += verticalGap
  ) {
    const rowOffset =
      rowIndex % 2 === 0
        ? -horizontalGap / 3
        : horizontalGap / 5;

    for (
      let x = rowOffset;
      x < width + horizontalGap;
      x += horizontalGap
    ) {
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: getPdfColor(textColor),
        opacity,
        rotate: degrees(rotation),
      });
    }

    rowIndex += 1;
  }
}

function fallbackBlobDownload(
  blob: Blob,
  fileName: string
) {
  const objectUrl =
    URL.createObjectURL(blob);

  const downloadLink =
    document.createElement("a");

  downloadLink.href = objectUrl;
  downloadLink.download = fileName;
  downloadLink.rel = "noopener";
  downloadLink.style.display = "none";

  document.body.appendChild(
    downloadLink
  );

  downloadLink.click();

  window.setTimeout(() => {
    downloadLink.remove();

    URL.revokeObjectURL(
      objectUrl
    );
  }, 30000);
}

function canvasToPngBlob(
  canvas: HTMLCanvasElement
) {
  return new Promise<Blob>(
    (resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(
          new Error(
            "Önizleme görüntüsü oluşturulamadı."
          )
        );
      }, "image/png");
    }
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

  const sections =
    cleanedValue.split(",");

  for (const section of sections) {
    const trimmedSection =
      section.trim();

    if (!trimmedSection) {
      continue;
    }

    if (
      trimmedSection.includes("-")
    ) {
      const parts =
        trimmedSection.split("-");

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

      for (
        let page = start;
        page <= end;
        page += 1
      ) {
        pages.add(page);
      }
    } else {
      const page = Number(
        trimmedSection
      );

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
    (first, second) =>
      first - second
  );
}

function getPdfColor(
  color: TextColor
) {
  if (color === "black") {
    return rgb(0, 0, 0);
  }

  if (color === "red") {
    return rgb(0.85, 0.1, 0.1);
  }

  if (color === "blue") {
    return rgb(0.1, 0.3, 0.85);
  }

  if (color === "white") {
    return rgb(1, 1, 1);
  }

  return rgb(0.45, 0.45, 0.45);
}

function getPreviewColor(
  color: TextColor
) {
  if (color === "black") {
    return "#000000";
  }

  if (color === "red") {
    return "#d91919";
  }

  if (color === "blue") {
    return "#1a4dd9";
  }

  if (color === "white") {
    return "#ffffff";
  }

  return "#737373";
}

function estimateHelveticaBoldTextWidth(
  text: string,
  fontSize: number
) {
  let widthUnits = 0;

  for (const character of text) {
    if (" ilI.,'!:;|".includes(character)) {
      widthUnits += 0.28;
    } else if (
      "mwMW@%&#".includes(character)
    ) {
      widthUnits += 0.85;
    } else if (
      "ABCDEFGHJKLMNOPQRSTUVWXYZ".includes(
        character
      )
    ) {
      widthUnits += 0.69;
    } else if (
      "0123456789".includes(character)
    ) {
      widthUnits += 0.56;
    } else {
      widthUnits += 0.55;
    }
  }

  return widthUnits * fontSize;
}

function estimateHelveticaTextHeight(
  fontSize: number
) {
  return fontSize * 0.93;
}

function normalizeWatermarkText(
  value: string
) {
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
    .replace(/[^\x20-\x7E]/g, "");
}

function allowScreenUpdate() {
  return new Promise<void>(
    (resolve) => {
      window.requestAnimationFrame(
        () => {
          window.setTimeout(
            resolve,
            0
          );
        }
      );
    }
  );
}

function mmToPoints(value: number) {
  return value * 2.8346456693;
}

function createOutputFileName(
  value: string
) {
  const normalizedName =
    normalizeFileName(
      value.replace(/\.pdf$/i, "")
    );

  return `${
    normalizedName ||
    "PAFTA_FILIGRANLI"
  }.pdf`;
}

function normalizeFileName(
  value: string
) {
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
    .replace(
      /[^a-zA-Z0-9-_]+/g,
      "_"
    )
    .replace(/_+/g, "_")
    .replace(
      /^[_-]+|[_-]+$/g,
      ""
    )
    .toUpperCase();
}

function formatFileSize(
  bytes: number
) {
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
      Math.log(bytes) /
        Math.log(1024)
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
