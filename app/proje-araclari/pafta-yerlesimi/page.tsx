import type { Metadata } from "next";
import BoardPlanner from "./BoardPlanner";

export const metadata: Metadata = { title: "Mimari Pafta Yerleşim Oluşturucu | PAFTA", description: "A0, A1 ve A2 mimari sunum paftaları için grid, kenar boşluğu, içerik sırası ve tipografi şeması oluştur.", alternates: { canonical: "/proje-araclari/pafta-yerlesimi" } };

export default function BoardPlannerPage() {
  return <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6"><div className="mx-auto max-w-7xl"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proje Araçları / 03</p><h1 className="mt-4 text-4xl font-black sm:text-5xl">Pafta Yerleşim Oluşturucu</h1><p className="mt-4 mb-8 max-w-3xl leading-7 text-slate-400">Kâğıt biçimini ve sunum türünü seç; grid sistemini kur, içerik sırasını düzenle ve paftanın ilk şemasını oluştur.</p><BoardPlanner /></div></main>;
}
