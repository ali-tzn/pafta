"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { trackToolEvent } from "@/lib/analytics";

type ViewMode = "normal" | "distance1" | "distance2" | "distance3" | "firstLook" | "gray";

type TextFinding = {
  text: string;
  pointSize: number;
  heightMm: number;
  nearEdge: boolean;
};

type PageAnalysis = {
  widthMm: number;
  heightMm: number;
  textCount: number;
  smallTextCount: number;
  verySmallTextCount: number;
  edgeTextCount: number;
  minPointSize: number | null;
  findings: TextFinding[];
};

type DensityCell = {
  row: number;
  column: number;
  ink: number;
  contrast: number;
  attention: number;
};

const modes: Array<{ key: ViewMode; label: string; description: string }> = [
  { key: "normal", label: "Normal", description: "Ekrandaki özgün görünüm" },
  { key: "distance1", label: "1 metre", description: "Yakın jüri görünümü" },
  { key: "distance2", label: "2 metre", description: "Orta mesafe görünümü" },
  { key: "distance3", label: "3 metre", description: "Uzak görünüm" },
  { key: "firstLook", label: "5 saniye", description: "İlk bakış ve ana kütleler" },
  { key: "gray", label: "Siyah-beyaz", description: "Tonal hiyerarşi kontrolü" },
];

const modeStyles: Record<ViewMode, string> = {
  normal: "none",
  distance1: "blur(0.35px)",
  distance2: "blur(0.8px)",
  distance3: "blur(1.35px)",
  firstLook: "grayscale(1) blur(2.2px) contrast(1.08)",
  gray: "grayscale(1)",
};

function format(value: number, digits = 1) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: digits,
  }).format(value);
}

export default function JuryEyePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<import("pdfjs-dist").PDFDocumentLoadingTask | null>(
    null
  );

  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null);
  const [density, setDensity] = useState<DensityCell[]>([]);
  const [heatmapUrl, setHeatmapUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [mode, setMode] = useState<ViewMode>("normal");
  const [showDensity, setShowDensity] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      void loadingTaskRef.current?.destroy();
    };
  }, []);

  async function loadPdf(file: File) {
    if (
      file.type !== "application/pdf" &&
      !file.name.toLocaleLowerCase("tr-TR").endsWith(".pdf")
    ) {
      setMessage("Jüri Gözü için PDF formatında bir pafta yüklemelisin.");
      return;
    }

    setIsReading(true);
    setMessage("");
    setAnalysis(null);
    setDensity([]);
    setHeatmapUrl("");
    setPreviewUrl("");

    try {
      await loadingTaskRef.current?.destroy();
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
      });
      loadingTaskRef.current = loadingTask;
      const pdf = await loadingTask.promise;
      pdfRef.current = pdf;
      setFileName(file.name);
      setPageCount(pdf.numPages);
      setSelectedPage(1);
      await analyzePage(pdf, 1);
      trackToolEvent("jury_eye", "pdf_analyzed", {
        page_count: pdf.numPages,
      });
    } catch {
      setMessage(
        "PDF okunamadı. Dosya şifreli, bozuk veya desteklenmeyen bir yapıda olabilir."
      );
    } finally {
      setIsReading(false);
    }
  }

  async function analyzePage(
    pdf: import("pdfjs-dist").PDFDocumentProxy,
    pageNumber: number
  ) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const widthMm = (viewport.width * 25.4) / 72;
    const heightMm = (viewport.height * 25.4) / 72;
    const edgeLimitPoints = (10 * 72) / 25.4;
    const textContent = await page.getTextContent();
    const findings: TextFinding[] = [];

    for (const item of textContent.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const pointSize = Math.hypot(item.transform[2], item.transform[3]);
      const heightMmValue = (pointSize * 25.4) / 72;
      const x = item.transform[4];
      const y = item.transform[5];
      const nearEdge =
        x < edgeLimitPoints ||
        y < edgeLimitPoints ||
        x + item.width > viewport.width - edgeLimitPoints ||
        y + pointSize > viewport.height - edgeLimitPoints;

      findings.push({
        text: item.str.trim().slice(0, 80),
        pointSize,
        heightMm: heightMmValue,
        nearEdge,
      });
    }

    const renderScale = Math.min(2, 1400 / Math.max(viewport.width, viewport.height));
    const renderViewport = page.getViewport({ scale: Math.max(renderScale, 1) });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context) {
      canvas.width = Math.round(renderViewport.width);
      canvas.height = Math.round(renderViewport.height);
      await page.render({
        canvas,
        canvasContext: context,
        viewport: renderViewport,
      }).promise;
      const densityResult = calculateDensity(context, canvas.width, canvas.height);
      setDensity(densityResult);
      setHeatmapUrl(createHeatmap(densityResult));
      setPreviewUrl(canvas.toDataURL("image/jpeg", 0.9));
    }

    const sortedFindings = [...findings].sort(
      (first, second) => first.pointSize - second.pointSize
    );
    setAnalysis({
      widthMm,
      heightMm,
      textCount: findings.length,
      smallTextCount: findings.filter((item) => item.pointSize < 8).length,
      verySmallTextCount: findings.filter((item) => item.pointSize < 6).length,
      edgeTextCount: findings.filter((item) => item.nearEdge).length,
      minPointSize: sortedFindings[0]?.pointSize ?? null,
      findings: sortedFindings.slice(0, 12),
    });
    page.cleanup();
  }

  function calculateDensity(
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    const columns = 12;
    const rows = 8;
    const image = context.getImageData(0, 0, width, height).data;
    const cells: DensityCell[] = [];
    const sampleStep = Math.max(2, Math.round(Math.max(width, height) / 500));

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const startX = Math.floor((column * width) / columns);
        const endX = Math.floor(((column + 1) * width) / columns);
        const startY = Math.floor((row * height) / rows);
        const endY = Math.floor(((row + 1) * height) / rows);
        let darkness = 0;
        let luminanceTotal = 0;
        let luminanceSquaredTotal = 0;
        let samples = 0;

        for (let y = startY; y < endY; y += sampleStep) {
          for (let x = startX; x < endX; x += sampleStep) {
            const index = (y * width + x) * 4;
            const luminance =
              image[index] * 0.2126 +
              image[index + 1] * 0.7152 +
              image[index + 2] * 0.0722;
            darkness += 1 - luminance / 255;
            luminanceTotal += luminance;
            luminanceSquaredTotal += luminance * luminance;
            samples += 1;
          }
        }

        const meanLuminance = samples ? luminanceTotal / samples : 255;
        const variance = samples
          ? Math.max(0, luminanceSquaredTotal / samples - meanLuminance ** 2)
          : 0;
        const ink = samples ? darkness / samples : 0;
        const contrast = Math.min(1, Math.sqrt(variance) / 90);
        cells.push({
          row,
          column,
          ink,
          contrast,
          attention: ink * 0.55 + contrast * 0.45,
        });
      }
    }

    const attentionValues = cells.map((cell) => cell.attention);
    const minimum = Math.min(...attentionValues);
    const maximum = Math.max(...attentionValues);
    return cells.map((cell) => ({
      ...cell,
      attention:
        maximum === minimum ? 0 : (cell.attention - minimum) / (maximum - minimum),
    }));
  }

  function createHeatmap(cells: DensityCell[]) {
    const columns = 12;
    const rows = 8;
    const heatCanvas = document.createElement("canvas");
    heatCanvas.width = columns;
    heatCanvas.height = rows;
    const heatContext = heatCanvas.getContext("2d");
    if (!heatContext) return "";

    for (const cell of cells) {
      const hue = 205 - cell.attention * 205;
      const alpha = 0.12 + cell.attention * 0.72;
      heatContext.fillStyle = `hsla(${hue}, 90%, 52%, ${alpha})`;
      heatContext.fillRect(cell.column, cell.row, 1, 1);
    }
    return heatCanvas.toDataURL("image/png");
  }

  async function changePage(pageNumber: number) {
    if (!pdfRef.current) return;
    setSelectedPage(pageNumber);
    setIsReading(true);
    try {
      await analyzePage(pdfRef.current, pageNumber);
    } finally {
      setIsReading(false);
    }
  }

  async function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) await loadPdf(file);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) await loadPdf(file);
  }

  const score = useMemo(() => {
    if (!analysis) return 0;
    const smallRatio = analysis.textCount
      ? analysis.smallTextCount / analysis.textCount
      : 0;
    const edgeRatio = analysis.textCount
      ? analysis.edgeTextCount / analysis.textCount
      : 0;
    const densityValues = density.map((cell) => cell.ink);
    const densityMean = densityValues.length
      ? densityValues.reduce((total, value) => total + value, 0) /
        densityValues.length
      : 0;
    const densityDeviation = densityValues.length
      ? Math.sqrt(
          densityValues.reduce(
            (total, value) => total + (value - densityMean) ** 2,
            0
          ) / densityValues.length
        )
      : 0;
    return Math.max(
      0,
      Math.round(
        100 -
          smallRatio * 45 -
          edgeRatio * 25 -
          Math.max(0, densityDeviation - 0.22) * 35
      )
    );
  }, [analysis, density]);

  const highAttentionCells = density.filter(
    (cell) => cell.attention > 0.78
  ).length;
  const densitySummary = useMemo(() => {
    if (!density.length) {
      return {
        balance: 100,
        emptyCells: 0,
        focusLabel: "—",
      };
    }

    const totalAttention = density.reduce(
      (total, cell) => total + cell.attention,
      0
    );
    const centerX =
      density.reduce(
        (total, cell) => total + ((cell.column + 0.5) / 12) * cell.attention,
        0
      ) / Math.max(totalAttention, 0.001);
    const centerY =
      density.reduce(
        (total, cell) => total + ((cell.row + 0.5) / 8) * cell.attention,
        0
      ) / Math.max(totalAttention, 0.001);
    const offset = Math.hypot(centerX - 0.5, centerY - 0.5);
    const strongest = [...density].sort(
      (first, second) => second.attention - first.attention
    )[0];
    const horizontal =
      strongest.column < 4 ? "sol" : strongest.column > 7 ? "sağ" : "orta";
    const vertical =
      strongest.row < 3 ? "üst" : strongest.row > 4 ? "alt" : "orta";

    return {
      balance: Math.max(0, Math.round(100 - offset * 145)),
      emptyCells: density.filter(
        (cell) => cell.ink < 0.035 && cell.contrast < 0.12
      ).length,
      focusLabel:
        horizontal === "orta" && vertical === "orta"
          ? "merkez"
          : `${vertical} ${horizontal}`,
    };
  }, [density]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-400">
          PAFTA / Görsel Analiz
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Jüri Gözü
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">
          Paftanın yalnızca ekranda değil, basıldığında ve jüri mesafesinden
          bakıldığında nasıl algılanacağını kontrol et.
        </p>

        {!analysis && (
          <section className="mt-9 max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleInput}
              className="hidden"
            />
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition ${
                isDragging
                  ? "border-cyan-300 bg-cyan-400/10"
                  : "border-slate-700 bg-slate-950/60 hover:border-cyan-400/60"
              }`}
            >
              <p className="text-4xl">◉</p>
              <p className="mt-4 text-lg font-bold">
                {isReading ? "Pafta analiz ediliyor…" : "PDF paftanı yükle"}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Dosya yalnızca tarayıcında işlenir, sunucuya gönderilmez.
              </p>
            </div>
            {message && <p className="mt-4 text-rose-300">{message}</p>}
          </section>
        )}

        {analysis && (
          <>
            <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
              <div>
                <p className="break-all font-semibold">{fileName}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {pageCount} sayfa · {format(analysis.widthMm)} ×{" "}
                  {format(analysis.heightMm)} mm
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {pageCount > 1 && (
                  <select
                    value={selectedPage}
                    onChange={(event) => changePage(Number(event.target.value))}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2"
                  >
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                      (page) => (
                        <option key={page} value={page}>Sayfa {page}</option>
                      )
                    )}
                  </select>
                )}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-xl border border-cyan-400/30 px-4 py-2 font-semibold text-cyan-300"
                >
                  Başka PDF seç
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleInput}
                  className="hidden"
                />
              </div>
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
              <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {modes.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      title={item.description}
                      onClick={() => setMode(item.key)}
                      className={`rounded-xl px-3 py-3 text-sm font-semibold ${
                        mode === item.key
                          ? "bg-cyan-400 text-slate-950"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-400">
                    {modes.find((item) => item.key === mode)?.description}
                  </p>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={showDensity}
                      onChange={(event) => setShowDensity(event.target.checked)}
                      className="h-4 w-4 accent-cyan-400"
                    />
                    Görsel dikkat haritası
                  </label>
                </div>

                <div className="mt-5 flex min-h-96 items-center justify-center overflow-hidden rounded-xl bg-slate-950 p-3">
                  <div className="relative max-h-[75vh] max-w-full overflow-hidden bg-white shadow-2xl">
                    {/* A standard img keeps the locally generated data URL in-browser. */}
                    <img
                      src={previewUrl}
                      alt={`Jüri Gözü önizlemesi, sayfa ${selectedPage}`}
                      className="block max-h-[72vh] max-w-full object-contain transition duration-300"
                      style={{ filter: modeStyles[mode] }}
                    />
                    {showDensity && heatmapUrl && (
                      <>
                        <img
                          src={heatmapUrl}
                          alt=""
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 h-full w-full opacity-75 mix-blend-multiply"
                          style={{
                            imageRendering: "auto",
                            filter: "blur(14px) saturate(1.35)",
                            transform: "scale(1.04)",
                          }}
                        />
                        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1.5 text-[11px] text-white backdrop-blur">
                          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                          düşük dikkat
                          <span className="ml-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
                          orta
                          <span className="ml-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
                          yüksek
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </section>

              <aside className="space-y-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <p className="text-sm text-slate-400">Okunabilirlik puanı</p>
                  <p className="mt-2 text-5xl font-bold">{score}</p>
                  <p className={`mt-3 text-sm font-semibold ${
                    score >= 85
                      ? "text-emerald-300"
                      : score >= 65
                        ? "text-amber-300"
                        : "text-rose-300"
                  }`}>
                    {score >= 85
                      ? "Güçlü görünüm"
                      : score >= 65
                        ? "Bazı noktalar geliştirilmeli"
                        : "Okunabilirlik kontrolü gerekli"}
                  </p>
                </div>

                <Metric
                  title="Metin analizi"
                  value={`${analysis.textCount} metin`}
                  detail={`${analysis.smallTextCount} tanesi 8 pt altında, ${analysis.verySmallTextCount} tanesi 6 pt altında.`}
                  status={analysis.smallTextCount === 0 ? "good" : "warning"}
                />
                <Metric
                  title="Baskı güvenli alanı"
                  value={`${analysis.edgeTextCount} risk`}
                  detail="10 mm güvenli kenara yaklaşan metin sayısı."
                  status={analysis.edgeTextCount === 0 ? "good" : "warning"}
                />
                <Metric
                  title="Görsel denge"
                  value={`${densitySummary.balance}/100`}
                  detail={`Ana dikkat merkezi: ${densitySummary.focusLabel}. ${highAttentionCells} güçlü odak hücresi bulundu.`}
                  status={densitySummary.balance >= 72 ? "good" : "warning"}
                />
              </aside>
            </div>

            <section className="mt-6 grid gap-4 md:grid-cols-3">
              <InsightCard
                title="Ana odak"
                value={densitySummary.focusLabel}
                detail="Koyu alanlar ve yerel kontrast birlikte değerlendirilerek tahmin edilir."
              />
              <InsightCard
                title="Boş alan"
                value={`%${format((densitySummary.emptyCells / 96) * 100, 0)}`}
                detail="Neredeyse hiç görsel veya tonal hareket bulunmayan yaklaşık alan oranı."
              />
              <InsightCard
                title="Dikkat kümeleri"
                value={`${highAttentionCells} bölge`}
                detail={
                  highAttentionCells > 16
                    ? "Çok sayıda güçlü bölge birbiriyle yarışıyor olabilir."
                    : "Odakların sayısı genel tarama için yönetilebilir görünüyor."
                }
              />
            </section>

            <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
              <h2 className="text-xl font-bold">En küçük metinler</h2>
              <p className="mt-2 text-sm text-slate-400">
                PDF’de algılanabilen metin katmanına göre sıralanmıştır. Metinler
                görsele dönüştürülmüşse bu listede okunamaz.
              </p>
              {analysis.findings.length ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="text-slate-400">
                      <tr>
                        <th className="border-b border-slate-800 px-3 py-3">Metin</th>
                        <th className="border-b border-slate-800 px-3 py-3">Punto</th>
                        <th className="border-b border-slate-800 px-3 py-3">Yaklaşık yükseklik</th>
                        <th className="border-b border-slate-800 px-3 py-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.findings.map((finding, index) => (
                        <tr key={`${finding.text}-${index}`}>
                          <td className="border-b border-slate-800/70 px-3 py-3 text-slate-300">
                            {finding.text}
                          </td>
                          <td className="border-b border-slate-800/70 px-3 py-3">
                            {format(finding.pointSize)} pt
                          </td>
                          <td className="border-b border-slate-800/70 px-3 py-3">
                            {format(finding.heightMm, 2)} mm
                          </td>
                          <td className={`border-b border-slate-800/70 px-3 py-3 ${
                            finding.pointSize < 6
                              ? "text-rose-300"
                              : finding.pointSize < 8
                                ? "text-amber-300"
                                : "text-emerald-300"
                          }`}>
                            {finding.pointSize < 6
                              ? "Çok küçük"
                              : finding.pointSize < 8
                                ? "Kontrol et"
                                : "Uygun"}
                            {finding.nearEdge ? " · Kenara yakın" : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-5 rounded-xl bg-amber-400/10 p-4 text-amber-200">
                  PDF’de seçilebilir metin bulunamadı. Pafta tamamen görsele
                  dönüştürülmüş olabilir.
                </p>
              )}
            </section>

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-sm leading-7 text-slate-400">
              Jüri Gözü bir ön kontrol aracıdır. Mesafe görünümleri ekran
              boyutuna göre yaklaşık simülasyonlardır; gerçek baskı, salon
              aydınlatması ve izleme mesafesi sonucu değiştirebilir.
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
  detail,
  status,
}: {
  title: string;
  value: string;
  detail: string;
  status: "good" | "warning";
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{title}</p>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            status === "good" ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />
      </div>
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  );
}

function InsightCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold capitalize text-cyan-300">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </article>
  );
}
