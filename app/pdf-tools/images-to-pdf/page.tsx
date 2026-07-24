"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { PDFDocument, degrees } from "pdf-lib";

type PageSizeMode = "image" | "a4" | "a3";
type PageOrientation = "auto" | "portrait" | "landscape";
type FitMode = "contain" | "cover";

type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  format: "jpg" | "png";
  rotation: number;
  error: string | null;
};

const maxFileSize = 50 * 1024 * 1024;
const maxImageCount = 100;

const pageSizes = {
  a4: {
    width: 595.28,
    height: 841.89,
  },
  a3: {
    width: 841.89,
    height: 1190.55,
  },
};

export default function ImagesToPdfPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSizeMode, setPageSizeMode] =
    useState<PageSizeMode>("image");
  const [orientation, setOrientation] =
    useState<PageOrientation>("auto");
  const [fitMode, setFitMode] = useState<FitMode>("contain");

  const [marginMm, setMarginMm] = useState("10");
  const [outputName, setOutputName] = useState(
    "PAFTA_GORSELLER"
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const validImages = useMemo(
    () => images.filter((image) => image.error === null),
    [images]
  );

  const totalFileSize = useMemo(
    () =>
      images.reduce(
        (total, image) => total + image.file.size,
        0
      ),
    [images]
  );

  async function addImages(selectedFiles: File[]) {
    const availableSlots =
      maxImageCount - images.length;

    if (availableSlots <= 0) {
      setMessage(
        `En fazla ${maxImageCount} görsel ekleyebilirsin.`
      );
      return;
    }

    const imageFiles = selectedFiles
      .filter((file) => isSupportedImage(file))
      .slice(0, availableSlots);

    if (imageFiles.length === 0) {
      setMessage(
        "Lütfen PNG, JPG veya JPEG formatında görsel seç."
      );
      return;
    }

    setIsReading(true);
    setMessage("");

    const existingSignatures = new Set(
      images.map(
        (image) =>
          `${image.file.name}-${image.file.size}-${image.file.lastModified}`
      )
    );

    const newImages: ImageItem[] = [];

    for (const file of imageFiles) {
      const signature = `${file.name}-${file.size}-${file.lastModified}`;

      if (existingSignatures.has(signature)) {
        continue;
      }

      if (file.size > maxFileSize) {
        newImages.push({
          id: createId(),
          file,
          previewUrl: "",
          width: 0,
          height: 0,
          format: getImageFormat(file),
          rotation: 0,
          error: "Dosya boyutu 50 MB sınırını aşıyor.",
        });

        continue;
      }

      try {
        const imageInfo = await readImageDimensions(file);
        const previewUrl = URL.createObjectURL(file);

        newImages.push({
          id: createId(),
          file,
          previewUrl,
          width: imageInfo.width,
          height: imageInfo.height,
          format: getImageFormat(file),
          rotation: 0,
          error: null,
        });
      } catch {
        newImages.push({
          id: createId(),
          file,
          previewUrl: "",
          width: 0,
          height: 0,
          format: getImageFormat(file),
          rotation: 0,
          error: "Görsel okunamadı veya dosya bozuk.",
        });
      }
    }

    setImages((currentImages) => [
      ...currentImages,
      ...newImages,
    ]);

    setIsReading(false);

    if (newImages.length === 0) {
      setMessage(
        "Seçilen görseller zaten listede bulunuyor."
      );
    }
  }

  async function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    await addImages(selectedFiles);

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

    await addImages(droppedFiles);
  }

  function removeImage(id: string) {
    setImages((currentImages) => {
      const removedImage = currentImages.find(
        (image) => image.id === id
      );

      if (removedImage?.previewUrl) {
        URL.revokeObjectURL(
          removedImage.previewUrl
        );
      }

      return currentImages.filter(
        (image) => image.id !== id
      );
    });

    setMessage("");
  }

  function moveImage(
    id: string,
    direction: "up" | "down"
  ) {
    setImages((currentImages) => {
      const currentIndex =
        currentImages.findIndex(
          (image) => image.id === id
        );

      if (currentIndex === -1) {
        return currentImages;
      }

      const targetIndex =
        direction === "up"
          ? currentIndex - 1
          : currentIndex + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= currentImages.length
      ) {
        return currentImages;
      }

      const updatedImages = [...currentImages];

      const currentImage =
        updatedImages[currentIndex];

      updatedImages[currentIndex] =
        updatedImages[targetIndex];

      updatedImages[targetIndex] =
        currentImage;

      return updatedImages;
    });
  }

  function rotateImage(id: string) {
    setImages((currentImages) =>
      currentImages.map((image) =>
        image.id === id
          ? {
              ...image,
              rotation:
                (image.rotation + 90) % 360,
            }
          : image
      )
    );
  }

  function clearImages() {
    images.forEach((image) => {
      if (image.previewUrl) {
        URL.revokeObjectURL(
          image.previewUrl
        );
      }
    });

    setImages([]);
    setProgress(0);
    setMessage("");
  }

  async function createPdf() {
    if (validImages.length === 0) {
      setMessage(
        "PDF oluşturmak için en az bir geçerli görsel ekle."
      );
      return;
    }

    const parsedMargin = Number(marginMm);

    if (
      !Number.isFinite(parsedMargin) ||
      parsedMargin < 0 ||
      parsedMargin > 100
    ) {
      setMessage(
        "Kenar boşluğu 0 ile 100 mm arasında olmalıdır."
      );
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setMessage("");

    try {
      const pdf = await PDFDocument.create();

      pdf.setCreator("PAFTA");
      pdf.setProducer("PAFTA PDF Araçları");
      pdf.setCreationDate(new Date());
      pdf.setModificationDate(new Date());

      const marginPt = mmToPoints(parsedMargin);

      for (
        let index = 0;
        index < validImages.length;
        index += 1
      ) {
        const imageItem = validImages[index];

        const imageBytes =
          await imageItem.file.arrayBuffer();

        const embeddedImage =
          imageItem.format === "png"
            ? await pdf.embedPng(imageBytes)
            : await pdf.embedJpg(imageBytes);

        const imageIsRotated =
          imageItem.rotation === 90 ||
          imageItem.rotation === 270;

        const effectiveWidth = imageIsRotated
          ? imageItem.height
          : imageItem.width;

        const effectiveHeight = imageIsRotated
          ? imageItem.width
          : imageItem.height;

        const pageDimensions = getPageDimensions({
          pageSizeMode,
          orientation,
          imageWidth: effectiveWidth,
          imageHeight: effectiveHeight,
          marginPt,
        });

        const page = pdf.addPage([
          pageDimensions.width,
          pageDimensions.height,
        ]);

        const availableWidth = Math.max(
          1,
          pageDimensions.width - marginPt * 2
        );

        const availableHeight = Math.max(
          1,
          pageDimensions.height - marginPt * 2
        );

        const dimensions = calculateImagePlacement({
          imageWidth: effectiveWidth,
          imageHeight: effectiveHeight,
          availableWidth,
          availableHeight,
          fitMode,
        });

        const x =
          marginPt +
          (availableWidth - dimensions.width) / 2;

        const y =
          marginPt +
          (availableHeight - dimensions.height) / 2;

        const drawOptions = getRotatedDrawOptions({
          rotation: imageItem.rotation,
          x,
          y,
          width: dimensions.width,
          height: dimensions.height,
        });

        page.drawImage(embeddedImage, drawOptions);

        setProgress(
          Math.round(
            ((index + 1) /
              validImages.length) *
              100
          )
        );
      }

      const pdfBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      const pdfBuffer =
        pdfBytes.slice().buffer as ArrayBuffer;

      const blob = new Blob([pdfBuffer], {
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
        `${validImages.length} görselden PDF başarıyla oluşturuldu.`
      );
    } catch {
      setMessage(
        "PDF oluşturulurken bir sorun oluştu. Görselleri veya dosya boyutlarını kontrol et."
      );
    } finally {
      setIsCreating(false);
    }
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
            Görsellerden PDF
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA PDF Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Görsellerden PDF Oluşturma
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            PNG ve JPG görsellerini yükle, sıralarını
            düzenle ve tek bir PDF dosyası olarak indir.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_370px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Görselleri ekle
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                PNG, JPG veya JPEG dosyalarını seçebilir ya
                da aşağıdaki alana sürükleyebilirsin.
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,.png,.jpg,.jpeg"
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
                  Görselleri buraya bırak
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  En fazla {maxImageCount} görsel
                  ekleyebilirsin.
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
                    ? "Görseller okunuyor..."
                    : "Görselleri seç"}
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Her görsel için üst sınır 50 MB’dir.
                Yüksek çözünürlüklü çok sayıda görsel
                tarayıcı belleğini zorlayabilir.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Görsel sırası
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Görseller aşağıdaki sırayla PDF
                    sayfalarına dönüştürülecektir.
                  </p>
                </div>

                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={clearImages}
                    className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                  >
                    Tümünü temizle
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {images.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                    Henüz görsel eklenmedi.
                  </div>
                ) : (
                  images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`rounded-2xl border p-4 ${
                        image.error
                          ? "border-red-400/30 bg-red-400/10"
                          : "border-slate-800 bg-slate-950"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 md:w-32">
                          {image.previewUrl ? (
                            <img
                              src={image.previewUrl}
                              alt={image.file.name}
                              className="h-full w-full object-contain"
                              style={{
                                transform: `rotate(${image.rotation}deg)`,
                              }}
                            />
                          ) : (
                            <span className="text-slate-500">
                              Ön izleme yok
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">
                            {index + 1}. {image.file.name}
                          </p>

                          <p className="mt-2 text-sm text-slate-400">
                            {formatFileSize(
                              image.file.size
                            )}

                            {!image.error && (
                              <>
                                <span className="mx-2">
                                  •
                                </span>

                                {image.width} ×{" "}
                                {image.height} px

                                <span className="mx-2">
                                  •
                                </span>

                                {image.format.toUpperCase()}
                              </>
                            )}
                          </p>

                          {image.rotation !== 0 &&
                            !image.error && (
                              <p className="mt-2 text-sm text-cyan-300">
                                {image.rotation}° döndürüldü
                              </p>
                            )}

                          {image.error && (
                            <p className="mt-2 text-sm text-red-300">
                              {image.error}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              moveImage(
                                image.id,
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
                              moveImage(
                                image.id,
                                "down"
                              )
                            }
                            disabled={
                              index ===
                              images.length - 1
                            }
                            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Aşağı taşı"
                          >
                            ↓
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              rotateImage(image.id)
                            }
                            disabled={Boolean(
                              image.error
                            )}
                            className="rounded-lg border border-cyan-400/30 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Döndür
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(image.id)
                            }
                            className="rounded-lg border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                PDF sayfa ayarları
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="page-size"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Sayfa boyutu
                  </label>

                  <select
                    id="page-size"
                    value={pageSizeMode}
                    onChange={(event) =>
                      setPageSizeMode(
                        event.target
                          .value as PageSizeMode
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  >
                    <option value="image">
                      Görsele göre
                    </option>

                    <option value="a4">
                      A4
                    </option>

                    <option value="a3">
                      A3
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="orientation"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Sayfa yönü
                  </label>

                  <select
                    id="orientation"
                    value={orientation}
                    onChange={(event) =>
                      setOrientation(
                        event.target
                          .value as PageOrientation
                      )
                    }
                    disabled={
                      pageSizeMode === "image"
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="auto">
                      Görsele göre otomatik
                    </option>

                    <option value="portrait">
                      Dikey
                    </option>

                    <option value="landscape">
                      Yatay
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fit-mode"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Yerleştirme biçimi
                  </label>

                  <select
                    id="fit-mode"
                    value={fitMode}
                    onChange={(event) =>
                      setFitMode(
                        event.target
                          .value as FitMode
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  >
                    <option value="contain">
                      Tamamını göster
                    </option>

                    <option value="cover">
                      Sayfayı doldur
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="margin"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Kenar boşluğu (mm)
                  </label>

                  <input
                    id="margin"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={marginMm}
                    onChange={(event) =>
                      setMarginMm(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-white">
                  Yerleştirme seçenekleri
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  “Tamamını göster” görselin tamamını
                  sayfaya sığdırır. “Sayfayı doldur”
                  seçeneğinde görselin bazı kenarları
                  kırpılabilir.
                </p>
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
                    placeholder="PAFTA_GORSELLER"
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
                PDF özeti
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <SummaryValue
                  label="Geçerli görsel"
                  value={String(
                    validImages.length
                  )}
                />

                <SummaryValue
                  label="PDF sayfası"
                  value={String(
                    validImages.length
                  )}
                />
              </div>

              <div className="mt-4">
                <SummaryValue
                  label="Toplam görsel boyutu"
                  value={formatFileSize(
                    totalFileSize
                  )}
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
                onClick={createPdf}
                disabled={
                  validImages.length === 0 ||
                  isReading ||
                  isCreating
                }
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating
                  ? `PDF oluşturuluyor: %${progress}`
                  : "PDF oluştur ve indir"}
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
                Görseller cihazında kalır
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Görseller ve oluşturulan PDF bu
                tarayıcıda işlenir. Dosyaların PAFTA
                sunucusuna gönderilmez.
              </p>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="font-semibold text-amber-300">
                Görsel kalitesi
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                PDF içindeki görüntü kalitesi yüklediğin
                orijinal dosyaların çözünürlüğüne bağlıdır.
                Düşük çözünürlüklü görseller büyütüldüğünde
                bulanık görünebilir.
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

function isSupportedImage(file: File) {
  const fileName = file.name.toLowerCase();

  return (
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    fileName.endsWith(".png") ||
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg")
  );
}

function getImageFormat(
  file: File
): "jpg" | "png" {
  const fileName = file.name.toLowerCase();

  if (
    file.type === "image/png" ||
    fileName.endsWith(".png")
  ) {
    return "png";
  }

  return "jpg";
}

function readImageDimensions(file: File) {
  return new Promise<{
    width: number;
    height: number;
  }>((resolve, reject) => {
    const image = new Image();
    const objectUrl =
      URL.createObjectURL(file);

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });

      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error("Görsel okunamadı.")
      );
    };

    image.src = objectUrl;
  });
}

function getPageDimensions({
  pageSizeMode,
  orientation,
  imageWidth,
  imageHeight,
  marginPt,
}: {
  pageSizeMode: PageSizeMode;
  orientation: PageOrientation;
  imageWidth: number;
  imageHeight: number;
  marginPt: number;
}) {
  if (pageSizeMode === "image") {
    return {
      width: imageWidth + marginPt * 2,
      height: imageHeight + marginPt * 2,
    };
  }

  const baseSize = pageSizes[pageSizeMode];

  const shouldUseLandscape =
    orientation === "landscape" ||
    (orientation === "auto" &&
      imageWidth > imageHeight);

  if (shouldUseLandscape) {
    return {
      width: Math.max(
        baseSize.width,
        baseSize.height
      ),
      height: Math.min(
        baseSize.width,
        baseSize.height
      ),
    };
  }

  return {
    width: Math.min(
      baseSize.width,
      baseSize.height
    ),
    height: Math.max(
      baseSize.width,
      baseSize.height
    ),
  };
}

function calculateImagePlacement({
  imageWidth,
  imageHeight,
  availableWidth,
  availableHeight,
  fitMode,
}: {
  imageWidth: number;
  imageHeight: number;
  availableWidth: number;
  availableHeight: number;
  fitMode: FitMode;
}) {
  const widthScale =
    availableWidth / imageWidth;

  const heightScale =
    availableHeight / imageHeight;

  const scale =
    fitMode === "cover"
      ? Math.max(widthScale, heightScale)
      : Math.min(widthScale, heightScale);

  return {
    width: imageWidth * scale,
    height: imageHeight * scale,
  };
}

function getRotatedDrawOptions({
  rotation,
  x,
  y,
  width,
  height,
}: {
  rotation: number;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  if (rotation === 90) {
    return {
      x: x + width,
      y,
      width: height,
      height: width,
      rotate: degrees(90),
    };
  }

  if (rotation === 180) {
    return {
      x: x + width,
      y: y + height,
      width,
      height,
      rotate: degrees(180),
    };
  }

  if (rotation === 270) {
    return {
      x,
      y: y + height,
      width: height,
      height: width,
      rotate: degrees(270),
    };
  }

  return {
    x,
    y,
    width,
    height,
  };
}

function mmToPoints(value: number) {
  return value * 2.8346456693;
}

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function createOutputFileName(value: string) {
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
    normalizedName || "PAFTA_GORSELLER"
  }.pdf`;
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