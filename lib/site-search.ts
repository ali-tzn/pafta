export type SearchableItem = {
  title: string;
  href: string;
  description?: string;
  keywords?: readonly string[];
};

const synonymGroups = [
  ["emsal", "kaks", "taks", "imar", "insaat alani", "yapilasma"],
  ["olcek", "skala", "oran", "pafta olcegi"],
  ["ortalama", "gno", "gpa", "not ortalamasi"],
  ["pdf kucult", "pdf sıkıstır", "dosya boyutu", "mb azalt", "compress"],
  ["pdf birlestir", "pdf ekle", "merge", "dosyalari birlestir"],
  ["resme cevir", "png yap", "jpg yap", "pdf png", "gorsele donustur"],
  ["merdiven", "riht", "basamak"],
  ["rampa", "egim", "kot farki"],
  ["metraj", "malzeme hesabi", "beton", "tugla", "boya", "seramik"],
  ["render ai", "yapay zeka", "ai arac", "gorsellestirme"],
  ["vaziyet", "parsel", "yapi oturumu", "cekme mesafesi"],
  ["teslim", "juri", "pafta kontrol", "okunabilirlik"],
] as const;

export function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function expandSearchQuery(query: string) {
  const normalized = normalizeSearchText(query);
  const expanded = new Set([normalized]);

  for (const group of synonymGroups) {
    if (group.some((term) => normalized.includes(normalizeSearchText(term)))) {
      group.forEach((term) => expanded.add(normalizeSearchText(term)));
    }
  }

  return Array.from(expanded);
}

export function scoreSearchItem(item: SearchableItem, query: string) {
  const queries = expandSearchQuery(query);
  const title = normalizeSearchText(item.title);
  const description = normalizeSearchText(item.description ?? "");
  const keywords = normalizeSearchText((item.keywords ?? []).join(" "));
  const searchable = `${title} ${keywords} ${description}`;
  let bestScore = 0;

  for (const expandedQuery of queries) {
    if (!expandedQuery) continue;
    let score = 0;

    if (title === expandedQuery) score += 140;
    else if (title.startsWith(expandedQuery)) score += 110;
    else if (title.includes(expandedQuery)) score += 85;

    if (keywords.includes(expandedQuery)) score += 55;
    if (description.includes(expandedQuery)) score += 25;

    const queryTokens = expandedQuery.split(" ").filter(Boolean);
    const itemTokens = searchable.split(" ").filter(Boolean);

    for (const token of queryTokens) {
      if (itemTokens.includes(token)) {
        score += 22;
        continue;
      }

      if (
        token.length >= 4 &&
        itemTokens.some(
          (itemToken) =>
            Math.abs(itemToken.length - token.length) <= 2 &&
            editDistance(itemToken, token) <= (token.length >= 7 ? 2 : 1)
        )
      ) {
        score += 12;
      }
    }

    bestScore = Math.max(bestScore, score);
  }

  return bestScore;
}

export function getSearchCategory(href: string) {
  if (href.startsWith("/pdf-tools")) return "PDF";
  if (href.startsWith("/tools")) return "Hesap";
  if (href.startsWith("/proje-araclari")) return "Tasarım";
  if (href.startsWith("/teslim-araclari")) return "Teslim";
  if (href.startsWith("/student-tools")) return "Öğrenci";
  if (href.startsWith("/mimarlik-yapay-zeka")) return "Yapay Zekâ";
  if (href.startsWith("/yapi-malzemeleri")) return "Malzeme";
  if (href.startsWith("/mimari-detaylar")) return "Detay";
  if (href.startsWith("/revit")) return "Revit";
  if (href.startsWith("/autocad")) return "AutoCAD";
  if (href.startsWith("/sketchup")) return "SketchUp";
  if (href.startsWith("/rhino")) return "Rhino";
  if (href.startsWith("/grasshopper")) return "Grasshopper";
  if (href.startsWith("/photoshop")) return "Photoshop";
  if (href.startsWith("/d5-render")) return "D5 Render";
  if (href.startsWith("/dialux-evo")) return "DIALux evo";
  if (href.startsWith("/blender")) return "Blender";
  if (href.startsWith("/bim")) return "BIM";
  if (href.startsWith("/mimarlik")) return "Mimarlık";
  if (href.startsWith("/rehberler")) return "Rehber";
  if (href.startsWith("/resources") || href.startsWith("/kutuphaneler")) return "Kaynak";
  return "PAFTA";
}

function editDistance(first: string, second: string) {
  const previous = Array.from({ length: second.length + 1 }, (_, index) => index);

  for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
    const current = [firstIndex];
    for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
      current[secondIndex] = Math.min(
        current[secondIndex - 1] + 1,
        previous[secondIndex] + 1,
        previous[secondIndex - 1] +
          (first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[second.length];
}
