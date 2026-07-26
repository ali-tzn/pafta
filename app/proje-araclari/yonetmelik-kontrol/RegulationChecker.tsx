"use client";

import { useMemo, useState } from "react";

type Mode = "basit" | "gelismis";
type Priority = "Kritik" | "Yüksek" | "Orta";

const useSpecificChecks: Record<string, string[]> = {
  Konut: ["Bağımsız bölüm, ortak alan ve ıslak hacim koşulları", "Sığınak, atık ve ortak teknik hacimler"],
  Eğitim: ["Derslik kapasitesi, çocuk güvenliği ve kontrollü giriş", "Laboratuvar/atölye özel riskleri"],
  "Kültür Merkezi": ["Toplanma amaçlı kullanım, seyirci yükü ve salon tahliyesi", "Fuaye, sahne, kulis ve servis ayrımı"],
  Otel: ["Erişilebilir oda ve konaklama sınıfı koşulları", "Misafir, personel, mutfak ve servis dolaşımı"],
  Ofis: ["Çalışan yoğunluğu, ortak alan ve toplantı yükleri", "Arşiv, IT ve teknik hacimlerin yangın yükü"],
  Müze: ["Ziyaretçi yoğunluğu ve sergi tahliyesi", "Eser kabul, depo, güvenlik ve iklimlendirme"],
  Sağlık: ["Hasta, personel, temiz ve kirli akışların ayrılması", "Sedye dolaşımı, medikal altyapı ve erişilebilirlik"],
  Ticaret: ["Müşteri yükü, vitrin/giriş ve bağımsız kaçışlar", "Mal kabul, depo ve atık rotalarının ayrılması"],
};

export default function RegulationChecker() {
  const [mode, setMode] = useState<Mode>("basit");
  const [type, setType] = useState("Konut");
  const [parcelArea, setParcelArea] = useState(1000);
  const [plannedArea, setPlannedArea] = useState(1800);
  const [floors, setFloors] = useState(4);
  const [users, setUsers] = useState(80);
  const [basement, setBasement] = useState(false);
  const [closedParking, setClosedParking] = useState(false);

  const [taks, setTaks] = useState(0.35);
  const [kaks, setKaks] = useState(1.5);
  const [zoning, setZoning] = useState("Ayrık Nizam");
  const [hmax, setHmax] = useState(15.5);
  const [frontSetback, setFrontSetback] = useState(5);
  const [sideSetback, setSideSetback] = useState(3);
  const [rearSetback, setRearSetback] = useState(3);
  const [frontage, setFrontage] = useState(25);
  const [depth, setDepth] = useState(40);
  const [slope, setSlope] = useState(4);
  const [cornerParcel, setCornerParcel] = useState(false);
  const [specialArea, setSpecialArea] = useState(false);
  const [generated, setGenerated] = useState(false);

  const metrics = useMemo(() => {
    const maxFootprint = parcelArea * taks;
    const maxEmsalArea = parcelArea * kaks;
    const estimatedFootprint = plannedArea / Math.max(floors, 1);
    const buildableWidth = Math.max(0, frontage - (zoning === "Bitişik Nizam" ? 0 : sideSetback * 2));
    const buildableDepth = Math.max(0, depth - frontSetback - rearSetback);
    const setbackEnvelope = buildableWidth * buildableDepth;
    const effectiveFootprint =
      mode === "gelismis"
        ? Math.min(maxFootprint, setbackEnvelope)
        : maxFootprint;
    const assumedFloorHeight = 3.2;
    const maxFloorsByHeight =
      mode === "gelismis"
        ? Math.max(1, Math.floor(hmax / assumedFloorHeight))
        : floors;
    const capacityByFootprint = effectiveFootprint * maxFloorsByHeight;
    const estimatedCapacity = Math.min(maxEmsalArea, capacityByFootprint);
    const remainingEmsal = maxEmsalArea - plannedArea;
    const remainingCapacity = estimatedCapacity - plannedArea;
    const requiredFloors = Math.ceil(
      plannedArea / Math.max(effectiveFootprint, 1)
    );
    const emsalUsage = plannedArea / Math.max(maxEmsalArea, 1);
    const footprintUsage =
      estimatedFootprint / Math.max(effectiveFootprint, 1);

    return {
      maxFootprint,
      maxEmsalArea,
      estimatedFootprint,
      buildableWidth,
      buildableDepth,
      setbackEnvelope,
      effectiveFootprint,
      maxFloorsByHeight,
      capacityByFootprint,
      estimatedCapacity,
      remainingEmsal,
      remainingCapacity,
      requiredFloors,
      emsalUsage,
      footprintUsage,
    };
  }, [depth, floors, frontage, frontSetback, hmax, kaks, mode, parcelArea, plannedArea, rearSetback, sideSetback, taks, zoning]);

  const checks = useMemo(() => {
    const list: { group: string; item: string; priority: Priority; status?: "uygun" | "uyari" }[] = [
      { group: "İmar durumu", item: "Onaylı imar durumu belgesi, plan notları, fonksiyon, nizam, yapı yaklaşma sınırları ve kot kararlarını aynı anda doğrula.", priority: "Kritik" },
      { group: "Yangın", item: "Kullanıcı yükü, kaçış sayısı, kaçış uzaklığı, merdiven genişliği, yangın bölmeleri ve kapı açılışlarını hesapla.", priority: "Kritik" },
      { group: "Erişilebilirlik", item: "Parsel girişinden tüm ortak kullanımlara kesintisiz erişilebilir rota; rampa/asansör, WC ve otopark sağla.", priority: "Kritik" },
      { group: "Otopark", item: "Güncel Otopark Yönetmeliği, yapı kullanımı ve bağımsız bölüm verileriyle araç/bisiklet ihtiyacını ayrıca hesapla.", priority: "Yüksek" },
      { group: "Kullanım", item: `${type} için ${useSpecificChecks[type][0]}.`, priority: "Yüksek" },
      { group: "Kullanım", item: `${type} için ${useSpecificChecks[type][1]}.`, priority: "Yüksek" },
    ];

    if (plannedArea > parcelArea * kaks) list.push({ group: "Emsal", item: `Girilen ${plannedArea.toLocaleString("tr-TR")} m² alan, yazdığın KAKS ile hesaplanan yaklaşık ${metrics.maxEmsalArea.toLocaleString("tr-TR")} m² sınırı aşıyor. Emsale dahil/harici alanları plan notlarıyla ayır.`, priority: "Kritik", status: "uyari" });
    else list.push({ group: "Emsal", item: `Girilen alan, yazdığın KAKS değerinden türetilen yaklaşık üst sınırın altında. Emsal harici alanlar ve plan notları yine doğrulanmalı.`, priority: "Yüksek", status: "uygun" });

    if (metrics.estimatedFootprint > metrics.maxFootprint) list.push({ group: "TAKS", item: `Katlara eşit dağılım varsayımındaki yaklaşık ${Math.round(metrics.estimatedFootprint)} m² oturum, TAKS'tan türetilen ${Math.round(metrics.maxFootprint)} m² oturumu aşıyor.`, priority: "Kritik", status: "uyari" });
    if (mode === "gelismis" && metrics.estimatedFootprint > metrics.setbackEnvelope) list.push({ group: "Yerleşim zarfı", item: `Girilen çekme mesafeleriyle yaklaşık yapı zarfı ${Math.round(metrics.setbackEnvelope)} m². Tahmini kat oturumu bu zarfı aşıyor; parsel geometrisi üzerinde kontrol et.`, priority: "Kritik", status: "uyari" });
    if (mode === "gelismis" && floors * 3.2 > hmax) list.push({ group: "Yükseklik", item: `${floors} kat için kaba 3,20 m/kat varsayımı Hmax değerini aşıyor. Gerçek kat yükseklikleri, kot alma ve plan notlarını kontrol et.`, priority: "Kritik", status: "uyari" });
    if (basement) list.push({ group: "Bodrum", item: "Bodrumun emsal hesabı, kaçışı, duman kontrolü, su yalıtımı, havalandırması ve kullanım koşullarını kontrol et.", priority: "Kritik" });
    if (closedParking) list.push({ group: "Kapalı otopark", item: "Rampa, manevra, havalandırma, yangın bölmeleri, sprinkler/duman kontrolü ve yaya çıkışlarını birlikte çöz.", priority: "Kritik" });
    if (users >= 200) list.push({ group: "Yoğunluk", item: `${users} kişilik kullanım için çıkış kapasitesi, WC sayıları, toplanma alanı ve acil durum senaryosu ayrıca hesaplanmalı.`, priority: "Kritik" });
    if (mode === "gelismis" && slope >= 10) list.push({ group: "Eğim", item: `%${slope} parsel eğimi için kot alma, istinat, erişilebilir rota, bodrum açığa çıkması ve kat adedi etkisini kesit üzerinde doğrula.`, priority: "Yüksek" });
    if (mode === "gelismis" && cornerParcel) list.push({ group: "Köşe parsel", item: "Birden fazla yol cephesi için ön bahçe, görüş güvenliği, giriş ve kot alma kararlarını ilgili idareyle doğrula.", priority: "Yüksek" });
    if (mode === "gelismis" && specialArea) list.push({ group: "Özel alan", item: "Koruma, kıyı, sit, havza veya başka özel alan kararı varsa genel imar hükümleri tek başına yeterli değildir; özel mevzuat ve kurul kararlarını incele.", priority: "Kritik" });
    return list;
  }, [basement, closedParking, cornerParcel, floors, hmax, kaks, metrics, mode, parcelArea, plannedArea, slope, specialArea, type, users]);

  const conflicts = checks.filter((check) => check.status === "uyari");
  const reportStatus =
    conflicts.length >= 2
      ? {
          label: "Revizyon gerekli",
          text: "Girilen değerler arasında birden fazla sayısal çakışma var. Kütleyi veya imar girdilerini doğrulamadan plan geliştirmeye geçme.",
          className: "border-rose-400/30 bg-rose-400/10 text-rose-100",
        }
      : conflicts.length === 1
        ? {
            label: "Kritik kontrol var",
            text: "Program genel olarak okunabiliyor ancak aşağıdaki sayısal çakışma çözülmeden uygun kabul edilmemeli.",
            className: "border-amber-400/30 bg-amber-400/10 text-amber-100",
          }
        : {
            label: "Ön kontrolde çakışma görünmüyor",
            text: "Girilen sayılar birbirleriyle temel düzeyde uyumlu. Bu sonuç mevzuat uygunluğu değil; bir sonraki adım belge ve plan kontrolüdür.",
            className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
          };

  const actions = [
    conflicts.length > 0
      ? "Önce kırmızı işaretli sayısal çakışmaları çöz ve raporu yeniden üret."
      : "İmar durumundaki TAKS, KAKS, nizam, Hmax ve çekme değerlerini plan notlarıyla satır satır doğrula.",
    metrics.requiredFloors > metrics.maxFloorsByHeight
      ? `Planlanan alan, hesaplanan oturumla yaklaşık ${metrics.requiredFloors} kat istiyor; Hmax varsayımı ise yaklaşık ${metrics.maxFloorsByHeight} kata izin veriyor. Alanı azalt veya imar girdilerini kontrol et.`
      : `Planlanan alan için oturum sınırına göre en az ${metrics.requiredFloors} kat gerekiyor; seçilen ${floors} katlı şemayı bu değerle karşılaştır.`,
    "Parsel krokisi üzerinde gerçek geometriyi çiz; burada hesaplanan çekme zarfı dikdörtgen parsel varsayımıdır.",
    `Yaklaşık ${users} kullanıcı için yangın kaçışı, merdiven/çıkış kapasitesi, WC ve erişilebilirlik hesabını yapı kullanımına göre yap.`,
    closedParking
      ? "Kapalı otopark rampası, manevra, havalandırma ve yaya kaçışını kütle kararından önce yerleştir."
      : "Otopark ihtiyacını güncel yönetmelik ve yerel idare koşullarıyla belirle.",
  ];

  const inputClass = "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400";

  return (
    <div>
      <div className="mb-5 inline-flex rounded-xl border border-slate-700 bg-slate-900 p-1">
        <button onClick={() => { setMode("basit"); setGenerated(false); }} className={`rounded-lg px-5 py-2 text-sm font-semibold ${mode === "basit" ? "bg-cyan-400 text-slate-950" : "text-slate-300"}`}>Basit sorgulama</button>
        <button onClick={() => { setMode("gelismis"); setGenerated(false); }} className={`rounded-lg px-5 py-2 text-sm font-semibold ${mode === "gelismis" ? "bg-cyan-400 text-slate-950" : "text-slate-300"}`}>Gelişmiş ayarlar</button>
      </div>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-slate-300">Yapı türü<select value={type} onChange={(event) => setType(event.target.value)} className={inputClass}>{Object.keys(useSpecificChecks).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="text-sm text-slate-300">Parsel alanı (m²)<input type="number" min="1" value={parcelArea} onChange={(event) => setParcelArea(Number(event.target.value))} className={inputClass} /></label>
          <label className="text-sm text-slate-300">Planlanan toplam alan (m²)<input type="number" min="1" value={plannedArea} onChange={(event) => setPlannedArea(Number(event.target.value))} className={inputClass} /></label>
          <label className="text-sm text-slate-300">Toplam kat sayısı<input type="number" min="1" value={floors} onChange={(event) => setFloors(Number(event.target.value))} className={inputClass} /></label>
          <label className="text-sm text-slate-300">Tahmini kullanıcı sayısı<input type="number" min="1" value={users} onChange={(event) => setUsers(Number(event.target.value))} className={inputClass} /></label>
          <label className="text-sm text-slate-300">TAKS<input type="number" min="0.01" max="1" step="0.01" value={taks} onChange={(event) => setTaks(Number(event.target.value))} className={inputClass} /></label>
          <label className="text-sm text-slate-300">KAKS / Emsal<input type="number" min="0.01" step="0.05" value={kaks} onChange={(event) => setKaks(Number(event.target.value))} className={inputClass} /></label>
          <div className="flex flex-col justify-end gap-3 pb-1 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={basement} onChange={(event) => setBasement(event.target.checked)} className="accent-cyan-400" /> Bodrum var</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={closedParking} onChange={(event) => setClosedParking(event.target.checked)} className="accent-cyan-400" /> Kapalı otopark var</label>
          </div>
        </div>

        {mode === "gelismis" && (
          <div className="mt-6 border-t border-slate-800 pt-6">
            <h2 className="mb-4 text-lg font-bold">Parsel ve imar ayrıntıları</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm text-slate-300">Yapı nizamı<select value={zoning} onChange={(event) => setZoning(event.target.value)} className={inputClass}><option>Ayrık Nizam</option><option>Bitişik Nizam</option><option>Blok Nizam</option></select></label>
              <label className="text-sm text-slate-300">Hmax (m)<input type="number" min="1" step="0.5" value={hmax} onChange={(event) => setHmax(Number(event.target.value))} className={inputClass} /></label>
              <label className="text-sm text-slate-300">Parsel cephesi (m)<input type="number" min="1" value={frontage} onChange={(event) => setFrontage(Number(event.target.value))} className={inputClass} /></label>
              <label className="text-sm text-slate-300">Parsel derinliği (m)<input type="number" min="1" value={depth} onChange={(event) => setDepth(Number(event.target.value))} className={inputClass} /></label>
              <label className="text-sm text-slate-300">Ön çekme (m)<input type="number" min="0" step="0.5" value={frontSetback} onChange={(event) => setFrontSetback(Number(event.target.value))} className={inputClass} /></label>
              <label className="text-sm text-slate-300">Yan çekme (m)<input type="number" min="0" step="0.5" value={sideSetback} onChange={(event) => setSideSetback(Number(event.target.value))} className={inputClass} /></label>
              <label className="text-sm text-slate-300">Arka çekme (m)<input type="number" min="0" step="0.5" value={rearSetback} onChange={(event) => setRearSetback(Number(event.target.value))} className={inputClass} /></label>
              <label className="text-sm text-slate-300">Parsel eğimi (%)<input type="number" min="0" step="1" value={slope} onChange={(event) => setSlope(Number(event.target.value))} className={inputClass} /></label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cornerParcel} onChange={(event) => setCornerParcel(event.target.checked)} className="accent-cyan-400" /> Köşe parsel</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={specialArea} onChange={(event) => setSpecialArea(event.target.checked)} className="accent-cyan-400" /> Sit / koruma / özel alan kararı var</label>
            </div>
          </div>
        )}
        <button onClick={() => setGenerated(true)} className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 hover:bg-cyan-300">Ön kontrol raporunu oluştur</button>
      </section>

      {generated && (
        <div className="mt-8 space-y-6">
          <section className={`rounded-3xl border p-6 ${reportStatus.className}`}>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Ön değerlendirme</p>
            <h2 className="mt-2 text-2xl font-black">{reportStatus.label}</h2>
            <p className="mt-3 max-w-3xl leading-7 opacity-90">{reportStatus.text}</p>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">01 / Kapasite özeti</p>
                <h2 className="mt-2 text-2xl font-bold">İmar girdileri ne kadar yapı üretiyor?</h2>
              </div>
              <span className="text-sm text-slate-500">{mode === "gelismis" ? "Gelişmiş sorgu" : "Basit sorgu"} · {type}</span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ["TAKS oturumu", `${Math.round(metrics.maxFootprint).toLocaleString("tr-TR")} m²`, `${parcelArea} × ${taks}`],
                ["Yerleşebilir oturum", `${Math.round(metrics.effectiveFootprint).toLocaleString("tr-TR")} m²`, mode === "gelismis" ? "TAKS ve çekme zarfından küçüğü" : "TAKS varsayımı"],
                ["Emsal hakkı", `${Math.round(metrics.maxEmsalArea).toLocaleString("tr-TR")} m²`, `${parcelArea} × ${kaks}`],
                ["Planlanan alan", `${plannedArea.toLocaleString("tr-TR")} m²`, `%${Math.round(metrics.emsalUsage * 100)} emsal kullanımı`],
                ["Yaklaşık kalan", `${Math.round(metrics.remainingCapacity).toLocaleString("tr-TR")} m²`, metrics.remainingCapacity >= 0 ? "Hesaplanan kapasite içinde" : "Kapasite aşımı"],
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className={`mt-2 text-xl font-bold ${label === "Yaklaşık kalan" && metrics.remainingCapacity < 0 ? "text-rose-300" : "text-cyan-300"}`}>{value}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Emsal hakkı kullanımı</span><strong>%{Math.round(metrics.emsalUsage * 100)}</strong></div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${metrics.emsalUsage > 1 ? "bg-rose-400" : "bg-cyan-400"}`} style={{ width: `${Math.min(100, metrics.emsalUsage * 100)}%` }} /></div>
                <p className="mt-3 text-xs leading-5 text-slate-500">{metrics.remainingEmsal >= 0 ? `KAKS hesabına göre yaklaşık ${Math.round(metrics.remainingEmsal).toLocaleString("tr-TR")} m² kullanılmamış emsal alanı var.` : `Planlanan alan yaklaşık ${Math.abs(Math.round(metrics.remainingEmsal)).toLocaleString("tr-TR")} m² emsal hakkını aşıyor.`}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Tahmini oturum kullanımı</span><strong>%{Math.round(metrics.footprintUsage * 100)}</strong></div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${metrics.footprintUsage > 1 ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: `${Math.min(100, metrics.footprintUsage * 100)}%` }} /></div>
                <p className="mt-3 text-xs leading-5 text-slate-500">Planlanan alanın {floors} kata eşit dağıldığı varsayılmıştır. Gerçek kütlede kat alanları farklı olabilir.</p>
              </div>
            </div>
          </section>

          {mode === "gelismis" && (
            <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">02 / Parsel zarfı</p>
                <h2 className="mt-2 text-2xl font-bold">Çekme mesafeleri sonrası yaklaşık alan</h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[["Yapı zarfı genişliği", `${metrics.buildableWidth.toFixed(1)} m`], ["Yapı zarfı derinliği", `${metrics.buildableDepth.toFixed(1)} m`], ["Dikdörtgen zarf alanı", `${Math.round(metrics.setbackEnvelope)} m²`], ["Hmax kat varsayımı", `${metrics.maxFloorsByHeight} kat`]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 font-bold text-cyan-300">{value}</p></div>)}
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">Bu hesap parseli {frontage} × {depth} m dikdörtgen kabul eder. Kadastro sınırı, yol terkleri, köşe kırıkları, blok nizam ve plan notları sonucu değiştirebilir.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Kütle senaryosu</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">Yerleşebilir yaklaşık oturum <strong className="text-white">{Math.round(metrics.effectiveFootprint)} m²</strong>. Planlanan alanı bu oturumla çözmek için yaklaşık <strong className="text-white">{metrics.requiredFloors} kat</strong> gerekir.</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">Hmax / 3,20 m kaba varsayımı yaklaşık <strong className="text-white">{metrics.maxFloorsByHeight} kat</strong> verir. Bu iki değer uyuşmuyorsa kütle senaryosu revize edilmelidir.</p>
              </div>
            </section>
          )}

          {conflicts.length > 0 && (
            <section className="rounded-3xl border border-rose-400/30 bg-rose-400/5 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-300">03 / Sayısal çakışmalar</p>
              <div className="mt-5 space-y-3">
                {conflicts.map((check, index) => <div key={`${check.group}-${index}`} className="rounded-2xl border border-rose-400/20 bg-slate-950/60 p-5"><h3 className="font-bold text-rose-200">{check.group}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{check.item}</p></div>)}
              </div>
            </section>
          )}

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">04 / Yapılacaklar</p>
              <h2 className="mt-2 text-2xl font-bold">Projeye geçmeden önce</h2>
              <ol className="mt-5 space-y-4">
                {actions.map((action, index) => <li key={action} className="flex gap-4 text-sm leading-6 text-slate-300"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 font-mono text-xs text-cyan-300">{index + 1}</span><span>{action}</span></li>)}
              </ol>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">05 / Teknik kontrol listesi</p>
              <div className="mt-5 space-y-3">
                {checks.filter((check) => check.status !== "uyari").map((check, index) => <label key={`${check.group}-${index}`} className="flex cursor-pointer gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6"><input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-cyan-400" /><span><strong className="block text-white">{check.group}</strong><span className="text-slate-400">{check.item}</span></span></label>)}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">06 / İstenen belgeler</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {["Onaylı imar durumu belgesi", "Yürürlükteki plan ve plan notları", "Aplikasyon krokisi / koordinatlı parsel", "Kot kesiti ve yol kotları", "Tapu ve varsa irtifak/şerhler", "İlgili belediyenin güncel uygulama notları", "Yangın kaçış ve kullanıcı yükü hesabı", "Otopark ihtiyacı hesabı", "Erişilebilirlik kontrolü"].map((document) => <div key={document} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300"><span className="text-cyan-400">□</span>{document}</div>)}
            </div>
          </section>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-6 text-amber-100"><strong>Sınır:</strong> Araç, girdiğin imar değerlerinin resmî belgede doğru olup olmadığını ve emsale dahil/harici alanları bilemez. Hesaplar ön tasarım kararı içindir; ruhsat veya mevzuat uygunluğu beyan etmez.</div>
          <button onClick={() => window.print()} className="rounded-xl border border-cyan-400/60 px-5 py-3 font-semibold text-cyan-300">Detaylı raporu yazdır / PDF kaydet</button>
        </div>
      )}
    </div>
  );
}
