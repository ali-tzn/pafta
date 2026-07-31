import type { Metadata } from "next";
import ThermalDesigner from "./ThermalDesigner";

export const metadata: Metadata = {
  title: "Detay Kesit ve U-Değeri Tasarımcısı",
  description: "Hazır kesitlerden başla; yapı katmanlarını düzenleyerek U-değeri, ısı köprüsü düzeltmesi, yüzey kütlesi ve yaklaşık yoğuşma riskini incele.",
  alternates: { canonical: "/proje-araclari/u-degeri-tasarimcisi" },
};

export default function ThermalDesignerPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proje Araçları / 07</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Detay Kesit ve U-Değeri Tasarımcısı</h1>
        <p className="mt-4 mb-8 max-w-3xl leading-7 text-slate-400">Hazır duvar, teras çatı ve döşeme kesitlerinden başla veya kendi katmanlarını kur. U-değeri, ısı köprüsü düzeltmesi, yaklaşık yoğuşma profili, yüzey kütlesi ve gerekli ek yalıtımı birlikte değerlendir.</p>
        <ThermalDesigner />
      </div>
    </main>
  );
}
