"use client";

import Link from "next/link";
import { useState } from "react";

const tasks = {
  concept: { title: "Konsept ve fikir geliştirme", category: "Metin + görsel fikir araçları", workflow: ["İhtiyaç programını ve bağlamı kısa metinle tanımla", "Birden fazla yaklaşım üret, tek çıktıya bağlanma", "Fikirleri plan, kesit ve saha verisiyle ele", "Seçtiğin yaklaşımı kendi eskizinle geliştir"], checks: ["Öneri bağlama cevap veriyor mu?", "Kullanıcı ve program ilişkisi kurulmuş mu?", "Biçim taşıyıcı sisteme dönüşebilir mi?"] },
  render: { title: "Render ve görselleştirme", category: "Görsel üretim ve image-to-image araçları", workflow: ["Kendi modelinden kontrollü bir görüntü al", "Malzeme, ışık ve kamera promptunu açık yaz", "Geometriyi koruyan düşük dönüşümle başla", "Kapı, pencere, merdiven ve insan ölçeğini kontrol et"], checks: ["Ana geometri değişti mi?", "Malzeme birleşimleri gerçekçi mi?", "Perspektif ve ölçek doğru mu?"] },
  presentation: { title: "Pafta ve sunum hazırlama", category: "Metin düzenleme + grafik yerleşim yardımcıları", workflow: ["Paftanın mesajını tek cümlede tanımla", "Başlık ve açıklamaları kısalt", "Görsel hiyerarşiyi kendin kur", "Çıktıyı baskı boyutu ve okunabilirlikle test et"], checks: ["AI metni projeyi doğru anlatıyor mu?", "Kaynak ve üretim yöntemi belirtildi mi?", "Pafta uzaktan okunuyor mu?"] },
  research: { title: "Araştırma ve yapı analizi", category: "Kaynak destekli araştırma araçları", workflow: ["Soruyu ve tarih aralığını netleştir", "Birincil ve kurumsal kaynakları iste", "Her iddiayı kaynağında doğrula", "Kendi karşılaştırma ve yorumunu ekle"], checks: ["Kaynak gerçekten var mı?", "Tarih ve isimler doğrulandı mı?", "Metin doğrudan kopyalanmış mı?"] },
  revit: { title: "Revit ve BIM sorun çözme", category: "Metin/kod destekli teknik yardımcılar", workflow: ["Revit sürümünü ve hata mesajını yaz", "Eleman türü ile beklenen sonucu tanımla", "Öneriyi proje kopyasında dene", "Model standardı ve ekip iş akışıyla doğrula"], checks: ["Komut sürümle uyumlu mu?", "Modelde veri kaybı riski var mı?", "Takım standardını bozuyor mu?"] },
};

export default function AiToolFinder() {
  const [task, setTask] = useState<keyof typeof tasks>("concept");
  const result = tasks[task];
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 text-sm text-slate-400"><Link href="/">Ana Sayfa</Link><span className="mx-2">/</span><Link href="/mimarlik-yapay-zeka">AI Merkezi</Link><span className="mx-2">/</span><span>Araç Bulucu</span></nav>
        <h1 className="text-4xl font-bold md:text-5xl">Mimarlık AI Araç Bulucu</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Marka seçmeden önce doğru araç kategorisini ve güvenli çalışma sırasını belirle.</p>
        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <label><span className="text-sm font-semibold text-slate-300">Ne yapmak istiyorsun?</span><select value={task} onChange={(event) => setTask(event.target.value as keyof typeof tasks)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3">{Object.entries(tasks).map(([key, item]) => <option key={key} value={key}>{item.title}</option>)}</select></label>
        </section>
        <section className="mt-7 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
            <p className="text-sm uppercase tracking-wider text-cyan-300">Önerilen kategori</p><h2 className="mt-3 text-2xl font-bold">{result.category}</h2>
            <h3 className="mt-6 font-semibold">İş akışı</h3><ol className="mt-3 space-y-3 text-slate-300">{result.workflow.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}</ol>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Çıktı kontrolü</h2><ul className="mt-5 space-y-3 text-slate-300">{result.checks.map((item) => <li key={item}>• {item}</li>)}</ul>
            <p className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">Gizli proje dosyalarını yüklemeden önce kurum politikasını ve hizmetin veri kullanım koşullarını kontrol et.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
