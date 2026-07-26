import type { Metadata } from "next";
import SpaceLibrary from "./SpaceLibrary";

export const metadata: Metadata = {
  title: "Mimari Mekân Ölçüleri Kütüphanesi | PAFTA",
  description: "Derslik, ofis, kütüphane, restoran, otel odası, WC, otopark, koridor ve merdiven için minimum ve önerilen mimari ölçüler.",
  alternates: { canonical: "/proje-araclari/mekan-olculeri" },
};

export default function SpaceLibraryPage() {
  return <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6"><div className="mx-auto max-w-7xl"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Proje Araçları / 02</p><h1 className="mt-4 text-4xl font-black sm:text-5xl">Mekân Ölçüleri Kütüphanesi</h1><p className="mt-4 mb-8 max-w-3xl leading-7 text-slate-400">İlk yerleşim kararları için hızlı referans değerleri. Uygulama projesinde ilgili standart ve güncel mevzuatı ayrıca doğrula.</p><SpaceLibrary /></div></main>;
}
