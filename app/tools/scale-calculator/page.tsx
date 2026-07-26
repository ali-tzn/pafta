"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/app/components/RelatedTools";
import ToolLearningGuide from "@/app/components/ToolLearningGuide";
import { trackToolEvent } from "@/lib/analytics";

export default function ScaleCalculatorPage() {
  const [realSize, setRealSize] = useState("");
  const [scale, setScale] = useState("50");
  const [copyStatus, setCopyStatus] = useState("");

  const result = useMemo(() => {
    const value = Number(realSize);

    if (!value || value <= 0) return "";

    return (value / Number(scale)).toFixed(2);
  }, [realSize, scale]);

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(
      `${realSize} cm gerçek ölçü, 1/${scale} ölçekte çizimde ${result} cm olur.`
    );
    setCopyStatus("Sonuç kopyalandı.");
    trackToolEvent("scale_calculator", "result_copied", {
      scale: Number(scale),
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Ölçek Hesaplayıcı
        </h1>

        <p className="mt-4 text-slate-300">
          Gerçek ölçüyü girin, çizimde kaç santimetre olacağını anında görün.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:mt-10 sm:p-8">

          <label className="mb-2 block">
            Gerçek Ölçü (cm)
          </label>

          <input
            type="number"
            value={realSize}
            onChange={(e) => setRealSize(e.target.value)}
            placeholder="Örneğin 350"
            className="w-full rounded-xl bg-slate-800 px-4 py-3"
          />

          <label className="mt-6 mb-2 block">
            Ölçek
          </label>

          <select
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            className="w-full rounded-xl bg-slate-800 px-4 py-3"
          >
            <option value="20">1/20</option>
            <option value="50">1/50</option>
            <option value="100">1/100</option>
            <option value="200">1/200</option>
            <option value="500">1/500</option>
          </select>

          <div className="mt-8 rounded-xl bg-cyan-500 p-6 text-center">
            <p className="text-lg text-black">
              Çizimde Görünecek Ölçü
            </p>

            <h2 className="mt-2 text-4xl font-bold text-black">
              {result ? `${result} cm` : "--"}
            </h2>
          </div>

          {result && (
            <button
              type="button"
              onClick={copyResult}
              className="mt-4 w-full rounded-xl border border-cyan-400/40 px-4 py-3 font-semibold text-cyan-300 hover:bg-cyan-400/10"
            >
              Sonucu kopyala
            </button>
          )}
          {copyStatus && (
            <p className="mt-3 text-center text-sm text-slate-400">{copyStatus}</p>
          )}

        </div>
        <ToolLearningGuide
          title="Mimari ölçekte gerçek ölçü nasıl hesaplanır?"
          description="Ölçek, çizimdeki bir birimin gerçekte kaç birime karşılık geldiğini gösterir. Bu araç gerçek uzunluğu çizim uzunluğuna dönüştürür; aşağıdaki rehber sonucu doğru birimle yorumlamana yardım eder."
          steps={[
            { title: "Gerçek ölçüyü gir", text: "Ölçüyü santimetre cinsinden yaz. Örneğin 3,50 metrelik bir duvar için 350 cm gir." },
            { title: "Çizim ölçeğini seç", text: "Detay için 1/20, plan için 1/50 veya 1/100, vaziyet için 1/200 ya da 1/500 gibi uygun ölçeği seç." },
            { title: "Çizim değerini kullan", text: "Sonuç santimetre olarak gösterilir. Cetvelle çizimde kullanabilir veya sonucu tek tıkla kopyalayabilirsin." },
          ]}
          formulas={[
            { title: "Gerçekten çizime", text: "Çizim ölçüsü = gerçek ölçü ÷ ölçek paydası. 500 cm ÷ 50 = çizimde 10 cm." },
            { title: "Çizimden gerçeğe kontrol", text: "Gerçek ölçü = çizim ölçüsü × ölçek paydası. 4 cm × 100 = gerçekte 400 cm, yani 4 metredir." },
          ]}
          example={{ title: "3,50 metrelik duvarı 1/50 çizmek", text: "3,50 m önce 350 cm’ye çevrilir. 350 ÷ 50 = 7 cm. Duvar, 1/50 ölçekte kâğıt üzerinde 7 cm uzunluğunda çizilmelidir." }}
          mistakes={[
            { title: "Metreyi doğrudan santimetre sanmak", text: "3,5 değerini girmek 3,5 cm anlamına gelir. 3,5 metre için 350 cm girilmelidir." },
            { title: "1/50 ile yüzde 50’yi karıştırmak", text: "1/50, gerçek boyutun ellide biri demektir; yüzde 50 veya yarım ölçek değildir." },
            { title: "Baskıda ölçeği bozmak", text: "PDF yazdırırken 'sayfaya sığdır' seçeneği çizim ölçeğini değiştirebilir. Mümkünse yüzde 100 gerçek boyut kullan." },
            { title: "Farklı birimleri birlikte kullanmak", text: "Hesap boyunca aynı birimde ilerle. Metre, santimetre ve milimetreyi karıştırmadan önce dönüştür." },
          ]}
          faqs={[
            { question: "1/50 ölçekte 1 metre kaç santimetredir?", answer: "Gerçekte 1 metre 100 cm’dir. 100 ÷ 50 = 2 cm; dolayısıyla çizimde 2 cm olur." },
            { question: "1/100 ölçekte 5 metre kaç santimetredir?", answer: "5 metre 500 cm’dir. 500 ÷ 100 = 5 cm olarak çizilir." },
            { question: "Detay çizimleri için hangi ölçek kullanılır?", answer: "Detayın kapsamına göre genellikle 1/20, 1/10, 1/5 veya 1/2 kullanılır. Proje standardı ve istenen anlatım seviyesi belirleyicidir." },
            { question: "PDF çıktısında ölçeği nasıl korurum?", answer: "Belge doğru kâğıt boyutunda hazırlanmalı ve yazdırma sırasında yüzde 100 ya da gerçek boyut seçilmelidir." },
          ]}
          relatedLinks={[
            { href: "/tools/sheet-scale-converter", label: "Pafta ölçek dönüştürücü", description: "Kâğıt boyutu değiştiğinde yeni ölçeği hesapla." },
            { href: "/pdf-tools/resize-pages", label: "PDF pafta boyutu ve ölçek", description: "Dosyanın sayfa boyutunu ve ölçeğini birlikte düzenle." },
            { href: "/tools/architecture-unit-converter", label: "Mimarlık birim dönüştürücü", description: "Metre, santimetre, milimetre ve alan birimlerini dönüştür." },
          ]}
        />
        <RelatedTools currentHref="/tools/scale-calculator" kind="calculation" />
      </div>
    </main>
  );
}
