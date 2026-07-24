"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Task =
  | "concept"
  | "render"
  | "edit"
  | "planning"
  | "presentation"
  | "research"
  | "revit";
type Input = "text" | "sketch" | "image" | "model" | "none";
type Priority = "control" | "speed" | "quality" | "easy";
type Budget = "free" | "freemium" | "paid";

type AiTool = {
  name: string;
  url: string;
  description: string;
  tasks: Task[];
  inputs: Input[];
  priorities: Priority[];
  budgets: Budget[];
  strengths: string[];
  caution: string;
};

const taskOptions: { value: Task; label: string }[] = [
  { value: "concept", label: "Konsept ve tasarım fikri geliştirmek" },
  { value: "render", label: "Eskiz veya modelden mimari görsel üretmek" },
  { value: "edit", label: "Render düzenlemek, eleman eklemek veya silmek" },
  { value: "planning", label: "Arsa, kütle ve yerleşim seçenekleri geliştirmek" },
  { value: "presentation", label: "Pafta, sunum ve proje metni hazırlamak" },
  { value: "research", label: "Mimari araştırma ve kaynak taraması yapmak" },
  { value: "revit", label: "Revit, BIM veya CAD sorunu çözmek" },
];

const inputOptions: { value: Input; label: string }[] = [
  { value: "none", label: "Henüz bir girdim yok" },
  { value: "text", label: "Metin / ihtiyaç programı" },
  { value: "sketch", label: "El eskizi / çizgi çizim" },
  { value: "image", label: "Render / ekran görüntüsü / fotoğraf" },
  { value: "model", label: "Revit, SketchUp, Rhino veya 3B model" },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "control", label: "Geometriyi ve tasarımı koruması" },
  { value: "speed", label: "Hızlı sonuç vermesi" },
  { value: "quality", label: "Görsel kalitesinin yüksek olması" },
  { value: "easy", label: "Kolay öğrenilmesi" },
];

const budgetOptions: { value: Budget; label: string }[] = [
  { value: "free", label: "Yalnızca ücretsiz seçenekler" },
  { value: "freemium", label: "Ücretsiz deneme / sınırlı ücretsiz olabilir" },
  { value: "paid", label: "Ücretli araçlar da olabilir" },
];

const tools: AiTool[] = [
  {
    name: "Chaos Veras",
    url: "https://www.chaos.com/veras",
    description:
      "Eskiz, 2B çizim ve mevcut 3B model üzerinden mimari görsel varyasyonları üretir.",
    tasks: ["render", "concept"],
    inputs: ["sketch", "image", "model"],
    priorities: ["control", "speed", "easy"],
    budgets: ["freemium", "paid"],
    strengths: ["Mevcut geometriyle çalışır", "Mimarlık odaklıdır", "Hızlı varyasyon üretir"],
    caution: "Üretilen cephe, açıklık ve birleşimlerin modele sadakatini kontrol et.",
  },
  {
    name: "LookX AI",
    url: "https://www.lookx.ai/",
    description:
      "Mimarlık ve iç mekân tasarımı için metin, eskiz ve görsel tabanlı konsept üretimine odaklanır.",
    tasks: ["concept", "render"],
    inputs: ["text", "sketch", "image"],
    priorities: ["quality", "speed"],
    budgets: ["freemium", "paid"],
    strengths: ["Mimari görsel dili", "Eskizden görsel", "Konsept çeşitliliği"],
    caution: "Sonucu uygulanabilir bir proje çözümü değil, tasarım alternatifi olarak değerlendir.",
  },
  {
    name: "Autodesk Forma",
    url: "https://www.autodesk.com/products/forma/overview",
    description:
      "Erken tasarım aşamasında arsa, kütle, çevresel analiz ve yerleşim seçeneklerini değerlendirmeye yardım eder.",
    tasks: ["planning", "concept"],
    inputs: ["none", "text", "model"],
    priorities: ["control", "quality"],
    budgets: ["paid"],
    strengths: ["Erken aşama analizi", "Kütle ve yerleşim", "Autodesk iş akışı"],
    caution: "İmar, iklim ve performans sonuçlarını yerel mevzuat ve uzman hesaplarıyla doğrula.",
  },
  {
    name: "Adobe Firefly",
    url: "https://www.adobe.com/products/firefly.html",
    description:
      "Render ve görsellerde üretken dolgu, genişletme, eleman ekleme-silme ve varyasyon üretimi sunar.",
    tasks: ["edit", "presentation", "concept"],
    inputs: ["text", "image"],
    priorities: ["control", "easy", "quality"],
    budgets: ["free", "freemium", "paid"],
    strengths: ["Seçili alanı düzenleme", "Photoshop iş akışı", "Sunum görseli üretme"],
    caution: "Mimari detayların ve yapı elemanlarının teknik doğruluğunu ayrıca denetle.",
  },
  {
    name: "Midjourney",
    url: "https://www.midjourney.com/",
    description:
      "Atmosfer, malzeme, ışık ve mimari dil araştırması için yüksek etkili konsept görselleri üretir.",
    tasks: ["concept", "render"],
    inputs: ["text", "image"],
    priorities: ["quality", "speed"],
    budgets: ["paid"],
    strengths: ["Güçlü atmosfer", "Malzeme ve stil arayışı", "Yüksek görsel kalite"],
    caution: "Plan, ölçü ve mevcut model geometrisini birebir koruması beklenmemelidir.",
  },
  {
    name: "Canva Magic Studio",
    url: "https://www.canva.com/magic-studio/",
    description:
      "Pafta sonrası sunum, sosyal medya görseli, diyagram ve kısa metin düzenleme işlerini hızlandırır.",
    tasks: ["presentation", "edit"],
    inputs: ["text", "image"],
    priorities: ["easy", "speed"],
    budgets: ["free", "freemium", "paid"],
    strengths: ["Kolay kullanım", "Hazır yerleşimler", "Hızlı sunum çıktısı"],
    caution: "Hazır şablonun proje hiyerarşisini belirlemesine izin verme; pafta kararları sana ait olmalı.",
  },
  {
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    description:
      "İhtiyaç programı, kavram geliştirme, proje metni, eleştiri kontrolü ve Revit/BIM sorun çözmede genel amaçlı yardımcıdır.",
    tasks: ["concept", "presentation", "research", "revit"],
    inputs: ["text", "image"],
    priorities: ["easy", "speed", "control"],
    budgets: ["free", "freemium", "paid"],
    strengths: ["Türkçe iletişim", "Görsel ve metin analizi", "Adım adım teknik yardım"],
    caution: "Komut, kaynak, ölçü ve mevzuat bilgilerini özgün belgeler üzerinden doğrula.",
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai/",
    description:
      "Kaynak bağlantılarıyla hızlı ön araştırma, yapı örneği ve güncel konu taraması yapmaya yardımcı olur.",
    tasks: ["research"],
    inputs: ["text"],
    priorities: ["speed", "easy"],
    budgets: ["free", "freemium", "paid"],
    strengths: ["Kaynaklı yanıt", "Hızlı literatür başlangıcı", "Güncel web taraması"],
    caution: "Her alıntıyı açıp asıl kaynağı, yazarı, tarihi ve bağlamı kontrol et.",
  },
];

function scoreTool(
  tool: AiTool,
  task: Task,
  input: Input,
  priority: Priority,
  budget: Budget
) {
  let score = 0;
  if (tool.tasks.includes(task)) score += 8;
  if (tool.inputs.includes(input)) score += 4;
  if (tool.priorities.includes(priority)) score += 3;

  if (budget === "free") {
    score += tool.budgets.includes("free") ? 5 : -20;
  } else if (budget === "freemium") {
    score += tool.budgets.some((item) => item === "free" || item === "freemium")
      ? 3
      : -4;
  } else {
    score += 1;
  }

  return score;
}

export default function AiToolFinder() {
  const [task, setTask] = useState<Task>("render");
  const [input, setInput] = useState<Input>("model");
  const [priority, setPriority] = useState<Priority>("control");
  const [budget, setBudget] = useState<Budget>("freemium");
  const [showResult, setShowResult] = useState(false);

  const recommendations = useMemo(
    () =>
      tools
        .map((tool) => ({
          tool,
          score: scoreTool(tool, task, input, priority, budget),
        }))
        .filter(({ tool }) => tool.tasks.includes(task))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [task, input, priority, budget]
  );

  const primary = recommendations[0]?.tool;
  const hasExactFreeMatch =
    budget !== "free" || Boolean(primary?.budgets.includes("free"));

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/mimarlik-yapay-zeka">AI Merkezi</Link>
          <span className="mx-2">/</span>
          <span>Araç Bulucu</span>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          İhtiyacına göre gerçek araç önerisi
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Mimarlık AI Araç Bulucu
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Yapmak istediğin işi ve elindeki girdiyi seç. PAFTA, o iş için en
          uygun yapay zekâ aracını nedenleri ve alternatifleriyle önersin.
        </p>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <SelectField
              label="1. Ne yapmak istiyorsun?"
              value={task}
              options={taskOptions}
              onChange={(value) => {
                setTask(value as Task);
                setShowResult(false);
              }}
            />
            <SelectField
              label="2. Elinde hangi girdi var?"
              value={input}
              options={inputOptions}
              onChange={(value) => {
                setInput(value as Input);
                setShowResult(false);
              }}
            />
            <SelectField
              label="3. Senin için en önemli özellik?"
              value={priority}
              options={priorityOptions}
              onChange={(value) => {
                setPriority(value as Priority);
                setShowResult(false);
              }}
            />
            <SelectField
              label="4. Bütçe tercihin?"
              value={budget}
              options={budgetOptions}
              onChange={(value) => {
                setBudget(value as Budget);
                setShowResult(false);
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowResult(true)}
            className="mt-8 w-full rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Bana en uygun AI aracını bul
          </button>
        </section>

        {showResult && (
          <section aria-live="polite" className="mt-8">
            {primary ? (
            <>
            <div className="rounded-3xl border-2 border-cyan-400 bg-gradient-to-br from-cyan-400/15 to-slate-900 p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                PAFTA&apos;nın önerisi
              </p>
              <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm text-slate-300">Bu iş için en uygun AI aracı:</p>
                  <h2 className="mt-1 text-4xl font-black text-white">{primary.name}</h2>
                  <p className="mt-3 leading-7 text-slate-300">
                    {primary.description}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-cyan-100">
                    Bu seçim; yapmak istediğin iş, elindeki girdi, önceliğin ve
                    bütçe tercihin birlikte değerlendirilerek oluşturuldu.
                  </p>
                </div>
                <a
                  href={primary.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="shrink-0 rounded-xl bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-100"
                >
                  Resmî sitesini aç ↗
                </a>
              </div>
              {!hasExactFreeMatch && (
                <p className="mt-6 rounded-xl border border-violet-400/30 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
                  Seçtiğin iş için veri tabanımızda tamamen ücretsiz güçlü bir
                  eşleşme yok. Bu nedenle ücretsiz denemesi veya sınırlı
                  kullanımı bulunan en yakın aracı öneriyoruz.
                </p>
              )}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {primary.strengths.map((strength) => (
                  <div
                    key={strength}
                    className="rounded-xl border border-cyan-300/20 bg-slate-950/50 p-4 text-sm text-slate-200"
                  >
                    ✓ {strength}
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
                <strong>Dikkat:</strong> {primary.caution}
              </p>
            </div>

            {recommendations.length > 1 && (
              <div className="mt-7">
                <h2 className="text-2xl font-bold">Güçlü alternatifler</h2>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  {recommendations.slice(1).map(({ tool }, index) => (
                    <article
                      key={tool.name}
                      className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {index + 2}. öneri
                      </p>
                      <h3 className="mt-2 text-xl font-bold">{tool.name}</h3>
                      <p className="mt-3 leading-7 text-slate-300">
                        {tool.description}
                      </p>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="mt-5 inline-flex font-semibold text-cyan-300 hover:text-cyan-200"
                      >
                        Resmî sitesini incele ↗
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            )}
            </>
            ) : (
              <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6 text-amber-100">
                Bu seçim için henüz doğrulanmış bir araç bulunmuyor. Başka bir
                girdi veya bütçe seçerek yeniden deneyebilirsin.
              </div>
            )}
          </section>
        )}

        <p className="mt-10 text-sm leading-6 text-slate-500">
          Araçların özellikleri ve ücretsiz kullanım sınırları zamanla
          değişebilir. Kayıt olmadan önce resmî fiyatlandırma ve veri kullanımı
          sayfalarını kontrol et; gizli proje dosyalarını izinsiz yükleme.
        </p>
      </div>
    </main>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
