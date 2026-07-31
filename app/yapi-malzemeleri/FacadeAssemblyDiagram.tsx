import Link from "next/link";

export default function FacadeAssemblyDiagram({ materialName }: { materialName: string }) {
  const layers = [
    ["İç yüzey", "Sıva / levha", "bg-slate-300"],
    ["Taşıyıcı", "Betonarme veya duvar", "bg-slate-500"],
    ["Isı yalıtımı", "Hesaba göre kalınlık", "bg-amber-300"],
    ["Hava boşluğu", "Drenaj ve havalandırma", "bg-slate-950"],
    [materialName, "Mekanik tespitli kaplama", "bg-cyan-400"],
  ];
  return (
    <section id="ornek-cephe-kesiti" className="mt-12 rounded-3xl border border-cyan-400/20 bg-slate-900 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Şematik sistem önerisi</p>
      <h2 className="mt-2 text-2xl font-bold">{materialName} ile havalandırmalı cephe kesiti</h2>
      <p className="mt-3 leading-7 text-slate-400">Bu kesit uygulama projesi değil, katman ilişkisini okumaya yarayan başlangıç şemasıdır. Tespit elemanı, yangın bariyeri, su tahliyesi ve derz çözümü projeye göre ayrıca tasarlanmalıdır.</p>
      <div className="mt-6 flex h-52 items-stretch overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-5">
        {layers.map(([name,,color], index) => <div key={name} className={`${color} relative flex-1 border-r border-slate-900/40 last:border-0 ${index === 1 ? "flex-[2]" : ""}`}><span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-slate-950/80 px-2 py-1 text-xs font-bold text-white">{index + 1}</span>{index === 3 && <span className="absolute left-1/2 top-6 -translate-x-1/2 text-lg text-cyan-300">↑<br/>↑</span>}</div>)}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{layers.map(([name,note], index) => <div key={name} className="rounded-xl bg-slate-950 p-3"><span className="text-xs font-bold text-cyan-400">{index + 1}. KATMAN</span><strong className="mt-1 block text-sm">{name}</strong><span className="mt-1 block text-xs text-slate-500">{note}</span></div>)}</div>
      <div className="mt-5 flex flex-wrap gap-3"><Link href="/proje-araclari/u-degeri-tasarimcisi" className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950">Katmanları U-değeri aracında dene</Link><Link href="/mimari-detaylar" className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold">Detay kütüphanesini aç</Link></div>
    </section>
  );
}
