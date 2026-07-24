"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const fields = {
  type: ["Kültür merkezi", "Konut", "Kütüphane", "Müze", "Okul", "Karma kullanım"],
  style: ["Çağdaş", "Brutalist", "Modernist", "Organik", "Minimal", "Endüstriyel"],
  material: ["Brüt beton ve cam", "Ahşap ve doğal taş", "Tuğla ve metal", "Beyaz sıva ve cam", "Corten çelik ve beton"],
  light: ["Altın saat", "Bulutlu gün ışığı", "Gece aydınlatması", "Yumuşak sabah ışığı", "Dramatik yan ışık"],
  camera: ["İnsan göz hizası", "Geniş açı dış mekân", "İç mekân perspektifi", "Havadan görünüş", "Detay çekimi"],
};

export default function PromptBuilder() {
  const [type, setType] = useState(fields.type[0]);
  const [style, setStyle] = useState(fields.style[0]);
  const [material, setMaterial] = useState(fields.material[0]);
  const [light, setLight] = useState(fields.light[0]);
  const [camera, setCamera] = useState(fields.camera[0]);
  const [context, setContext] = useState("yoğun kent dokusunda, yaya ölçeğine duyarlı");
  const [extra, setExtra] = useState("gerçekçi malzeme birleşimleri, erişilebilir giriş ve doğal peyzaj");
  const [language, setLanguage] = useState<"tr" | "en">("tr");
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => language === "tr"
    ? `${style} yaklaşımla tasarlanmış bir ${type.toLocaleLowerCase("tr-TR")}; ${context}. Ana malzemeler: ${material.toLocaleLowerCase("tr-TR")}. ${light.toLocaleLowerCase("tr-TR")}, ${camera.toLocaleLowerCase("tr-TR")} kamera, doğru perspektif ve insan ölçeği. ${extra}. Yapısal olarak inandırıcı, uygulanabilir detay hissi, okunabilir giriş, gerçekçi çevre ve yüksek kaliteli mimari görselleştirme. Yazı, logo, filigran, bozuk geometri, orantısız insan, imkânsız taşıyıcı sistem ve tekrarlanan nesneler olmasın.`
    : `A ${type.toLowerCase()} designed with a ${style.toLowerCase()} approach, ${context}. Primary materials: ${material.toLowerCase()}. ${light.toLowerCase()}, ${camera.toLowerCase()} camera, accurate perspective and human scale. ${extra}. Structurally believable, buildable detailing, legible entrance, realistic surroundings, high-quality architectural visualization. No text, logo, watermark, broken geometry, distorted people, impossible structure, or repeated objects.`,
  [type, style, material, light, camera, context, extra, language]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 text-sm text-slate-400"><Link href="/">Ana Sayfa</Link><span className="mx-2">/</span><Link href="/mimarlik-yapay-zeka">AI Merkezi</Link><span className="mx-2">/</span><span>Prompt Oluşturucu</span></nav>
        <h1 className="text-4xl font-bold md:text-5xl">Mimari Prompt Oluşturucu</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Seçimleri kendi projenle değiştir; oluşan metni kullandığın görsel üretim aracına göre yeniden düzenle.</p>

        <section className="mt-10 grid gap-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-2">
          <Select label="Yapı türü" value={type} values={fields.type} onChange={setType} />
          <Select label="Mimari yaklaşım" value={style} values={fields.style} onChange={setStyle} />
          <Select label="Malzeme" value={material} values={fields.material} onChange={setMaterial} />
          <Select label="Işık" value={light} values={fields.light} onChange={setLight} />
          <Select label="Kamera" value={camera} values={fields.camera} onChange={setCamera} />
          <Select label="Prompt dili" value={language} values={["tr", "en"]} labels={["Türkçe", "İngilizce"]} onChange={(value) => setLanguage(value as "tr" | "en")} />
          <TextField label="Bağlam" value={context} onChange={setContext} />
          <TextField label="Ek istekler" value={extra} onChange={setExtra} />
        </section>

        <section className="mt-7 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-semibold text-cyan-300">Oluşturulan prompt</h2>
          <textarea readOnly value={prompt} rows={9} className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 leading-7 text-slate-200" />
          <button onClick={copyPrompt} className="mt-4 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">{copied ? "Kopyalandı ✓" : "Promptu kopyala"}</button>
        </section>
      </div>
    </main>
  );
}

function Select({ label, value, values, labels, onChange }: { label: string; value: string; values: string[]; labels?: string[]; onChange: (value: string) => void }) {
  return <label><span className="text-sm font-semibold text-slate-300">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3">{values.map((item, index) => <option key={item} value={item}>{labels?.[index] ?? item}</option>)}</select></label>;
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="text-sm font-semibold text-slate-300">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3" /></label>;
}
