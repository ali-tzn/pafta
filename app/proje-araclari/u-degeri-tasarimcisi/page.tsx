import type { Metadata } from "next";
import ThermalDesigner from "./ThermalDesigner";

export const metadata: Metadata = {
  title: "Duvar, Çatı ve Döşeme U-Değeri Hesaplama | PAFTA",
  description: "Yapı katmanlarını oluştur, malzeme kalınlığı ve ısıl iletkenlik değerleriyle duvar, çatı ve döşeme U-değerini hesapla.",
  alternates: { canonical: "/proje-araclari/u-degeri-tasarimcisi" },
};

export default function ThermalDesignerPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proje Araçları / 07</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Duvar, Çatı ve Döşeme Katman Tasarımcısı</h1>
        <p className="mt-4 mb-8 max-w-3xl leading-7 text-slate-400">Katmanları içten dışa sırala; kalınlık ve ısıl iletkenlik değerleriyle toplam ısıl direnci, U-değerini ve yaklaşık iletim ısı kaybını hesapla.</p>
        <ThermalDesigner />
      </div>
    </main>
  );
}
