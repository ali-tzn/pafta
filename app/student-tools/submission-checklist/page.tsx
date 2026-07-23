"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ChecklistCategory =
  | "Pafta"
  | "Model"
  | "Çizimler"
  | "Sunum"
  | "Dosyalar"
  | "Teslim";

type ChecklistItem = {
  id: string;
  title: string;
  category: ChecklistCategory;
  completed: boolean;
  custom?: boolean;
};

const storageKey = "pafta-submission-checklist";

const defaultItems: ChecklistItem[] = [
  {
    id: "board-title",
    title: "Pafta başlığı ve proje adı kontrol edildi",
    category: "Pafta",
    completed: false,
  },
  {
    id: "board-name",
    title: "Ad, soyad, öğrenci numarası ve ders bilgileri eklendi",
    category: "Pafta",
    completed: false,
  },
  {
    id: "board-layout",
    title: "Pafta yerleşimi ve görsel hiyerarşi kontrol edildi",
    category: "Pafta",
    completed: false,
  },
  {
    id: "board-text",
    title: "Yazı boyutları baskıda okunabilir durumda",
    category: "Pafta",
    completed: false,
  },
  {
    id: "board-scale",
    title: "Tüm çizimlerin ölçek bilgileri yazıldı",
    category: "Pafta",
    completed: false,
  },
  {
    id: "board-north",
    title: "Vaziyet planına kuzey oku eklendi",
    category: "Pafta",
    completed: false,
  },
  {
    id: "board-legend",
    title: "Gerekli lejant, açıklama ve semboller eklendi",
    category: "Pafta",
    completed: false,
  },

  {
    id: "drawing-plan",
    title: "Tüm kat planları paftaya eklendi",
    category: "Çizimler",
    completed: false,
  },
  {
    id: "drawing-section",
    title: "Gerekli kesitler tamamlandı",
    category: "Çizimler",
    completed: false,
  },
  {
    id: "drawing-elevation",
    title: "Cephe çizimleri tamamlandı",
    category: "Çizimler",
    completed: false,
  },
  {
    id: "drawing-dimensions",
    title: "Ölçülendirmeler kontrol edildi",
    category: "Çizimler",
    completed: false,
  },
  {
    id: "drawing-levels",
    title: "Kotlar ve kat yükseklikleri kontrol edildi",
    category: "Çizimler",
    completed: false,
  },
  {
    id: "drawing-lineweights",
    title: "Çizgi kalınlıkları ve taramalar düzenlendi",
    category: "Çizimler",
    completed: false,
  },
  {
    id: "drawing-room-names",
    title: "Mahal isimleri ve alan bilgileri eklendi",
    category: "Çizimler",
    completed: false,
  },

  {
    id: "model-clean",
    title: "Modelde gereksiz elemanlar temizlendi",
    category: "Model",
    completed: false,
  },
  {
    id: "model-materials",
    title: "Malzemeler ve yüzeyler kontrol edildi",
    category: "Model",
    completed: false,
  },
  {
    id: "model-camera",
    title: "Render kamera açıları kontrol edildi",
    category: "Model",
    completed: false,
  },
  {
    id: "model-light",
    title: "Işık, gölge ve render ayarları kontrol edildi",
    category: "Model",
    completed: false,
  },
  {
    id: "model-export",
    title: "Modelin güncel sürümü dışa aktarıldı",
    category: "Model",
    completed: false,
  },

  {
    id: "presentation-order",
    title: "Sunum sırası hazırlandı",
    category: "Sunum",
    completed: false,
  },
  {
    id: "presentation-time",
    title: "Sunum süresi prova edildi",
    category: "Sunum",
    completed: false,
  },
  {
    id: "presentation-concept",
    title: "Proje fikri kısa ve anlaşılır biçimde açıklanabiliyor",
    category: "Sunum",
    completed: false,
  },
  {
    id: "presentation-questions",
    title: "Olası jüri soruları için hazırlık yapıldı",
    category: "Sunum",
    completed: false,
  },
  {
    id: "presentation-backup",
    title: "Sunum dosyasının yedek kopyası hazırlandı",
    category: "Sunum",
    completed: false,
  },

  {
    id: "file-name",
    title: "Dosya adları teslim kurallarına uygun",
    category: "Dosyalar",
    completed: false,
  },
  {
    id: "file-pdf",
    title: "PDF sayfa sırası ve yönleri kontrol edildi",
    category: "Dosyalar",
    completed: false,
  },
  {
    id: "file-resolution",
    title: "Görsellerin çözünürlüğü yeterli",
    category: "Dosyalar",
    completed: false,
  },
  {
    id: "file-fonts",
    title: "PDF içindeki yazılar ve fontlar doğru görünüyor",
    category: "Dosyalar",
    completed: false,
  },
  {
    id: "file-size",
    title: "Dosya boyutu teslim sınırına uygun",
    category: "Dosyalar",
    completed: false,
  },
  {
    id: "file-backup",
    title: "Dosyalar bulut ve harici belleğe yedeklendi",
    category: "Dosyalar",
    completed: false,
  },

  {
    id: "submission-print",
    title: "Baskı alınacaksa test çıktısı kontrol edildi",
    category: "Teslim",
    completed: false,
  },
  {
    id: "submission-board-size",
    title: "Pafta ölçüsü teslim şartlarına uygun",
    category: "Teslim",
    completed: false,
  },
  {
    id: "submission-deadline",
    title: "Teslim tarihi ve saati tekrar kontrol edildi",
    category: "Teslim",
    completed: false,
  },
  {
    id: "submission-platform",
    title: "Dijital teslim platformuna giriş yapılabiliyor",
    category: "Teslim",
    completed: false,
  },
  {
    id: "submission-upload",
    title: "Dosyalar son teslim saatinden önce yüklendi",
    category: "Teslim",
    completed: false,
  },
];

const categories: ChecklistCategory[] = [
  "Pafta",
  "Çizimler",
  "Model",
  "Sunum",
  "Dosyalar",
  "Teslim",
];

export default function SubmissionChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);
  const [selectedCategory, setSelectedCategory] = useState<
    ChecklistCategory | "Tümü"
  >("Tümü");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemCategory, setNewItemCategory] =
    useState<ChecklistCategory>("Pafta");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem(storageKey);

    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems) as ChecklistItem[];

        if (Array.isArray(parsedItems)) {
          setItems(parsedItems);
        }
      } catch {
        setItems(defaultItems);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, isLoaded]);

  const completedCount = useMemo(
    () => items.filter((item) => item.completed).length,
    [items]
  );

  const progressPercent = useMemo(() => {
    if (items.length === 0) {
      return 0;
    }

    return Math.round((completedCount / items.length) * 100);
  }, [completedCount, items.length]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "Tümü") {
      return items;
    }

    return items.filter(
      (item) => item.category === selectedCategory
    );
  }, [items, selectedCategory]);

  function toggleItem(id: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      )
    );
  }

  function addCustomItem() {
    const trimmedTitle = newItemTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      {
        id: `custom-${Date.now()}`,
        title: trimmedTitle,
        category: newItemCategory,
        completed: false,
        custom: true,
      },
    ]);

    setNewItemTitle("");
  }

  function removeCustomItem(id: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  function markAllCompleted() {
    setItems((currentItems) =>
      currentItems.map((item) => ({
        ...item,
        completed: true,
      }))
    );
  }

  function clearAllChecks() {
    setItems((currentItems) =>
      currentItems.map((item) => ({
        ...item,
        completed: false,
      }))
    );
  }

  function resetChecklist() {
    setItems(defaultItems);
    setSelectedCategory("Tümü");
    setNewItemTitle("");
    localStorage.removeItem(storageKey);
  }

  function getCategoryProgress(category: ChecklistCategory) {
    const categoryItems = items.filter(
      (item) => item.category === category
    );

    const categoryCompleted = categoryItems.filter(
      (item) => item.completed
    ).length;

    return {
      total: categoryItems.length,
      completed: categoryCompleted,
    };
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
            href="/student-tools"
            className="transition hover:text-cyan-400"
          >
            Öğrenci Araçları
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-200">
            Teslim Kontrol Listesi
          </span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Öğrenci Araçları
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Teslim Kontrol Listesi
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Pafta, çizim, model, sunum ve teslim dosyalarını
            göndermeden önce kontrol et. İşaretlediğin maddeler bu
            tarayıcıda otomatik olarak kaydedilir.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_360px]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Kontrol kategorileri
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Belirli bir bölümü görmek için kategori seç.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={markAllCompleted}
                    className="rounded-xl border border-emerald-400/30 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10"
                  >
                    Tümünü tamamla
                  </button>

                  <button
                    type="button"
                    onClick={clearAllChecks}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
                  >
                    İşaretleri temizle
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <CategoryButton
                  label="Tümü"
                  selected={selectedCategory === "Tümü"}
                  onClick={() => setSelectedCategory("Tümü")}
                  count={`${completedCount}/${items.length}`}
                />

                {categories.map((category) => {
                  const progress = getCategoryProgress(category);

                  return (
                    <CategoryButton
                      key={category}
                      label={category}
                      selected={selectedCategory === category}
                      onClick={() =>
                        setSelectedCategory(category)
                      }
                      count={`${progress.completed}/${progress.total}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Kontrol maddeleri
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Tamamladığın maddelerin üzerine tıkla.
              </p>

              <div className="mt-6 space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                    Bu kategoride henüz kontrol maddesi yok.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-4 rounded-2xl border p-4 transition ${
                        item.completed
                          ? "border-emerald-400/30 bg-emerald-400/10"
                          : "border-slate-800 bg-slate-950"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-sm font-bold transition ${
                          item.completed
                            ? "border-emerald-400 bg-emerald-400 text-slate-950"
                            : "border-slate-600 hover:border-cyan-400"
                        }`}
                        aria-label={
                          item.completed
                            ? "Tamamlanmadı olarak işaretle"
                            : "Tamamlandı olarak işaretle"
                        }
                      >
                        {item.completed ? "✓" : ""}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex-1 text-left"
                      >
                        <p
                          className={`font-medium leading-7 ${
                            item.completed
                              ? "text-slate-400 line-through"
                              : "text-white"
                          }`}
                        >
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {item.category}
                        </p>
                      </button>

                      {item.custom && (
                        <button
                          type="button"
                          onClick={() =>
                            removeCustomItem(item.id)
                          }
                          className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">
                Kendi kontrol maddeni ekle
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Dersine veya teslim biçimine özel maddeler
                oluşturabilirsin.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_180px_auto]">
                <div>
                  <label
                    htmlFor="new-checklist-item"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Kontrol maddesi
                  </label>

                  <input
                    id="new-checklist-item"
                    type="text"
                    value={newItemTitle}
                    onChange={(event) =>
                      setNewItemTitle(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addCustomItem();
                      }
                    }}
                    placeholder="Örneğin: Maket fotoğrafları eklendi"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-item-category"
                    className="mb-2 block text-sm text-slate-400"
                  >
                    Kategori
                  </label>

                  <select
                    id="new-item-category"
                    value={newItemCategory}
                    onChange={(event) =>
                      setNewItemCategory(
                        event.target.value as ChecklistCategory
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addCustomItem}
                    className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit space-y-5">
            <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Teslim ilerlemesi
              </p>

              <p className="mt-5 text-5xl font-bold">
                %{progressPercent}
              </p>

              <p className="mt-2 text-slate-300">
                {completedCount} / {items.length} madde tamamlandı
              </p>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
            </section>

            {progressPercent === 100 ? (
              <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
                <p className="font-semibold text-emerald-300">
                  Teslime hazırsın
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Listedeki tüm maddeler tamamlandı. Son dosyanı
                  teslim etmeden önce bir kez daha açıp kontrol
                  etmen yine de faydalı olur.
                </p>
              </section>
            ) : (
              <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
                <p className="font-semibold text-amber-300">
                  Kontrol devam ediyor
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Henüz tamamlanmamış {items.length - completedCount}{" "}
                  madde bulunuyor.
                </p>
              </section>
            )}

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="font-semibold text-white">
                Veriler nerede saklanıyor?
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                İşaretlerin bu cihazdaki tarayıcıya kaydedilir.
                Başka bir cihazda otomatik olarak görünmez.
              </p>
            </section>

            <button
              type="button"
              onClick={resetChecklist}
              className="w-full rounded-2xl border border-red-400/30 px-5 py-4 font-semibold text-red-300 transition hover:bg-red-400/10"
            >
              Listeyi ilk haline döndür
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CategoryButton({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        selected
          ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
      }`}
    >
      {label}
      <span className="ml-2 text-xs opacity-70">{count}</span>
    </button>
  );
}