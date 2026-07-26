import type { Metadata } from "next";
import RegulationChecker from "./RegulationChecker";

export const metadata: Metadata = { title: "Mimari Yönetmelik Kontrol Asistanı | PAFTA", description: "Yapı türü, alan ve kat sayısına göre imar, yangın, erişilebilirlik, otopark ve dolaşım kontrol başlıklarını oluştur.", alternates: { canonical: "/proje-araclari/yonetmelik-kontrol" } };

export default function RegulationCheckerPage() {
  return <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6"><div className="mx-auto max-w-6xl"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proje Araçları / 05</p><h1 className="mt-4 text-4xl font-black sm:text-5xl">Yönetmelik Kontrol Asistanı</h1><p className="mt-4 mb-8 max-w-3xl leading-7 text-slate-400">Projenin özelliklerini gir; hangi mevzuat ve teknik başlıkları kontrol etmen gerektiğini öncelik sırasıyla gör.</p><RegulationChecker /></div></main>;
}
