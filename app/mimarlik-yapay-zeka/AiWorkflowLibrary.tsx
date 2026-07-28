"use client";

import { useState } from "react";

const workflows = [
  {
    title: "Eskizden kontrollü görsele",
    category: "Görselleştirme",
    steps: [
      "Eskizi temizle; korunacak duvar, açıklık ve kütle çizgilerini belirginleştir.",
      "Yapı türü, bağlam, malzeme, ışık ve kamera bilgisini ayrı cümlelerle tanımla.",
      "İlk üretimde tek stil ve tek açı kullan; aynı anda çok değişken isteme.",
      "Sonucu eskizle üst üste getirerek geometri, kat ve açıklık sayısını kontrol et.",
    ],
    check: "Merdiven, korkuluk, cam, taşıyıcı ve insan ölçeğini özellikle denetle.",
  },
  {
    title: "Revit sorununu AI ile çözme",
    category: "Teknik yardım",
    steps: [
      "Revit sürümünü, komutu, eleman türünü ve tam hata mesajını yaz.",
      "Properties, Project Browser ve ilgili görünüşün ekran görüntüsünü ekle.",
      "Önce sorunun olası nedenlerini, sonra en güvenli çözüm sırasını iste.",
      "İşlemi teslim modelinde değil, dosyanın kopyasında dene.",
    ],
    check: "AI’ın söylediği menü ve komut adını kullandığın Revit sürümünde doğrula.",
  },
  {
    title: "Emsal proje araştırması",
    category: "Araştırma",
    steps: [
      "Yapı türü, iklim, alan, kullanıcı ve araştırma sorusunu açıkça tanımla.",
      "Mimarın sitesi, kurum arşivi, yayın veya akademik kaynak iste.",
      "Plan, kesit, dolaşım, strüktür ve malzeme için ayrı notlar çıkar.",
      "AI özetini kaynak metin ve çizimlerle karşılaştır.",
    ],
    check: "Kaynağı açmadan hiçbir ölçü, tarih, mimar veya proje bilgisini kullanma.",
  },
  {
    title: "Pafta metni ve jüri hazırlığı",
    category: "Sunum",
    steps: [
      "Projeyi 150 kelimelik ham bir metinle ve ana kararlarla anlat.",
      "AI’dan ana fikir, üç kanıt ve sonuç şeklinde hiyerarşi kurmasını iste.",
      "Metni 25, 60 ve 120 kelimelik üç uzunluğa indir.",
      "Her iddianın plan, kesit veya diyagramda karşılığı olup olmadığını kontrol et.",
    ],
    check: "Genel ve süslü ifadeleri kaldır; yalnız projede gerçekten görülen kararları bırak.",
  },
  {
    title: "Render düzenleme",
    category: "Görsel düzenleme",
    steps: [
      "Değiştirilecek alanı mümkün olduğunca dar maskele.",
      "Korunacak geometriyi ve yalnız değişecek elemanı açıkça yaz.",
      "Malzeme, ölçek ve ışık değişikliklerini ayrı denemelerde yap.",
      "Düzenlenen alanın perspektif, gölge ve birleşimlerini yakınlaştırarak kontrol et.",
    ],
    check: "AI düzenlemesinin kapı, pencere, kolon veya döşeme geometrisini bozmadığını doğrula.",
  },
  {
    title: "Erken aşama yerleşim",
    category: "Planlama",
    steps: [
      "Parsel, çekme mesafesi, yön, giriş ve kullanıcı verilerini doğrula.",
      "Değişmeyen koşulları sabitle; karşılaştırılacak ölçütleri belirle.",
      "Aynı programla en az üç farklı kütle ve dolaşım alternatifi üret.",
      "Alternatifleri yalnız görsele göre değil; alan, gün ışığı ve erişimle karşılaştır.",
    ],
    check: "Üretilen çözümü imar veya ruhsat uygunluğu olarak kabul etme.",
  },
] as const;

export default function AiWorkflowLibrary() {
  const [selected, setSelected] = useState(0);
  const active = workflows[selected];

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400">
            Hazır iş akışları
          </p>
          <h2 className="mt-1 text-2xl font-bold">AI’ı nerede, nasıl kullanmalısın?</h2>
        </div>
        <span className="hidden text-xs text-slate-500 sm:block">6 doğrulamalı senaryo</span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="grid gap-2">
          {workflows.map((workflow, index) => (
            <button
              key={workflow.title}
              type="button"
              onClick={() => setSelected(index)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                selected === index
                  ? "border-cyan-400/50 bg-cyan-400/10"
                  : "border-slate-800 bg-slate-900 hover:border-slate-700"
              }`}
            >
              <span className="block text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                {workflow.category}
              </span>
              <span className="mt-1 block text-sm font-semibold text-white">{workflow.title}</span>
            </button>
          ))}
        </div>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400">
            {active.category}
          </p>
          <h3 className="mt-2 text-xl font-bold">{active.title}</h3>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {active.steps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
            <strong>Son kontrol:</strong> {active.check}
          </p>
        </article>
      </div>
    </section>
  );
}
