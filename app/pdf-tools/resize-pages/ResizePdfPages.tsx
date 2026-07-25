"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { trackToolEvent } from "@/lib/analytics";
import RelatedTools from "@/app/components/RelatedTools";

type PaperKey = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "CUSTOM";
type Orientation = "landscape" | "portrait";
type ResizeMode = "fit" | "preserve" | "scale";

const papers: Record<Exclude<PaperKey, "CUSTOM">, [number, number]> = {
  A0: [841, 1189],
  A1: [594, 841],
  A2: [420, 594],
  A3: [297, 420],
  A4: [210, 297],
  A5: [148, 210],
};

const maxFileSize = 150 * 1024 * 1024;
const mmToPt = (value: number) => (value * 72) / 25.4;
const ptToMm = (value: number) => (value * 25.4) / 72;

function safeName(name: string) {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toUpperCase() || "PAFTA"
  );
}

export default function ResizePdfPages() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [firstPage, setFirstPage] = useState<[number, number] | null>(null);
  const [paper, setPaper] = useState<PaperKey>("A3");
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [customWidth, setCustomWidth] = useState(420);
  const [customHeight, setCustomHeight] = useState(297);
  const [mode, setMode] = useState<ResizeMode>("fit");
  const [currentScale, setCurrentScale] = useState(100);
  const [targetScale, setTargetScale] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  function targetSizeMm(): [number, number] {
    if (paper === "CUSTOM") {
      return [Math.max(10, customWidth), Math.max(10, customHeight)];
    }

    const [shortSide, longSide] = papers[paper];
    return orientation === "landscape"
      ? [longSide, shortSide]
      : [shortSide, longSide];
  }

  async function readFile(selectedFile: File) {
    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setMessage("Lütfen PDF formatında bir dosya seç.");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setMessage("PDF dosyası 150 MB sınırını aşıyor.");
      return;
    }

    try {
      const source = await PDFDocument.load(await selectedFile.arrayBuffer());
      const first = source.getPage(0);

      setFile(selectedFile);
      setPageCount(source.getPageCount());
      setFirstPage([ptToMm(first.getWidth()), ptToMm(first.getHeight())]);
      setMessage(`${source.getPageCount()} sayfalık PDF hazır.`);
    } catch {
      setFile(null);
      setPageCount(0);
      setFirstPage(null);
      setMessage("PDF okunamadı. Dosya bozuk veya şifreli olabilir.");
    }
  }

  async function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) await readFile(selected);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const selected = event.dataTransfer.files?.[0];
    if (selected) await readFile(selected);
  }

  async function createPdf() {
    if (!file) return;

    setIsWorking(true);
    setMessage("");

    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const output = await PDFDocument.create();
      const [targetWidthMm, targetHeightMm] = targetSizeMm();
      const targetWidth = mmToPt(targetWidthMm);
      const targetHeight = mmToPt(targetHeightMm);

      for (let index = 0; index < source.getPageCount(); index += 1) {
        const sourcePage = source.getPage(index);
        const embeddedPage = await output.embedPage(sourcePage);
        const sourceWidth = sourcePage.getWidth();
        const sourceHeight = sourcePage.getHeight();
        const factor =
          mode === "fit"
            ? Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight)
            : mode === "scale"
              ? currentScale / targetScale
              : 1;
        const width = sourceWidth * factor;
        const height = sourceHeight * factor;
        const page = output.addPage([targetWidth, targetHeight]);

        page.drawRectangle({
          x: 0,
          y: 0,
          width: targetWidth,
          height: targetHeight,
          color: rgb(1, 1, 1),
        });
        page.drawPage(embeddedPage, {
          x: (targetWidth - width) / 2,
          y: (targetHeight - height) / 2,
          width,
          height,
        });
      }

      const bytes = await output.save();
      const downloadBytes = new Uint8Array(bytes);
      const blob = new Blob([downloadBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${safeName(
        file.name.replace(/\.pdf$/i, "")
      )}_${paper}_PAFTA.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Yeni PDF oluşturuldu ve indirildi.");
      trackToolEvent("pdf_resize_scale", "completed", {
        mode,
        target_paper: paper,
        current_scale: currentScale,
        target_scale: mode === "scale" ? targetScale : undefined,
      });
    } catch {
      setMessage("PDF oluşturulurken bir sorun meydana geldi.");
    } finally {
      setIsWorking(false);
    }
  }

  const [targetWidth, targetHeight] = targetSizeMm();
  const fitFactor = firstPage
    ? Math.min(targetWidth / firstPage[0], targetHeight / firstPage[1])
    : null;
  const appliedFactor =
    mode === "preserve"
      ? 1
      : mode === "scale"
        ? currentScale / targetScale
        : fitFactor;
  const resultingScale =
    appliedFactor && currentScale > 0 ? currentScale / appliedFactor : null;
  const scaledContentSize =
    firstPage && appliedFactor
      ? [firstPage[0] * appliedFactor, firstPage[1] * appliedFactor]
      : null;
  const contentWillOverflow = Boolean(
    scaledContentSize &&
      (scaledContentSize[0] > targetWidth ||
        scaledContentSize[1] > targetHeight)
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-400">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/pdf-tools" className="hover:text-cyan-400">
            PDF Araçları
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">Pafta Boyutu ve Ölçek</span>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Tarayıcıda güvenli PDF işlemi
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          PDF Pafta Boyutu ve Ölçek Ayarlama
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          PDF paftanın kâğıt boyutunu değiştir. İçeriği yeni sayfaya
          orantılı olarak sığdırabilir veya çizimin fiziksel ölçeğini
          değiştirmeden yalnızca kâğıt alanını değiştirebilirsin.
        </p>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-10 rounded-3xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? "border-cyan-300 bg-cyan-400/10"
              : "border-slate-700 bg-slate-900"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleInput}
            className="hidden"
          />
          <p className="text-lg font-semibold">
            PDF dosyanı buraya sürükle veya seç
          </p>
          <p className="mt-2 text-sm text-slate-400">
            En fazla 150 MB · Dosya cihazından ayrılmaz
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            PDF seç
          </button>
          {file && (
            <p className="mt-4 text-cyan-300">
              {file.name} · {pageCount} sayfa
              {firstPage &&
                ` · İlk sayfa ${firstPage[0].toFixed(1)} × ${firstPage[1].toFixed(1)} mm`}
            </p>
          )}
        </div>

        <section className="mt-8 grid gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300">
              Hedef kâğıt
            </span>
            <select
              value={paper}
              onChange={(event) => setPaper(event.target.value as PaperKey)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
            >
              {["A0", "A1", "A2", "A3", "A4", "A5"].map((item) => (
                <option key={item}>{item}</option>
              ))}
              <option value="CUSTOM">Özel ölçü</option>
            </select>
          </label>

          {paper !== "CUSTOM" ? (
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Yön</span>
              <select
                value={orientation}
                onChange={(event) =>
                  setOrientation(event.target.value as Orientation)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
              >
                <option value="landscape">Yatay</option>
                <option value="portrait">Dikey</option>
              </select>
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="text-sm text-slate-300">Genişlik (mm)</span>
                <input
                  type="number"
                  min="10"
                  value={customWidth}
                  onChange={(event) =>
                    setCustomWidth(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                />
              </label>
              <label>
                <span className="text-sm text-slate-300">Yükseklik (mm)</span>
                <input
                  type="number"
                  min="10"
                  value={customHeight}
                  onChange={(event) =>
                    setCustomHeight(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
                />
              </label>
            </div>
          )}

          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-slate-300">İşlem modu</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setMode("fit")}
                className={`rounded-2xl border p-4 text-left ${
                  mode === "fit"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                <strong>Sayfaya sığdır</strong>
                <span className="mt-1 block text-sm text-slate-400">
                  İçerik orantılı değişir; çizim ölçeği değişebilir.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode("preserve")}
                className={`rounded-2xl border p-4 text-left ${
                  mode === "preserve"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                <strong>Çizim ölçeğini koru</strong>
                <span className="mt-1 block text-sm text-slate-400">
                  İçerik %100 kalır; küçük kâğıtta taşan alan kırpılır.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode("scale")}
                className={`rounded-2xl border p-4 text-left ${
                  mode === "scale"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                <strong>Yeni ölçeğe dönüştür</strong>
                <span className="mt-1 block text-sm text-slate-400">
                  Örneğin 1/100 çizimi 1/50 veya 1/200 ölçeğe getirir.
                </span>
              </button>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">
              Mevcut çizim ölçeği (1/x)
            </span>
            <input
              type="number"
              min="1"
              value={currentScale}
              onChange={(event) => setCurrentScale(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
            />
          </label>

          {mode === "scale" && (
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">
                Hedef çizim ölçeği (1/x)
              </span>
              <input
                type="number"
                min="1"
                value={targetScale}
                onChange={(event) =>
                  setTargetScale(Math.max(1, Number(event.target.value) || 1))
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
              />
            </label>
          )}

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-sm text-slate-300">Hedef sayfa</p>
            <p className="mt-1 text-xl font-semibold text-cyan-300">
              {targetWidth.toFixed(0)} × {targetHeight.toFixed(0)} mm
            </p>
            {appliedFactor && resultingScale && (
              <p className="mt-2 text-sm text-slate-300">
                Uygulanan boyut: %{(appliedFactor * 100).toFixed(1)} · Yaklaşık
                sonuç: 1/{resultingScale.toFixed(1)}
              </p>
            )}
          </div>

          {contentWillOverflow && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 md:col-span-2">
              <p className="font-semibold text-amber-300">
                İçerik hedef kâğıda sığmıyor
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-100">
                Ölçekli içerik yaklaşık {scaledContentSize?.[0].toFixed(1)} ×{" "}
                {scaledContentSize?.[1].toFixed(1)} mm olacak. Daha büyük bir
                kâğıt seçmezsen taşan kenarlar kırpılır.
              </p>
            </div>
          )}
        </section>

        {mode === "preserve" && firstPage && fitFactor && fitFactor < 1 && (
          <p className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-200">
            Hedef kâğıt mevcut sayfadan küçük. Ölçek korunacağı için taşan
            içerik sayfa sınırlarında kırpılacaktır.
          </p>
        )}

        <button
          type="button"
          disabled={!file || isWorking}
          onClick={createPdf}
          className="mt-6 w-full rounded-2xl bg-cyan-400 px-6 py-4 text-lg font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isWorking ? "PDF hazırlanıyor…" : "Yeni PDF’yi oluştur ve indir"}
        </button>

        {message && (
          <p className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-200">
            {message}
          </p>
        )}
        <RelatedTools currentHref="/pdf-tools/resize-pages" kind="pdf" />
      </div>
    </main>
  );
}
