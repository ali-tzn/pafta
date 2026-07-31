"use client";

import { DragEvent, useMemo, useRef, useState } from "react";

type AssemblyType = "Dış Duvar" | "Çatı" | "Döşeme";

type Material = {
  id: string;
  name: string;
  category: string;
  lambda: number;
  color: string;
  pattern?: "solid" | "dots" | "lines";
};

type Layer = {
  id: string;
  materialId: string;
  name: string;
  thickness: number;
  lambda: number;
  color: string;
  resistanceOverride?: number;
};

const materials: Material[] = [
  { id: "gypsum-plaster", name: "Alçı sıva", category: "Kaplama", lambda: 0.35, color: "#f1f5f9" },
  { id: "cement-plaster", name: "Çimento esaslı sıva", category: "Kaplama", lambda: 0.87, color: "#cbd5e1" },
  { id: "brick", name: "Delikli tuğla", category: "Duvar", lambda: 0.45, color: "#c2410c", pattern: "lines" },
  { id: "aerated-concrete", name: "Gazbeton", category: "Duvar", lambda: 0.13, color: "#e2e8f0", pattern: "dots" },
  { id: "pumice", name: "Bims blok", category: "Duvar", lambda: 0.20, color: "#94a3b8", pattern: "dots" },
  { id: "reinforced-concrete", name: "Betonarme", category: "Taşıyıcı", lambda: 2.30, color: "#64748b", pattern: "dots" },
  { id: "concrete", name: "Beton", category: "Taşıyıcı", lambda: 2.00, color: "#64748b" },
  { id: "mineral-wool", name: "Cam yünü", category: "Isı Yalıtımı", lambda: 0.035, color: "#fde68a", pattern: "lines" },
  { id: "rock-wool", name: "Taş yünü", category: "Isı Yalıtımı", lambda: 0.037, color: "#fbbf24", pattern: "lines" },
  { id: "eps", name: "EPS", category: "Isı Yalıtımı", lambda: 0.035, color: "#f8fafc", pattern: "dots" },
  { id: "xps", name: "XPS", category: "Isı Yalıtımı", lambda: 0.034, color: "#a5f3fc", pattern: "lines" },
  { id: "pir", name: "PIR levha", category: "Isı Yalıtımı", lambda: 0.024, color: "#ddd6fe", pattern: "lines" },
  { id: "wood", name: "Masif ahşap", category: "Ahşap", lambda: 0.13, color: "#b45309", pattern: "lines" },
  { id: "osb", name: "OSB levha", category: "Ahşap", lambda: 0.13, color: "#d97706", pattern: "dots" },
  { id: "screed", name: "Çimento şap", category: "Döşeme", lambda: 1.40, color: "#a8a29e" },
  { id: "ceramic", name: "Seramik kaplama", category: "Kaplama", lambda: 1.00, color: "#e7e5e4", pattern: "lines" },
  { id: "stone", name: "Doğal taş", category: "Kaplama", lambda: 2.30, color: "#78716c", pattern: "dots" },
  { id: "plasterboard", name: "Alçı levha", category: "Levha", lambda: 0.21, color: "#fafafa" },
  { id: "fiber-cement", name: "Fibercement levha", category: "Levha", lambda: 0.35, color: "#d6d3d1" },
  { id: "waterproofing", name: "Su yalıtım membranı", category: "Membran", lambda: 0.20, color: "#2563eb" },
  { id: "vapor-barrier", name: "Buhar kesici", category: "Membran", lambda: 0.20, color: "#ef4444" },
  { id: "drainage", name: "Drenaj levhası", category: "Membran", lambda: 0.50, color: "#1e3a8a" },
  { id: "gravel", name: "Çakıl", category: "Dolgu", lambda: 2.00, color: "#71717a", pattern: "dots" },
  { id: "soil", name: "Toprak", category: "Dolgu", lambda: 1.50, color: "#78350f", pattern: "dots" },
  { id: "air-layer", name: "Durgun hava boşluğu", category: "Boşluk", lambda: 1, color: "#dbeafe", pattern: "lines" },
  { id: "custom", name: "Özel malzeme", category: "Özel", lambda: 0.50, color: "#f0abfc" },
];

const materialPhysics: Record<string, { mu: number; density: number }> = {
  "gypsum-plaster": { mu: 10, density: 900 }, "cement-plaster": { mu: 20, density: 1800 },
  brick: { mu: 10, density: 800 }, "aerated-concrete": { mu: 6, density: 500 },
  pumice: { mu: 8, density: 700 }, "reinforced-concrete": { mu: 80, density: 2400 },
  concrete: { mu: 80, density: 2200 }, "mineral-wool": { mu: 1, density: 25 },
  "rock-wool": { mu: 1, density: 70 }, eps: { mu: 30, density: 20 },
  xps: { mu: 100, density: 35 }, pir: { mu: 60, density: 32 },
  wood: { mu: 50, density: 550 }, osb: { mu: 200, density: 650 },
  screed: { mu: 50, density: 2000 }, ceramic: { mu: 200, density: 2100 },
  stone: { mu: 150, density: 2600 }, plasterboard: { mu: 10, density: 750 },
  "fiber-cement": { mu: 50, density: 1500 }, waterproofing: { mu: 20000, density: 1100 },
  "vapor-barrier": { mu: 100000, density: 950 }, drainage: { mu: 50, density: 700 },
  gravel: { mu: 5, density: 1700 }, soil: { mu: 10, density: 1600 },
  "air-layer": { mu: 1, density: 1.2 }, custom: { mu: 20, density: 1000 },
};

const templateLayers: Record<AssemblyType, Omit<Layer, "id">[]> = {
  "Dış Duvar": [
    { materialId: "gypsum-plaster", name: "Alçı sıva", thickness: 15, lambda: 0.35, color: "#f1f5f9" },
    { materialId: "brick", name: "Delikli tuğla", thickness: 190, lambda: 0.45, color: "#c2410c" },
    { materialId: "rock-wool", name: "Taş yünü", thickness: 80, lambda: 0.037, color: "#fbbf24" },
    { materialId: "cement-plaster", name: "Dış cephe sıvası", thickness: 20, lambda: 0.87, color: "#cbd5e1" },
  ],
  Çatı: [
    { materialId: "gypsum-plaster", name: "İç yüzey kaplaması", thickness: 15, lambda: 0.35, color: "#f1f5f9" },
    { materialId: "reinforced-concrete", name: "Betonarme döşeme", thickness: 150, lambda: 2.30, color: "#64748b" },
    { materialId: "xps", name: "XPS ısı yalıtımı", thickness: 100, lambda: 0.034, color: "#a5f3fc" },
    { materialId: "screed", name: "Eğim şapı", thickness: 50, lambda: 1.40, color: "#a8a29e" },
    { materialId: "ceramic", name: "Üst kaplama", thickness: 15, lambda: 1.00, color: "#e7e5e4" },
  ],
  Döşeme: [
    { materialId: "ceramic", name: "Seramik kaplama", thickness: 10, lambda: 1.00, color: "#e7e5e4" },
    { materialId: "screed", name: "Çimento şap", thickness: 50, lambda: 1.40, color: "#a8a29e" },
    { materialId: "rock-wool", name: "Taş yünü", thickness: 50, lambda: 0.037, color: "#fbbf24" },
    { materialId: "reinforced-concrete", name: "Betonarme döşeme", thickness: 150, lambda: 2.30, color: "#64748b" },
    { materialId: "gypsum-plaster", name: "Alt yüzey sıvası", thickness: 15, lambda: 0.35, color: "#f1f5f9" },
  ],
};

const assemblyPresets: Record<AssemblyType, { name: string; description: string; layers: Omit<Layer, "id">[] }[]> = {
  "Dış Duvar": [
    { name: "Tuğla + mantolama", description: "Sıvalı klasik dış duvar", layers: templateLayers["Dış Duvar"] },
    { name: "Gazbeton + taş yünü", description: "Hafif blok ve dıştan yalıtım", layers: [
      { materialId: "gypsum-plaster", name: "Alçı sıva", thickness: 15, lambda: 0.35, color: "#f1f5f9" },
      { materialId: "aerated-concrete", name: "Gazbeton", thickness: 200, lambda: 0.13, color: "#e2e8f0" },
      { materialId: "rock-wool", name: "Taş yünü", thickness: 100, lambda: 0.037, color: "#fbbf24" },
      { materialId: "cement-plaster", name: "Mineral dış sıva", thickness: 15, lambda: 0.87, color: "#cbd5e1" },
    ] },
    { name: "Havalandırmalı cephe", description: "Betonarme, yalıtım, hava boşluğu ve levha", layers: [
      { materialId: "gypsum-plaster", name: "İç sıva", thickness: 15, lambda: 0.35, color: "#f1f5f9" },
      { materialId: "reinforced-concrete", name: "Betonarme", thickness: 200, lambda: 2.30, color: "#64748b" },
      { materialId: "rock-wool", name: "Cephe taş yünü", thickness: 120, lambda: 0.037, color: "#fbbf24" },
      { materialId: "air-layer", name: "Havalandırma boşluğu", thickness: 50, lambda: 1, color: "#dbeafe", resistanceOverride: 0.18 },
      { materialId: "fiber-cement", name: "Fibercement kaplama", thickness: 12, lambda: 0.35, color: "#d6d3d1" },
    ] },
  ],
  Çatı: [
    { name: "Sıcak teras çatı", description: "Taşıyıcı üstünde buhar ve ısı kontrolü", layers: [
      { materialId: "gypsum-plaster", name: "İç sıva", thickness: 15, lambda: 0.35, color: "#f1f5f9" },
      { materialId: "reinforced-concrete", name: "Betonarme döşeme", thickness: 180, lambda: 2.30, color: "#64748b" },
      { materialId: "vapor-barrier", name: "Buhar kesici", thickness: 1, lambda: 0.20, color: "#ef4444" },
      { materialId: "rock-wool", name: "Çatı taş yünü", thickness: 140, lambda: 0.037, color: "#fbbf24" },
      { materialId: "screed", name: "Eğim şapı", thickness: 50, lambda: 1.40, color: "#a8a29e" },
      { materialId: "waterproofing", name: "Su yalıtım membranı", thickness: 4, lambda: 0.20, color: "#2563eb" },
    ] },
    { name: "Ters teras çatı", description: "Su yalıtımı üstünde XPS", layers: [
      { materialId: "gypsum-plaster", name: "İç sıva", thickness: 15, lambda: 0.35, color: "#f1f5f9" },
      { materialId: "reinforced-concrete", name: "Betonarme döşeme", thickness: 180, lambda: 2.30, color: "#64748b" },
      { materialId: "screed", name: "Eğim şapı", thickness: 50, lambda: 1.40, color: "#a8a29e" },
      { materialId: "waterproofing", name: "Su yalıtım membranı", thickness: 4, lambda: 0.20, color: "#2563eb" },
      { materialId: "xps", name: "XPS", thickness: 120, lambda: 0.034, color: "#a5f3fc" },
      { materialId: "gravel", name: "Çakıl koruma", thickness: 50, lambda: 2, color: "#71717a" },
    ] },
  ],
  Döşeme: [
    { name: "Isıtılmayan hacim üstü", description: "Döşeme altında ısı yalıtımı", layers: templateLayers.Döşeme },
    { name: "Toprağa oturan döşeme", description: "Taşıyıcı, yalıtım ve zemin katmanları", layers: [
      { materialId: "ceramic", name: "Zemin kaplaması", thickness: 10, lambda: 1, color: "#e7e5e4" },
      { materialId: "screed", name: "Şap", thickness: 50, lambda: 1.4, color: "#a8a29e" },
      { materialId: "reinforced-concrete", name: "Betonarme döşeme", thickness: 150, lambda: 2.3, color: "#64748b" },
      { materialId: "xps", name: "Yük taşıyan XPS", thickness: 100, lambda: 0.034, color: "#a5f3fc" },
      { materialId: "waterproofing", name: "Nem kesici membran", thickness: 2, lambda: 0.2, color: "#2563eb" },
      { materialId: "gravel", name: "Granüler dolgu", thickness: 150, lambda: 2, color: "#71717a" },
    ] },
  ],
};

const surfaceResistance: Record<AssemblyType, { rsi: number; rse: number; label: string }> = {
  "Dış Duvar": { rsi: 0.13, rse: 0.04, label: "Yatay ısı akışı" },
  Çatı: { rsi: 0.10, rse: 0.04, label: "Yukarı ısı akışı" },
  Döşeme: { rsi: 0.17, rse: 0.04, label: "Aşağı ısı akışı" },
};

function makeLayers(type: AssemblyType): Layer[] {
  return templateLayers[type].map((layer, index) => ({ ...layer, id: `${type}-${index}-${Date.now()}` }));
}

function number(value: number, digits = 3) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function saturationPressure(temperature: number) {
  return 610.5 * Math.exp((17.2694 * temperature) / (237.3 + temperature));
}

let generatedLayerId = 0;

function nextLayerId() {
  generatedLayerId += 1;
  return `generated-layer-${generatedLayerId}`;
}

export default function ThermalDesigner() {
  const [assemblyType, setAssemblyType] = useState<AssemblyType>("Dış Duvar");
  const [layers, setLayers] = useState<Layer[]>(() => makeLayers("Dış Duvar"));
  const [targetU, setTargetU] = useState(0.30);
  const [area, setArea] = useState(100);
  const [indoorTemperature, setIndoorTemperature] = useState(20);
  const [outdoorTemperature, setOutdoorTemperature] = useState(0);
  const [indoorHumidity, setIndoorHumidity] = useState(50);
  const [outdoorHumidity, setOutdoorHumidity] = useState(80);
  const [thermalBridgePercent, setThermalBridgePercent] = useState(5);
  const [selectedInsulation, setSelectedInsulation] = useState("rock-wool");
  const [projectName, setProjectName] = useState("DIŞ DUVAR KATMAN ANALİZİ");
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [materialQuery, setMaterialQuery] = useState("");
  const [materialCategory, setMaterialCategory] = useState("Tümü");
  const [sectionMode, setSectionMode] = useState<"Orantılı" | "Okunabilir">("Okunabilir");
  const draggedIndex = useRef<number | null>(null);

  const result = useMemo(() => {
    const surfaces = surfaceResistance[assemblyType];
    const layerResults = layers.map((layer) => {
      const resistance = layer.resistanceOverride ?? (layer.thickness / 1000) / Math.max(layer.lambda, 0.001);
      return { ...layer, resistance };
    });
    const layerResistance = layerResults.reduce((sum, layer) => sum + layer.resistance, 0);
    const totalResistance = surfaces.rsi + layerResistance + surfaces.rse;
    const uValue = 1 / Math.max(totalResistance, 0.001);
    const correctedUValue = uValue * (1 + Math.max(0, thermalBridgePercent) / 100);
    const totalThickness = layers.reduce((sum, layer) => sum + layer.thickness, 0);
    const temperatureDifference = Math.abs(indoorTemperature - outdoorTemperature);
    const heatLoss = correctedUValue * area * temperatureDifference;
    const targetResistance = (1 + Math.max(0, thermalBridgePercent) / 100) / Math.max(targetU, 0.01);
    const missingResistance = Math.max(0, targetResistance - totalResistance);
    const insulation = materials.find((material) => material.id === selectedInsulation) ?? materials[8];
    const additionalInsulation = missingResistance * insulation.lambda * 1000;
    const surfaceMass = layers.reduce((sum, layer) => sum + (layer.thickness / 1000) * (materialPhysics[layer.materialId]?.density ?? 1000), 0);
    const totalSd = Math.max(0.001, layers.reduce((sum, layer) => sum + (layer.thickness / 1000) * (materialPhysics[layer.materialId]?.mu ?? 20), 0));
    const indoorVaporPressure = saturationPressure(indoorTemperature) * indoorHumidity / 100;
    const outdoorVaporPressure = saturationPressure(outdoorTemperature) * outdoorHumidity / 100;
    const interfaceChecks = layerResults.map((layer, index) => {
      const completedLayers = layerResults.slice(0, index + 1);
      const cumulativeResistance = surfaces.rsi + completedLayers.reduce((sum, item) => sum + item.resistance, 0);
      const cumulativeSd = completedLayers.reduce((sum, item) => sum + (item.thickness / 1000) * (materialPhysics[item.materialId]?.mu ?? 20), 0);
      const temperature = indoorTemperature - (cumulativeResistance / totalResistance) * (indoorTemperature - outdoorTemperature);
      const vaporPressure = indoorVaporPressure - (cumulativeSd / totalSd) * (indoorVaporPressure - outdoorVaporPressure);
      const saturation = saturationPressure(temperature);
      return { index, afterLayer: layer.name, temperature, vaporPressure, saturation, risk: vaporPressure > saturation };
    });
    const condensationRisk = interfaceChecks.some((item) => item.risk);
    const insulationIndexes = layers.map((layer, index) => materialPhysics[layer.materialId] && materials.find((item) => item.id === layer.materialId)?.category === "Isı Yalıtımı" ? index : -1).filter((index) => index >= 0);
    const structuralIndexes = layers.map((layer, index) => materials.find((item) => item.id === layer.materialId)?.category === "Taşıyıcı" || materials.find((item) => item.id === layer.materialId)?.category === "Duvar" ? index : -1).filter((index) => index >= 0);
    const insulationOutsideStructure = insulationIndexes.length > 0 && structuralIndexes.length > 0 && Math.min(...insulationIndexes) > Math.max(...structuralIndexes);
    return { surfaces, layerResults, layerResistance, totalResistance, uValue, correctedUValue, totalThickness, heatLoss, missingResistance, insulation, additionalInsulation, surfaceMass, interfaceChecks, condensationRisk, insulationOutsideStructure, temperatureDifference };
  }, [area, assemblyType, indoorHumidity, indoorTemperature, layers, outdoorHumidity, outdoorTemperature, selectedInsulation, targetU, thermalBridgePercent]);

  const materialCategories = useMemo(
    () => ["Tümü", ...Array.from(new Set(materials.map((material) => material.category)))],
    []
  );
  const visibleMaterials = useMemo(
    () =>
      materials.filter(
        (material) =>
          (materialCategory === "Tümü" || material.category === materialCategory) &&
          `${material.name} ${material.category}`
            .toLocaleLowerCase("tr-TR")
            .includes(materialQuery.toLocaleLowerCase("tr-TR"))
      ),
    [materialCategory, materialQuery]
  );
  const sectionSegments = useMemo(() => {
    const availableWidth = 820;
    const minimumWidth = sectionMode === "Okunabilir" ? 62 : 24;
    const weights = layers.map((layer) =>
      sectionMode === "Okunabilir"
        ? Math.sqrt(Math.max(layer.thickness, 1))
        : Math.max(layer.thickness, 1)
    );
    const minimumTotal = minimumWidth * layers.length;
    const flexibleWidth = Math.max(0, availableWidth - minimumTotal);
    const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
    return layers.reduce<(Layer & { x: number; width: number; index: number })[]>(
      (segments, layer, index) => {
      const width =
        minimumWidth +
        (weightTotal > 0 ? (weights[index] / weightTotal) * flexibleWidth : 0);
      const x =
        90 + segments.reduce((sum, segment) => sum + segment.width, 0);
      const segment = { ...layer, x, width, index };
      return [...segments, segment];
      },
      []
    );
  }, [layers, sectionMode]);
  const verticalSectionSegments = useMemo(() => {
    const availableHeight = 310;
    const minimumHeight = sectionMode === "Okunabilir" ? 36 : 14;
    const weights = layers.map((layer) =>
      sectionMode === "Okunabilir"
        ? Math.sqrt(Math.max(layer.thickness, 1))
        : Math.max(layer.thickness, 1)
    );
    const minimumTotal = minimumHeight * layers.length;
    const flexibleHeight = Math.max(0, availableHeight - minimumTotal);
    const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
    const heights = layers.map(
      (_, index) =>
        minimumHeight +
        (weightTotal > 0 ? (weights[index] / weightTotal) * flexibleHeight : 0)
    );

    return layers.map((layer, index) => {
      const previousHeight = heights
        .slice(0, index)
        .reduce((sum, height) => sum + height, 0);
      const height = heights[index];
      const y =
        assemblyType === "Çatı"
          ? 410 - previousHeight - height
          : 100 + previousHeight;
      return { ...layer, y, height, index };
    });
  }, [assemblyType, layers, sectionMode]);

  function changeAssembly(type: AssemblyType) {
    setAssemblyType(type);
    setLayers(makeLayers(type));
    setSelectedLayerId(null);
    setProjectName(`${type.toLocaleUpperCase("tr-TR")} KATMAN ANALİZİ`);
  }
  function applyPreset(preset: (typeof assemblyPresets)[AssemblyType][number]) {
    setLayers(preset.layers.map((layer) => ({ ...layer, id: nextLayerId() })));
    setProjectName(`${assemblyType.toLocaleUpperCase("tr-TR")} · ${preset.name.toLocaleUpperCase("tr-TR")}`);
    setSelectedLayerId(null);
  }
  function addLayer(materialId: string) {
    const material = materials.find((item) => item.id === materialId);
    if (!material) return;
    const layer: Layer = {
      id: nextLayerId(),
      materialId: material.id,
      name: material.name,
      thickness: material.id === "air-layer" ? 50 : material.category === "Isı Yalıtımı" ? 80 : 20,
      lambda: material.lambda,
      color: material.color,
      resistanceOverride: material.id === "air-layer" ? 0.18 : undefined,
    };
    setLayers((current) => [...current, layer]);
    setSelectedLayerId(layer.id);
  }
  function updateLayer(id: string, patch: Partial<Layer>) {
    setLayers((current) => current.map((layer) => layer.id === id ? { ...layer, ...patch } : layer));
  }
  function selectMaterial(layerId: string, materialId: string) {
    const material = materials.find((item) => item.id === materialId);
    if (!material) return;
    updateLayer(layerId, {
      materialId,
      name: material.name,
      lambda: material.lambda,
      color: material.color,
      resistanceOverride: material.id === "air-layer" ? 0.18 : undefined,
    });
  }
  function moveLayer(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= layers.length) return;
    setLayers((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  function handleDragEnter(targetIndex: number) {
    const sourceIndex = draggedIndex.current;
    if (sourceIndex === null || sourceIndex === targetIndex) return;
    setLayers((current) => {
      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    draggedIndex.current = targetIndex;
  }
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    draggedIndex.current = null;
    setDraggingLayerId(null);
  }
  function duplicateLayer(layer: Layer) {
    const copy = { ...layer, id: nextLayerId(), name: `${layer.name} kopya` };
    const index = layers.findIndex((item) => item.id === layer.id);
    setLayers((current) => {
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next;
    });
    setSelectedLayerId(copy.id);
  }
  function copySummary() {
    const summary = [
      projectName,
      `Toplam kalınlık: ${number(result.totalThickness, 0)} mm`,
      `Toplam ısıl direnç: ${number(result.totalResistance)} m²K/W`,
      `U-değeri: ${number(result.uValue)} W/m²K`,
      `Isı köprüsü düzeltmeli U: ${number(result.correctedUValue)} W/m²K`,
      `Hedef U: ${number(targetU)} W/m²K`,
      `Yoğuşma taraması: ${result.condensationRisk ? "Risk görüldü" : "Basitleştirilmiş kontrolde risk görülmedi"}`,
      ...result.layerResults.map((layer, index) => `${index + 1}. ${layer.name}: ${layer.thickness} mm, λ ${layer.lambda}, R ${number(layer.resistance)}`),
    ].join("\n");
    navigator.clipboard.writeText(summary);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
      <aside className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="grid grid-cols-3 gap-2">
          {(["Dış Duvar", "Çatı", "Döşeme"] as AssemblyType[]).map((type) => <button key={type} onClick={() => changeAssembly(type)} className={`rounded-xl px-3 py-3 text-sm font-semibold ${assemblyType === type ? "bg-cyan-400 text-slate-950" : "border border-slate-700 bg-slate-950 text-slate-300"}`}>{type}</button>)}
        </div>
        <section>
          <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Hazır kesitler</h2><span className="text-[10px] text-slate-500">Başlangıç şablonu seç</span></div>
          <div className="mt-2 grid gap-2">
            {assemblyPresets[assemblyType].map((preset) => (
              <button key={preset.name} onClick={() => applyPreset(preset)} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-left transition hover:border-cyan-400/60">
                <strong className="block text-xs text-slate-200">{preset.name}</strong>
                <span className="mt-1 block text-[11px] text-slate-500">{preset.description} · {preset.layers.length} katman</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between"><h2 className="font-bold">Malzeme paleti</h2><span className="text-xs text-slate-500">{visibleMaterials.length} malzeme</span></div>
          <div className="mt-3 grid grid-cols-[1fr_120px] gap-2">
            <input value={materialQuery} onChange={(event) => setMaterialQuery(event.target.value)} placeholder="Malzeme ara..." className="min-w-0 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400" />
            <select value={materialCategory} onChange={(event) => setMaterialCategory(event.target.value)} className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-2 text-xs">{materialCategories.map((category) => <option key={category}>{category}</option>)}</select>
          </div>
          <div className="mt-3 flex max-h-32 flex-wrap gap-2 overflow-y-auto">
            {visibleMaterials.map((material) => <button key={material.id} onClick={() => addLayer(material.id)} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-left text-xs transition hover:border-cyan-400"><span className="h-3 w-3 rounded-sm border border-slate-600" style={{ backgroundColor: material.color }} />{material.name}<span className="text-cyan-400">+</span></button>)}
          </div>
        </section>

        <div className="flex items-end justify-between"><div><h2 className="font-bold">Yapı katmanları</h2><p className="mt-1 text-xs text-slate-500">İç ortamdan dış ortama</p></div><span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{layers.length} katman</span></div>

        <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
          {layers.map((layer, index) => (
            <div key={layer.id} onDragEnter={() => handleDragEnter(index)} onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className={`overflow-hidden rounded-2xl border bg-slate-950 transition ${draggingLayerId === layer.id ? "scale-[.98] border-cyan-400 opacity-60" : selectedLayerId === layer.id ? "border-cyan-400/70" : "border-slate-800"}`}>
              <div className="flex items-center gap-2 p-3">
                <button draggable onDragStart={(event) => { draggedIndex.current = index; setDraggingLayerId(layer.id); event.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { draggedIndex.current = null; setDraggingLayerId(null); }} aria-label={`${layer.name} katmanını sürükle`} title="Sürükleyerek sırala" className="flex h-10 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-lg text-slate-500 active:cursor-grabbing">⠿</button>
                <button onClick={() => setSelectedLayerId((current) => current === layer.id ? null : layer.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className="h-10 w-3 shrink-0 rounded-full border border-slate-600" style={{ backgroundColor: layer.color }} />
                  <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{layer.name}</strong><span className="mt-1 block text-xs text-slate-500">{layer.thickness} mm · R {number(result.layerResults[index]?.resistance ?? 0)}</span></span>
                  <span className={`text-xs text-slate-500 transition ${selectedLayerId === layer.id ? "rotate-180" : ""}`}>⌄</span>
                </button>
              </div>

              {selectedLayerId === layer.id && <div className="border-t border-slate-800 bg-slate-900/70 p-4">
                <label className="block text-[11px] text-slate-500">Malzeme<select value={layer.materialId} onChange={(event) => selectMaterial(layer.id, event.target.value)} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-white">{materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}</select></label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="text-[11px] text-slate-500">Kalınlık (mm)<input type="number" min="0.1" step="1" value={layer.thickness} onChange={(event) => updateLayer(layer.id, { thickness: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-white" /></label>
                  <label className="text-[11px] text-slate-500">λ (W/mK)<input type="number" min="0.001" step="0.001" disabled={layer.materialId === "air-layer"} value={layer.lambda} onChange={(event) => updateLayer(layer.id, { lambda: Number(event.target.value), materialId: "custom" })} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-white disabled:opacity-40" /></label>
                </div>
                {layer.materialId === "custom" && <input value={layer.name} onChange={(event) => updateLayer(layer.id, { name: event.target.value })} placeholder="Özel malzeme adı" className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm" />}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs"><button onClick={() => duplicateLayer(layer)} className="text-cyan-300">Katmanı çoğalt</button><button onClick={() => moveLayer(index, -1)} className="text-slate-400">Yukarı taşı</button><button onClick={() => moveLayer(index, 1)} className="text-slate-400">Aşağı taşı</button><button onClick={() => { setLayers((current) => current.filter((item) => item.id !== layer.id)); setSelectedLayerId(null); }} className="ml-auto text-rose-300">Sil</button></div>
              </div>}
            </div>
          ))}
        </div>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs text-slate-400">Hedef U (W/m²K)<input type="number" min="0.05" step="0.01" value={targetU} onChange={(event) => setTargetU(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>
          <label className="text-xs text-slate-400">Yüzey alanı (m²)<input type="number" min="1" value={area} onChange={(event) => setArea(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>
          <label className="text-xs text-slate-400">Ek yalıtım malzemesi<select value={selectedInsulation} onChange={(event) => setSelectedInsulation(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white">{materials.filter((material) => material.category === "Isı Yalıtımı").map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}</select></label>
          <label className="text-xs text-slate-400">İç ortam (°C / %RH)<span className="mt-2 grid grid-cols-2 gap-2"><input type="number" value={indoorTemperature} onChange={(event) => setIndoorTemperature(Number(event.target.value))} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /><input type="number" min="1" max="100" value={indoorHumidity} onChange={(event) => setIndoorHumidity(Number(event.target.value))} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></span></label>
          <label className="text-xs text-slate-400">Dış ortam (°C / %RH)<span className="mt-2 grid grid-cols-2 gap-2"><input type="number" value={outdoorTemperature} onChange={(event) => setOutdoorTemperature(Number(event.target.value))} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /><input type="number" min="1" max="100" value={outdoorHumidity} onChange={(event) => setOutdoorHumidity(Number(event.target.value))} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></span></label>
          <label className="text-xs text-slate-400">Isı köprüsü düzeltmesi (%)<input type="number" min="0" max="50" step="1" value={thermalBridgePercent} onChange={(event) => setThermalBridgePercent(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" /></label>
        </div>

        <section className={`rounded-3xl border p-6 ${result.correctedUValue <= targetU ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/5"}`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Isı köprüsü düzeltmeli U-değeri</p><p className="mt-2 text-5xl font-black">{number(result.correctedUValue)} <span className="text-lg font-medium">W/m²K</span></p><p className="mt-2 text-xs text-slate-500">Katman hesabı: {number(result.uValue)} W/m²K · Düzeltme: %{thermalBridgePercent}</p></div><div className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${result.correctedUValue <= targetU ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-100"}`}>{result.correctedUValue <= targetU ? "Girilen hedef sağlanıyor" : "Girilen hedef sağlanmıyor"}</div></div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${result.correctedUValue <= targetU ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${Math.min(100, targetU / result.correctedUValue * 100)}%` }} /></div>
          {result.correctedUValue > targetU && <p className="mt-4 text-sm leading-6 text-amber-100">Aynı katmanlar korunursa hedefe yaklaşmak için teorik olarak yaklaşık <strong>{Math.ceil(result.additionalInsulation)} mm ek {result.insulation.name}</strong> gerekir. Uygulama kalınlığını üretici değeri, ısı köprüleri, nem ve yangın kararlarıyla doğrula.</p>}
        </section>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["Toplam kalınlık", `${number(result.totalThickness, 0)} mm`], ["Yüzey kütlesi", `${number(result.surfaceMass, 0)} kg/m²`], ["Sıcaklık farkı", `${number(result.temperatureDifference, 0)} °C`], ["İletim ısı kaybı", `${number(result.heatLoss, 0)} W`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-cyan-300">{value}</p></div>)}
        </div>

        <section className="grid gap-3 md:grid-cols-3">
          <div className={`rounded-2xl border p-4 ${result.condensationRisk ? "border-rose-400/30 bg-rose-400/5" : "border-emerald-400/25 bg-emerald-400/5"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Yoğuşma taraması</p>
            <p className={`mt-2 font-bold ${result.condensationRisk ? "text-rose-200" : "text-emerald-200"}`}>{result.condensationRisk ? "Ara yüzey riski görüldü" : "Belirgin risk görülmedi"}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">Girilen sıcaklık ve bağıl nem değerleriyle basitleştirilmiş Glaser kontrolü.</p>
          </div>
          <div className={`rounded-2xl border p-4 ${result.insulationOutsideStructure ? "border-emerald-400/25 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/5"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Yalıtım konumu</p>
            <p className={`mt-2 font-bold ${result.insulationOutsideStructure ? "text-emerald-200" : "text-amber-100"}`}>{result.insulationOutsideStructure ? "Taşıyıcının dış tarafında" : "Katman sırasını incele"}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">Kesintisiz dış yalıtım, taşıyıcı kenarlarındaki ısı köprülerini azaltmaya yardımcı olur.</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tasarım kararı</p>
            <p className="mt-2 font-bold text-cyan-200">{result.correctedUValue <= targetU && !result.condensationRisk ? "Ön değerlendirme olumlu" : "Revizyon öneriliyor"}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">{result.correctedUValue > targetU ? `${Math.ceil(result.additionalInsulation)} mm civarı ek ${result.insulation.name} değerlendir.` : result.condensationRisk ? "Buhar kontrol katmanı ve katman sırasını uzmanla doğrula." : "Ürün beyanları ve birleşim detaylarıyla doğrulamaya geç."}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Teknik katman kesiti</p><input value={projectName} onChange={(event) => setProjectName(event.target.value)} className="mt-2 w-full bg-transparent text-xl font-bold outline-none" /></div>
            <div className="inline-flex w-fit rounded-xl border border-slate-700 bg-slate-950 p-1">{(["Okunabilir", "Orantılı"] as const).map((mode) => <button key={mode} onClick={() => setSectionMode(mode)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${sectionMode === mode ? "bg-cyan-400 text-slate-950" : "text-slate-400"}`}>{mode}</button>)}</div>
          </div>
          <div className="overflow-x-auto bg-slate-100 p-3 sm:p-5">
            <svg viewBox={assemblyType === "Dış Duvar" ? "0 0 1000 430" : "0 0 1000 540"} className="min-w-[760px]" role="img" aria-label={`${assemblyType} teknik katman kesiti`}>
              <defs>
                <pattern id="insulation-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#fef3c7" /><line x1="0" y1="0" x2="0" y2="14" stroke="#b45309" strokeWidth="3" opacity=".55" /></pattern>
                <pattern id="masonry-hatch" width="22" height="14" patternUnits="userSpaceOnUse"><rect width="22" height="14" fill="#fed7aa" /><path d="M0 0H22M0 7H22M11 0V7M5 7V14" stroke="#9a3412" strokeWidth="1" opacity=".6" /></pattern>
                <pattern id="concrete-hatch" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#cbd5e1" /><circle cx="4" cy="5" r="1.8" fill="#64748b" /><circle cx="14" cy="12" r="2.3" fill="#94a3b8" /></pattern>
                <pattern id="air-hatch" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#eff6ff" /><path d="M0 14L14 0M8 16L16 8" stroke="#60a5fa" strokeWidth="1" opacity=".45" /></pattern>
                <marker id="arrow-end" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#0891b2" /></marker>
                <marker id="dimension-arrow-start" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto"><path d="M8,0 L0,4 L8,8" fill="none" stroke="#334155" strokeWidth="1.2" /></marker>
                <marker id="dimension-arrow-end" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#334155" strokeWidth="1.2" /></marker>
              </defs>

              {assemblyType === "Dış Duvar" ? <>
              <text x="35" y="185" transform="rotate(-90 35 185)" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">İÇ ORTAM</text>
              <text x="965" y="185" transform="rotate(90 965 185)" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">DIŞ ORTAM</text>
              <line x1="120" y1="34" x2="880" y2="34" stroke="#0891b2" strokeWidth="3" markerEnd="url(#arrow-end)" />
              <text x="500" y="25" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0e7490">ISI AKIŞ YÖNÜ · U = {number(result.uValue)} W/m²K</text>

              {sectionSegments.map((segment) => {
                const material = materials.find((item) => item.id === segment.materialId);
                const fill = material?.category === "Isı Yalıtımı" ? "url(#insulation-hatch)" : material?.category === "Duvar" ? "url(#masonry-hatch)" : material?.category === "Taşıyıcı" ? "url(#concrete-hatch)" : segment.materialId === "air-layer" ? "url(#air-hatch)" : segment.color;
                const center = segment.x + segment.width / 2;
                const labelY = segment.index % 2 === 0 ? 62 : 88;
                return <g key={segment.id}>
                  <rect x={segment.x} y="120" width={segment.width} height="190" fill={fill} stroke="#334155" strokeWidth="1.5" />
                  <line x1={center} y1={labelY + 8} x2={center} y2="116" stroke="#64748b" strokeWidth="1" />
                  <circle cx={center} cy="116" r="2.5" fill="#334155" />
                  <text x={center} y={labelY} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">{segment.name.length > 20 ? `${segment.name.slice(0, 19)}…` : segment.name}</text>
                  <text x={center} y={labelY + 14} textAnchor="middle" fontSize="10" fill="#475569">λ {number(segment.lambda)} · R {number(result.layerResults[segment.index]?.resistance ?? 0)}</text>
                  <line x1={segment.x + 3} y1="337" x2={segment.x + segment.width - 3} y2="337" stroke="#334155" strokeWidth="1" markerStart="url(#dimension-arrow-start)" markerEnd="url(#dimension-arrow-end)" />
                  <line x1={segment.x} y1="310" x2={segment.x} y2="346" stroke="#64748b" strokeWidth="1" />
                  <line x1={segment.x + segment.width} y1="310" x2={segment.x + segment.width} y2="346" stroke="#64748b" strokeWidth="1" />
                  <text x={center} y="359" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">{segment.thickness} mm</text>
                  <text x={center} y="290" transform={`rotate(-90 ${center} 290)`} textAnchor="start" fontSize="10" fontWeight="600" fill="#334155">{segment.name}</text>
                </g>;
              })}

              <line x1="90" y1="392" x2="910" y2="392" stroke="#0f172a" strokeWidth="1.5" markerStart="url(#dimension-arrow-start)" markerEnd="url(#dimension-arrow-end)" />
              <line x1="90" y1="310" x2="90" y2="401" stroke="#64748b" />
              <line x1="910" y1="310" x2="910" y2="401" stroke="#64748b" />
              <rect x="415" y="377" width="170" height="28" rx="5" fill="#f8fafc" />
              <text x="500" y="396" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">TOPLAM {number(result.totalThickness, 0)} mm</text>
              <text x="90" y="422" fontSize="10" fill="#64748b">{sectionMode === "Orantılı" ? "Katman genişlikleri kalınlık oranına göredir." : "Okunabilir görünüm: ince katmanlar gösterim için büyütülmüştür."}</text>
              </> : <>
                <text x="470" y="35" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">
                  {assemblyType === "Çatı" ? "DIŞ ORTAM / ÜST" : "İÇ ORTAM / ÜST"}
                </text>
                <text x="470" y="500" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">
                  {assemblyType === "Çatı" ? "İÇ ORTAM / ALT" : "DIŞ ORTAM / ALT"}
                </text>
                <line
                  x1="110"
                  y1={assemblyType === "Çatı" ? "430" : "80"}
                  x2="110"
                  y2={assemblyType === "Çatı" ? "75" : "435"}
                  stroke="#0891b2"
                  strokeWidth="3"
                  markerEnd="url(#arrow-end)"
                />
                <text x="82" y="255" transform="rotate(-90 82 255)" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0e7490">
                  ISI AKIŞ YÖNÜ · U = {number(result.uValue)} W/m²K
                </text>

                {verticalSectionSegments.map((segment) => {
                  const material = materials.find((item) => item.id === segment.materialId);
                  const fill = material?.category === "Isı Yalıtımı" ? "url(#insulation-hatch)" : material?.category === "Duvar" ? "url(#masonry-hatch)" : material?.category === "Taşıyıcı" ? "url(#concrete-hatch)" : segment.materialId === "air-layer" ? "url(#air-hatch)" : segment.color;
                  const centerY = segment.y + segment.height / 2;
                  const labelX = segment.index % 2 === 0 ? 765 : 875;
                  return <g key={segment.id}>
                    <rect x="220" y={segment.y} width="500" height={segment.height} fill={fill} stroke="#334155" strokeWidth="1.5" />
                    <line x1="720" y1={centerY} x2={labelX - 12} y2={centerY} stroke="#64748b" strokeWidth="1" />
                    <circle cx="720" cy={centerY} r="2.5" fill="#334155" />
                    <text x={labelX} y={centerY - 5} fontSize="11" fontWeight="700" fill="#0f172a">{segment.name}</text>
                    <text x={labelX} y={centerY + 10} fontSize="10" fill="#475569">λ {number(segment.lambda)} · R {number(result.layerResults[segment.index]?.resistance ?? 0)}</text>
                    <line x1="185" y1={segment.y + 3} x2="185" y2={segment.y + segment.height - 3} stroke="#334155" strokeWidth="1" markerStart="url(#dimension-arrow-start)" markerEnd="url(#dimension-arrow-end)" />
                    <line x1="180" y1={segment.y} x2="220" y2={segment.y} stroke="#64748b" strokeWidth="1" />
                    <line x1="180" y1={segment.y + segment.height} x2="220" y2={segment.y + segment.height} stroke="#64748b" strokeWidth="1" />
                    <text x="172" y={centerY + 4} textAnchor="end" fontSize="10" fontWeight="700" fill="#0f172a">{segment.thickness} mm</text>
                    {segment.height >= 28 && <text x="470" y={centerY + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">{segment.name}</text>}
                  </g>;
                })}

                <line x1="150" y1="100" x2="150" y2="410" stroke="#0f172a" strokeWidth="1.5" markerStart="url(#dimension-arrow-start)" markerEnd="url(#dimension-arrow-end)" />
                <line x1="145" y1="100" x2="220" y2="100" stroke="#64748b" />
                <line x1="145" y1="410" x2="220" y2="410" stroke="#64748b" />
                <rect x="118" y="225" width="64" height="60" rx="5" fill="#f8fafc" />
                <text x="150" y="249" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">TOPLAM</text>
                <text x="150" y="268" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">{number(result.totalThickness, 0)} mm</text>
                <text x="220" y="526" fontSize="10" fill="#64748b">{sectionMode === "Orantılı" ? "Katman yükseklikleri kalınlık oranına göredir." : "Okunabilir görünüm: ince katmanlar gösterim için büyütülmüştür."}</text>
              </>}
            </svg>
          </div>
          <div className="grid gap-3 border-t border-slate-800 p-5 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4 text-sm"><span className="text-slate-500">İç yüzey direnci</span><strong className="float-right text-cyan-300">Rsi {result.surfaces.rsi}</strong></div>
            <div className="rounded-xl bg-slate-950 p-4 text-sm"><span className="text-slate-500">Katmanlar</span><strong className="float-right text-cyan-300">{layers.length} adet</strong></div>
            <div className="rounded-xl bg-slate-950 p-4 text-sm"><span className="text-slate-500">Dış yüzey direnci</span><strong className="float-right text-cyan-300">Rse {result.surfaces.rse}</strong></div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5"><h2 className="text-xl font-bold">Sıcaklık ve yoğuşma profili</h2><p className="mt-1 text-sm text-slate-500">Her katmandan sonraki yaklaşık ara yüzey koşulu</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-950 text-slate-500"><tr><th className="p-4">Ara yüzey</th><th className="p-4">Sıcaklık</th><th className="p-4">Buhar basıncı</th><th className="p-4">Doyma basıncı</th><th className="p-4">Durum</th></tr></thead><tbody>{result.interfaceChecks.map((item) => <tr key={`${item.index}-${item.afterLayer}`} className="border-t border-slate-800"><td className="p-4">{item.afterLayer} sonrası</td><td className="p-4 font-mono">{number(item.temperature, 1)} °C</td><td className="p-4">{number(item.vaporPressure, 0)} Pa</td><td className="p-4">{number(item.saturation, 0)} Pa</td><td className={`p-4 font-semibold ${item.risk ? "text-rose-300" : "text-emerald-300"}`}>{item.risk ? "Yoğuşma riski" : "Uygun"}</td></tr>)}</tbody></table></div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5"><h2 className="text-xl font-bold">Hesap dökümü</h2><p className="mt-1 text-sm text-slate-500">R = d / λ · U = 1 / R toplam</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-950 text-slate-500"><tr><th className="p-4">#</th><th className="p-4">Katman</th><th className="p-4">d</th><th className="p-4">λ</th><th className="p-4">R</th><th className="p-4">Toplam R payı</th></tr></thead><tbody>{result.layerResults.map((layer, index) => <tr key={layer.id} className="border-t border-slate-800"><td className="p-4 font-mono text-cyan-400">{index + 1}</td><td className="p-4 font-semibold">{layer.name}</td><td className="p-4">{layer.thickness} mm</td><td className="p-4">{layer.materialId === "air-layer" ? "Sabit R" : number(layer.lambda)}</td><td className="p-4 font-mono text-cyan-300">{number(layer.resistance)}</td><td className="p-4">%{number(layer.resistance / result.totalResistance * 100, 1)}</td></tr>)}</tbody><tfoot className="border-t border-slate-700 bg-slate-950"><tr><td className="p-4" colSpan={4}>Yüzey dirençleri: Rsi {result.surfaces.rsi} + Rse {result.surfaces.rse} ({result.surfaces.label})</td><td className="p-4 font-bold text-cyan-300">{number(result.totalResistance)}</td><td /></tr></tfoot></table></div>
        </section>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-6 text-amber-100"><strong>Teknik sınır:</strong> Hazır λ, μ ve yoğunluk değerleri yaklaşık başlangıç değerleridir; gerçek hesapta ürün beyanlarını kullan. Yoğuşma bölümü basitleştirilmiş durağan Glaser taramasıdır; hava sızıntısı, yağmur, kuruma, metal tespitler, iki boyutlu ısı köprüleri ve dinamik iklim etkilerini kapsamaz. Toprağa temas eden döşemelerde ayrıca ilgili zemin hesabı gerekir. TS 825 raporu veya ruhsat uygunluğu yerine geçmez.</div>
        <div className="flex flex-wrap gap-3"><button onClick={copySummary} className="rounded-xl border border-slate-700 px-5 py-3 text-sm hover:border-cyan-400">Özeti kopyala</button><button onClick={() => window.print()} className="rounded-xl border border-cyan-400/60 px-5 py-3 text-sm font-semibold text-cyan-300">Raporu yazdır / PDF kaydet</button></div>
      </section>
    </div>
  );
}
