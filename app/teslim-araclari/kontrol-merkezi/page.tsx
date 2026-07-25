"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { trackToolEvent } from "@/lib/analytics";

type PaperKey = "A0" | "A1" | "A2" | "A3" | "A4" | "70x100" | "custom";
type Orientation = "landscape" | "portrait" | "either";
type Status = "pass" | "warning" | "fail";

type Inspection = {
  name: string;
  kind: "pdf" | "image";
  sizeMb: number;
  pageCount: number;
  widthMm: number;
  heightMm: number;
  widthPx?: number;
  heightPx?: number;
  dpi?: number;
  mixedPageSizes?: boolean;
};

type Check = {
  title: string;
  detail: string;
  status: Status;
  fixHref?: string;
  fixLabel?: string;
};

const papers: Record<Exclude<PaperKey, "custom">, [number, number]> = {
  A0: [841, 1189],
  A1: [594, 841],
  A2: [420, 594],
  A3: [297, 420],
  A4: [210, 297],
  "70x100": [700, 1000],
};

const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];

function format(value: number, digits = 1) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: digits,
  }).format(value);
}

function normalizedDimensions(width: number, height: number) {
  return [Math.min(width, height), Math.max(width, height)] as const;
}

export default function SubmissionInspectorPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [paper, setPaper] = useState<PaperKey>("A1");
  const [customWidth, setCustomWidth] = useState(700);
  const [customHeight, setCustomHeight] = useState(1000);
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [maxSizeMb, setMaxSizeMb] = useState(20);
  const [expectedPages, setExpectedPages] = useState(2);
  const [minDpi, setMinDpi] = useState(300);
  const [requiredName, setRequiredName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [message, setMessage] = useState("");

  const targetDimensions =
    paper === "custom" ? [customWidth, customHeight] : papers[paper];

  const checks = useMemo<Check[]>(() => {
    if (!inspection) return [];

    const list: Check[] = [];
    const [actualShort, actualLong] = normalizedDimensions(
      inspection.widthMm,
      inspection.heightMm
    );
    const [targetShort, targetLong] = normalizedDimensions(
      targetDimensions[0],
      targetDimensions[1]
    );
    const dimensionTolerance = 2;
    const paperMatches =
      Math.abs(actualShort - targetShort) <= dimensionTolerance &&
      Math.abs(actualLong - targetLong) <= dimensionTolerance;

    list.push({
      title: "Kâğıt ölçüsü",
      detail:
        inspection.kind === "image"
          ? `Görsel ${targetDimensions[0]} × ${targetDimensions[1]} mm hedef paftaya yerleştirilmiş kabul edilerek DPI hesaplandı. JPG ve PNG dosyalarında fiziksel kâğıt ölçüsü kesin olarak doğrulanamaz.`
          : paperMatches
        ? `${format(inspection.widthMm)} × ${format(inspection.heightMm)} mm; hedef ölçüyle uyumlu.`
        : `Dosya ${format(inspection.widthMm)} × ${format(
            inspection.heightMm
          )} mm, hedef ${targetDimensions[0]} × ${targetDimensions[1]} mm.`,
      status:
        inspection.kind === "image"
          ? "warning"
          : paperMatches
            ? "pass"
            : "fail",
      fixHref:
        inspection.kind === "pdf" && !paperMatches
          ? "/pdf-tools/resize-pages"
          : undefined,
      fixLabel: "Sayfa boyutunu düzelt",
    });

    const actualOrientation =
      Math.abs(inspection.widthMm - inspection.heightMm) < 1
        ? "square"
        : inspection.widthMm > inspection.heightMm
          ? "landscape"
          : "portrait";
    const orientationMatches =
      orientation === "either" || orientation === actualOrientation;
    list.push({
      title: "Sayfa yönü",
      detail: orientationMatches
        ? `Dosya ${actualOrientation === "landscape" ? "yatay" : actualOrientation === "portrait" ? "dikey" : "kare"} yönde.`
        : `Dosya ${actualOrientation === "landscape" ? "yatay" : "dikey"}; teslim şartı ${
            orientation === "landscape" ? "yatay" : "dikey"
          }.`,
      status: orientationMatches ? "pass" : "fail",
      fixHref: orientationMatches ? undefined : "/pdf-tools/organize",
      fixLabel: "Sayfayı döndür",
    });

    list.push({
      title: "Dosya boyutu",
      detail: `${format(inspection.sizeMb, 2)} MB / izin verilen en fazla ${maxSizeMb} MB.`,
      status: inspection.sizeMb <= maxSizeMb ? "pass" : "fail",
      fixHref:
        inspection.sizeMb <= maxSizeMb ? undefined : "/pdf-tools/compress",
      fixLabel: "PDF’yi sıkıştır",
    });

    list.push({
      title: "Sayfa sayısı",
      detail: `${inspection.pageCount} sayfa bulundu; teslim şartı ${expectedPages} sayfa.`,
      status: inspection.pageCount === expectedPages ? "pass" : "fail",
      fixHref:
        inspection.pageCount === expectedPages ? undefined : "/pdf-tools/organize",
      fixLabel: "Sayfaları düzenle",
    });

    if (inspection.mixedPageSizes) {
      list.push({
        title: "Sayfa tutarlılığı",
        detail: "PDF içindeki sayfaların kâğıt ölçüleri birbirinden farklı.",
        status: "warning",
        fixHref: "/pdf-tools/resize-pages",
        fixLabel: "Ölçüleri eşitle",
      });
    } else if (inspection.kind === "pdf" && inspection.pageCount > 1) {
      list.push({
        title: "Sayfa tutarlılığı",
        detail: "PDF içindeki sayfalar aynı ölçüde.",
        status: "pass",
      });
    }

    if (inspection.kind === "image" && inspection.dpi) {
      list.push({
        title: "Baskı çözünürlüğü",
        detail: `${format(inspection.dpi, 0)} DPI; istenen en az ${minDpi} DPI.`,
        status: inspection.dpi >= minDpi ? "pass" : "fail",
        fixHref:
          inspection.dpi >= minDpi ? undefined : "/pdf-tools/resize-pages",
        fixLabel: "Pafta boyutunu düzenle",
      });
    } else {
      list.push({
        title: "Baskı çözünürlüğü",
        detail:
          "PDF’de vektör ve farklı çözünürlükte görseller birlikte bulunabildiği için tek bir gerçek DPI değeri güvenilir biçimde ölçülemez.",
        status: "warning",
      });
    }

    const normalizedRequired = requiredName.trim().toLocaleLowerCase("tr-TR");
    if (normalizedRequired) {
      const nameMatches = inspection.name
        .toLocaleLowerCase("tr-TR")
        .includes(normalizedRequired);
      list.push({
        title: "Dosya adı",
        detail: nameMatches
          ? `“${inspection.name}” gerekli ifadeyi içeriyor.`
          : `Dosya adı “${requiredName.trim()}” ifadesini içermiyor.`,
        status: nameMatches ? "pass" : "fail",
        fixHref: nameMatches
          ? undefined
          : "/student-tools/file-name-generator",
        fixLabel: "Dosya adı oluştur",
      });
    } else {
      list.push({
        title: "Dosya adı",
        detail: `Dosya adı: ${inspection.name}. İstersen şartlarda aranacak ifadeyi yazabilirsin.`,
        status: "warning",
        fixHref: "/student-tools/file-name-generator",
        fixLabel: "Adlandırma aracını aç",
      });
    }

    return list;
  }, [
    expectedPages,
    inspection,
    maxSizeMb,
    minDpi,
    orientation,
    requiredName,
    targetDimensions,
  ]);

  const score = useMemo(() => {
    if (!checks.length) return 0;
    const points = checks.reduce(
      (total, check) =>
        total + (check.status === "pass" ? 1 : check.status === "warning" ? 0.5 : 0),
      0
    );
    return Math.round((points / checks.length) * 100);
  }, [checks]);

  async function inspectFile(file: File) {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedExtensions.includes(extension)) {
      setMessage("Lütfen PDF, JPG veya PNG dosyası seç.");
      return;
    }

    setMessage("");
    setInspection(null);
    setIsReading(true);

    try {
      if (extension === ".pdf") {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array(await file.arrayBuffer()),
        });
        const pdf = await loadingTask.promise;
        const sizes: Array<[number, number]> = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1 });
          sizes.push([
            (viewport.width * 25.4) / 72,
            (viewport.height * 25.4) / 72,
          ]);
          page.cleanup();
        }

        const [widthMm, heightMm] = sizes[0];
        const [firstShort, firstLong] = normalizedDimensions(widthMm, heightMm);
        const mixedPageSizes = sizes.some(([width, height]) => {
          const [short, long] = normalizedDimensions(width, height);
          return Math.abs(short - firstShort) > 2 || Math.abs(long - firstLong) > 2;
        });

        setInspection({
          name: file.name,
          kind: "pdf",
          sizeMb: file.size / 1024 / 1024,
          pageCount: pdf.numPages,
          widthMm,
          heightMm,
          mixedPageSizes,
        });
        await loadingTask.destroy();
      } else {
        const url = URL.createObjectURL(file);
        const image = new Image();
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Görsel okunamadı."));
          image.src = url;
        });
        const isLandscape = orientation === "landscape";
        const widthMm =
          orientation === "either"
            ? targetDimensions[0]
            : isLandscape
              ? Math.max(...targetDimensions)
              : Math.min(...targetDimensions);
        const heightMm =
          orientation === "either"
            ? targetDimensions[1]
            : isLandscape
              ? Math.min(...targetDimensions)
              : Math.max(...targetDimensions);
        const dpiX = image.naturalWidth / (widthMm / 25.4);
        const dpiY = image.naturalHeight / (heightMm / 25.4);

        setInspection({
          name: file.name,
          kind: "image",
          sizeMb: file.size / 1024 / 1024,
          pageCount: 1,
          widthMm,
          heightMm,
          widthPx: image.naturalWidth,
          heightPx: image.naturalHeight,
          dpi: Math.min(dpiX, dpiY),
        });
        URL.revokeObjectURL(url);
      }

      trackToolEvent("submission_inspector", "file_inspected", {
        file_type: extension,
      });
    } catch {
      setMessage(
        "Dosya okunamadı. PDF şifreli veya bozuk, görsel ise desteklenmeyen bir yapıda olabilir."
      );
    } finally {
      setIsReading(false);
    }
  }

  async function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) await inspectFile(file);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) await inspectFile(file);
  }

  const statusStyles: Record<Status, string> = {
    pass: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    warning: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    fail: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-400">
          PAFTA Teslim Asistanı
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold sm:text-5xl">
          Mimari Teslim Kontrol Merkezi
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">
          Teslim şartlarını gir, paftanı yükle ve teknik sorunları göndermeden
          önce gör. Dosyan tamamen tarayıcında işlenir ve sunucuya gönderilmez.
        </p>

        <div className="mt-9 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <h2 className="text-xl font-bold">1. Teslim şartları</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-300">
                Kâğıt ölçüsü
                <select
                  value={paper}
                  onChange={(event) => setPaper(event.target.value as PaperKey)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3"
                >
                  {Object.keys(papers).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                  <option value="custom">Özel ölçü</option>
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Yön
                <select
                  value={orientation}
                  onChange={(event) =>
                    setOrientation(event.target.value as Orientation)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3"
                >
                  <option value="landscape">Yatay</option>
                  <option value="portrait">Dikey</option>
                  <option value="either">Fark etmez</option>
                </select>
              </label>
              {paper === "custom" && (
                <>
                  <label className="text-sm text-slate-300">
                    Kısa kenar (mm)
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(event) => setCustomWidth(Number(event.target.value))}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3"
                    />
                  </label>
                  <label className="text-sm text-slate-300">
                    Uzun kenar (mm)
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(event) => setCustomHeight(Number(event.target.value))}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3"
                    />
                  </label>
                </>
              )}
              <label className="text-sm text-slate-300">
                En fazla dosya boyutu (MB)
                <input
                  type="number"
                  min="1"
                  value={maxSizeMb}
                  onChange={(event) => setMaxSizeMb(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3"
                />
              </label>
              <label className="text-sm text-slate-300">
                İstenen sayfa sayısı
                <input
                  type="number"
                  min="1"
                  value={expectedPages}
                  onChange={(event) => setExpectedPages(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3"
                />
              </label>
              <label className="text-sm text-slate-300">
                Görsellerde en az DPI
                <select
                  value={minDpi}
                  onChange={(event) => setMinDpi(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3"
                >
                  <option value="96">96 DPI</option>
                  <option value="150">150 DPI</option>
                  <option value="300">300 DPI</option>
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Dosya adında bulunması gereken ifade
                <input
                  type="text"
                  value={requiredName}
                  onChange={(event) => setRequiredName(event.target.value)}
                  placeholder="Örn. MIM401_Ali"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <h2 className="text-xl font-bold">2. Dosyanı yükle</h2>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
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
              className={`mt-5 cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
                isDragging
                  ? "border-cyan-300 bg-cyan-400/10"
                  : "border-slate-700 bg-slate-950/60 hover:border-cyan-400/60"
              }`}
            >
              <p className="text-3xl">⇧</p>
              <p className="mt-3 font-semibold">
                {isReading ? "Dosya inceleniyor…" : "PDF, JPG veya PNG seç"}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Tıkla veya dosyayı bu alana sürükle
              </p>
            </div>
            {message && <p className="mt-4 text-sm text-rose-300">{message}</p>}

            {inspection && (
              <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
                <p className="break-all font-semibold">{inspection.name}</p>
                <p className="mt-2 text-sm text-slate-400">
                  {inspection.kind === "pdf"
                    ? `${inspection.pageCount} sayfa · ${format(inspection.widthMm)} × ${format(inspection.heightMm)} mm`
                    : `${inspection.widthPx} × ${inspection.heightPx} piksel`}
                  {" · "}
                  {format(inspection.sizeMb, 2)} MB
                </p>
              </div>
            )}
          </section>
        </div>

        {inspection && (
          <section className="mt-7 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Teslime hazırlık puanı</p>
                <h2 className="mt-1 text-4xl font-bold">{score}%</h2>
              </div>
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  score === 100
                    ? "bg-emerald-400/15 text-emerald-300"
                    : score >= 70
                      ? "bg-amber-400/15 text-amber-300"
                      : "bg-rose-400/15 text-rose-300"
                }`}
              >
                {score === 100 ? "Teslime hazır" : "Kontrol gerekli"}
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {checks.map((check) => (
                <article
                  key={check.title}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-bold ${statusStyles[check.status]}`}
                  >
                    {check.status === "pass" ? "✓" : check.status === "warning" ? "!" : "×"}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{check.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {check.detail}
                    </p>
                  </div>
                  {check.fixHref && (
                    <Link
                      href={check.fixHref}
                      className="shrink-0 rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/10"
                    >
                      {check.fixLabel} →
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-xl font-bold">Kontrolün kapsamı</h2>
          <p className="mt-3 leading-7 text-slate-400">
            Bu araç teknik teslim hatalarını yakalamaya yardımcı olur; paftanın
            mimari niteliğini veya jüri kurallarının tamamını garanti etmez.
            Özellikle PDF içindeki tek tek görsellerin gerçek DPI değerleri
            dosya yapısına göre değişebildiğinden PDF için kesin DPI sonucu
            verilmez.
          </p>
        </section>
      </div>
    </main>
  );
}
