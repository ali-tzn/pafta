import type { ArchitecturalDetail } from "./details";

const line = "#243447";
const secondary = "#64748b";
const accent = "#0284c7";
const insulation = "#d97706";
const membrane = "#2563eb";

export default function DetailDiagram({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex flex-col justify-between gap-2 border-b border-slate-800 p-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400">
            Şematik uygulama kesiti
          </p>
          <h2 className="mt-1 text-xl font-bold">Birleşim ve katman sürekliliği</h2>
        </div>
        <span className="text-xs text-slate-500">Önerilen çizim ölçeği {detail.scale}</span>
      </div>

      <div className="overflow-x-auto bg-[#eef1f3]">
        <svg
          viewBox="0 0 1120 620"
          className="min-w-[900px]"
          role="img"
          aria-label={`${detail.title} şematik teknik kesiti`}
        >
          <TechnicalDefs slug={detail.slug} />
          <rect width="1120" height="620" fill="#eef1f3" />
          <path d="M36 58H1084" stroke="#c2cbd3" />
          <text x="38" y="38" fontSize="12" fontWeight="800" fill={line} letterSpacing="1.5">
            PAFTA / {detail.category.toLocaleUpperCase("tr-TR")} / ŞEMATİK DETAY
          </text>
          <text x="1082" y="38" textAnchor="end" fontSize="11" fill={secondary}>
            {detail.scale}
          </text>

          <g transform="translate(28 72)">
            <DetailGeometry detail={detail} />
          </g>

          <g transform="translate(735 82)">
            <rect width="350" height="452" rx="12" fill="#f8fafc" stroke="#b8c3cc" />
            <text x="22" y="30" fontSize="10" fontWeight="800" fill={accent} letterSpacing="1.4">
              KATMAN / ELEMAN LEJANTI
            </text>
            <path d="M22 43H328" stroke="#d5dde3" />
            {detail.layers.map((layer, index) => (
              <g key={layer} transform={`translate(22 ${62 + index * 47})`}>
                <circle cx="13" cy="13" r="12" fill={index === 0 ? accent : "#e5e9ed"} stroke={index === 0 ? accent : "#aab6c0"} />
                <text x="13" y="17" textAnchor="middle" fontSize="10" fontWeight="800" fill={index === 0 ? "white" : line}>
                  {index + 1}
                </text>
                <text x="38" y="11" fontSize="11.5" fontWeight="700" fill={line}>
                  {layer}
                </text>
                <text x="38" y="27" fontSize="9.5" fill={secondary}>
                  {layerHint(layer)}
                </text>
              </g>
            ))}
          </g>

          <g transform="translate(38 552)">
            <rect width="1044" height="42" rx="8" fill="#e0f2fe" stroke="#7dd3fc" />
            <circle cx="23" cy="21" r="10" fill={accent} />
            <text x="23" y="25" textAnchor="middle" fontSize="11" fontWeight="900" fill="white">!</text>
            <text x="43" y="18" fontSize="10" fontWeight="800" fill="#075985">OKUMA NOTU</text>
            <text x="43" y="32" fontSize="10" fill="#334155">
              Bu şema katmanların birleşim ve süreklilik mantığını anlatır; ölçülü ürün detayı ve uygulama projesi değildir.
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}

function TechnicalDefs({ slug }: { slug: string }) {
  return (
    <defs>
      <pattern id={`concrete-${slug}`} width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="#d8dde1" />
        <circle cx="5" cy="7" r="1.4" fill="#7b8791" />
        <circle cx="17" cy="16" r="1.1" fill="#7b8791" />
        <path d="M9 20l4-3M18 5l3 2" stroke="#9aa5ae" />
      </pattern>
      <pattern id={`earth-${slug}`} width="18" height="14" patternUnits="userSpaceOnUse">
        <rect width="18" height="14" fill="#e7dfd1" />
        <path d="M0 11Q5 6 10 11T20 11" fill="none" stroke="#9a8466" strokeWidth="1" />
      </pattern>
      <pattern id={`insulation-${slug}`} width="18" height="18" patternUnits="userSpaceOnUse">
        <rect width="18" height="18" fill="#fff7df" />
        <path d="M0 9Q4 1 9 9T18 9" fill="none" stroke={insulation} strokeWidth="1.5" />
      </pattern>
      <pattern id={`hatch-${slug}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0V10" stroke="#94a3b8" strokeWidth="1" />
      </pattern>
      <marker id={`arrow-${slug}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0 0L8 4L0 8" fill="none" stroke={accent} strokeWidth="1.4" />
      </marker>
    </defs>
  );
}

function DetailGeometry({ detail }: { detail: ArchitecturalDetail }) {
  if (detail.slug === "teras-cati-suzgec") return <RoofDrain detail={detail} />;
  if (detail.slug === "yesil-cati-parapet") return <GreenRoof detail={detail} />;
  if (detail.category === "Çatı") return <ParapetRoof detail={detail} />;
  if (detail.category === "Zemin ve Temel") return <Foundation detail={detail} />;
  if (detail.category === "Islak Hacim") return <WetRoom detail={detail} />;
  if (detail.slug === "pencere-denizlik-damlalik") return <WindowDetail detail={detail} />;
  if (detail.slug === "balkon-doseme-isi-koprusu") return <BalconyDetail detail={detail} />;
  if (detail.slug === "giydirme-cephe-doseme-kenari") return <CurtainWall detail={detail} />;
  if (detail.slug === "dilatasyon-duvar-doseme") return <ExpansionJoint detail={detail} />;
  if (detail.category === "İç Mekân") return <InteriorPartition detail={detail} />;
  return <FacadeWall detail={detail} />;
}

function FacadeWall({ detail }: { detail: ArchitecturalDetail }) {
  const ventilated = detail.slug.includes("havalandirmali");
  return (
    <g>
      <ZoneLabels left="İÇ" right="DIŞ" />
      <rect x="150" y="90" width="210" height="330" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <rect x="360" y="90" width="66" height="330" fill={`url(#insulation-${detail.slug})`} stroke={insulation} />
      <path d="M426 90V420" stroke={membrane} strokeWidth="4" />
      {ventilated ? (
        <>
          <rect x="430" y="90" width="70" height="330" fill="#f8fafc" stroke="#94a3b8" strokeDasharray="6 5" />
          <path d="M465 390V125" stroke={accent} strokeWidth="2.5" markerEnd={`url(#arrow-${detail.slug})`} />
          <path d="M500 135H535M500 375H535" stroke={line} strokeWidth="4" />
          <rect x="535" y="78" width="42" height="354" fill="#aeb8c0" stroke={line} strokeWidth="2" />
          <text x="468" y="448" textAnchor="middle" fontSize="10" fill={secondary}>HAVALANDIRMA BOŞLUĞU</text>
        </>
      ) : (
        <>
          <rect x="430" y="90" width="22" height="330" fill={`url(#hatch-${detail.slug})`} stroke={line} />
          <path d="M452 90V420" stroke={line} strokeWidth="5" />
        </>
      )}
      <Callout n={1} x={255} y={178} tx={70} ty={150} />
      <Callout n={2} x={394} y={250} tx={70} ty={250} />
      <Callout n={3} x={ventilated ? 554 : 448} y={340} tx={70} ty={350} />
      <Dimension x1={150} x2={ventilated ? 577 : 452} y={470} label="İÇ → DIŞ KATMAN SIRASI" />
    </g>
  );
}

function ParapetRoof({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <ZoneLabels left="YAPI İÇİ" right="DIŞ ORTAM" />
      <path d="M135 80H275V355H650V465H135Z" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <path d="M278 337H650V355H278Z" fill="#d6dce1" stroke={line} />
      <path d="M278 300H650V337H278Z" fill={`url(#insulation-${detail.slug})`} stroke={insulation} />
      <path d="M260 124V298H650" fill="none" stroke={membrane} strokeWidth="5" />
      <path d="M280 286H650" stroke="#94a3b8" strokeWidth="9" />
      <path d="M115 72H292L282 96H125Z" fill="#aab4bc" stroke={line} strokeWidth="2" />
      <path d="M125 96V108M282 96V108" stroke={line} strokeWidth="2" />
      <path d="M535 286L645 276" stroke={accent} strokeWidth="2" markerEnd={`url(#arrow-${detail.slug})`} />
      <Callout n={1} x={260} y={210} tx={62} ty={178} />
      <Callout n={2} x={450} y={317} tx={62} ty={285} />
      <Callout n={3} x={610} y={286} tx={62} ty={390} />
      <text x="420" y="505" fontSize="10" fill={secondary}>SU YALITIMI PARAPETE KESİNTİSİZ DÖNER</text>
    </g>
  );
}

function RoofDrain({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <ZoneLabels left="YÜKSEK KOT" right="YÜKSEK KOT" />
      <path d="M95 340L342 380L620 340V455H95Z" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <path d="M95 290L342 338L620 290" fill="none" stroke={`url(#insulation-${detail.slug})`} strokeWidth="34" />
      <path d="M95 270L342 318L620 270" fill="none" stroke={membrane} strokeWidth="5" />
      <path d="M316 305H370V358H358V486H328V358H316Z" fill="#aeb8c0" stroke={line} strokeWidth="2" />
      <path d="M300 292H386M308 303H378" stroke={line} strokeWidth="3" />
      <path d="M175 286L320 313M540 286L380 313" stroke={accent} strokeWidth="2" markerEnd={`url(#arrow-${detail.slug})`} />
      <Callout n={1} x={342} y={315} tx={65} ty={170} />
      <Callout n={2} x={355} y={410} tx={65} ty={270} />
      <Callout n={3} x={535} y={275} tx={65} ty={370} />
      <text x="357" y="520" textAnchor="middle" fontSize="10" fill={secondary}>ANA SÜZGEÇ + GÖRÜNÜR ACİL TAŞMA</text>
    </g>
  );
}

function GreenRoof({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <path d="M110 80H230V390H650V470H110Z" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <path d="M232 332H650V390H232Z" fill={`url(#insulation-${detail.slug})`} stroke={insulation} />
      <path d="M220 140V330H650" fill="none" stroke={membrane} strokeWidth="5" />
      <rect x="285" y="260" width="365" height="70" fill={`url(#earth-${detail.slug})`} stroke="#8b7355" />
      <path d="M285 250H650M285 238H650" stroke="#4c9b66" strokeWidth="4" />
      {[340, 430, 520, 610].map((x) => <path key={x} d={`M${x} 260Q${x - 18} 220 ${x} 190Q${x + 18} 220 ${x} 260`} fill="none" stroke="#3f8b57" strokeWidth="4" />)}
      <rect x="235" y="255" width="50" height="75" fill="#dce3e7" stroke={line} strokeDasharray="5 4" />
      <Callout n={1} x={420} y={270} tx={60} ty={170} />
      <Callout n={2} x={220} y={230} tx={60} ty={270} />
      <Callout n={3} x={260} y={285} tx={60} ty={370} />
      <text x="442" y="500" textAnchor="middle" fontSize="10" fill={secondary}>ÇAKIL BAKIM BANDI / KÖK BARİYERİ / DRENAJ</text>
    </g>
  );
}

function Foundation({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <rect x="90" y="70" width="560" height="400" fill={`url(#earth-${detail.slug})`} opacity=".65" />
      <path d="M225 70H365V365H610V455H140V365H225Z" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <path d="M213 92V352H150" fill="none" stroke={membrane} strokeWidth="5" />
      <rect x="180" y="92" width="32" height="258" fill={`url(#insulation-${detail.slug})`} stroke={insulation} />
      <path d="M365 320H610V365" fill="none" stroke={membrane} strokeWidth="5" />
      <circle cx="165" cy="336" r="19" fill="#d9f0fa" stroke={accent} strokeWidth="4" />
      <path d="M146 336H110" stroke={accent} strokeWidth="3" markerEnd={`url(#arrow-${detail.slug})`} />
      <Callout n={1} x={213} y={205} tx={50} ty={145} />
      <Callout n={2} x={165} y={336} tx={50} ty={260} />
      <Callout n={3} x={430} y={350} tx={50} ty={380} />
      <text x="385" y="505" textAnchor="middle" fontSize="10" fill={secondary}>YATAY + DÜŞEY SU VE ISI YALITIMI SÜREKLİLİĞİ</text>
    </g>
  );
}

function WetRoom({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <path d="M120 70H235V372H650V455H120Z" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <path d="M235 315L445 350L650 315V372H235Z" fill={`url(#hatch-${detail.slug})`} stroke={line} />
      <path d="M218 105V298Q218 316 236 316L430 348" fill="none" stroke={membrane} strokeWidth="6" />
      <path d="M430 348H470V370H460V488H440V370H430Z" fill="#aeb8c0" stroke={line} strokeWidth="2" />
      <path d="M250 295L424 338" stroke={accent} strokeWidth="2" markerEnd={`url(#arrow-${detail.slug})`} />
      <rect x="235" y="282" width="24" height="33" fill="#dce3e7" stroke={line} />
      <Callout n={1} x={220} y={275} tx={55} ty={155} />
      <Callout n={2} x={448} y={350} tx={55} ty={260} />
      <Callout n={3} x={330} y={315} tx={55} ty={370} />
      <text x="405" y="515" textAnchor="middle" fontSize="10" fill={secondary}>KÖŞE BANDI / EĞİM / FLANŞLI SÜZGEÇ BAĞLANTISI</text>
    </g>
  );
}

function WindowDetail({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <ZoneLabels left="İÇ" right="DIŞ" />
      <rect x="120" y="80" width="230" height="360" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <rect x="350" y="80" width="55" height="360" fill={`url(#insulation-${detail.slug})`} stroke={insulation} />
      <rect x="278" y="165" width="185" height="170" fill="#edf8fc" stroke="#0369a1" strokeWidth="8" />
      <path d="M300 165V335M440 165V335" stroke="#7dd3fc" strokeWidth="3" />
      <path d="M270 345L520 365L545 350" fill="#cbd3d9" stroke={line} strokeWidth="5" />
      <path d="M520 365V380" stroke={line} strokeWidth="4" />
      <path d="M282 152H470" stroke={membrane} strokeWidth="4" />
      <path d="M278 342H485" stroke={accent} strokeWidth="3" />
      <Callout n={1} x={370} y={170} tx={65} ty={145} />
      <Callout n={2} x={500} y={362} tx={65} ty={275} />
      <Callout n={3} x={405} y={215} tx={65} ty={385} />
      <Dimension x1={120} x2={545} y={485} label="İÇ / KASA / DENİZLİK / DIŞ" />
    </g>
  );
}

function BalconyDetail({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <ZoneLabels left="İÇ MEKÂN" right="BALKON" />
      <rect x="80" y="270" width="260" height="100" fill={`url(#concrete-${detail.slug})`} stroke={line} />
      <rect x="400" y="270" width="255" height="100" fill={`url(#concrete-${detail.slug})`} stroke={line} />
      <rect x="340" y="270" width="60" height="100" fill={`url(#insulation-${detail.slug})`} stroke={insulation} strokeWidth="2" />
      <path d="M80 245H335M405 245L650 225" stroke={membrane} strokeWidth="4" />
      <path d="M650 225V250" stroke={line} strokeWidth="4" />
      <path d="M420 245L630 228" stroke={accent} strokeWidth="2" markerEnd={`url(#arrow-${detail.slug})`} />
      <Callout n={1} x={370} y={320} tx={75} ty={155} />
      <Callout n={2} x={565} y={232} tx={75} ty={265} />
      <Callout n={3} x={650} y={240} tx={75} ty={375} />
      <text x="370" y="425" textAnchor="middle" fontSize="10" fill={secondary}>TAŞIYICI ISI KÖPRÜSÜ KESİCİ / DIŞA EĞİM / DAMLALIK</text>
    </g>
  );
}

function CurtainWall({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <rect x="95" y="230" width="350" height="115" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <path d="M475 65V475" stroke="#0f5275" strokeWidth="15" />
      <path d="M500 65V475" stroke="#7dd3fc" strokeWidth="5" />
      <path d="M445 245H475M445 320H475" stroke={line} strokeWidth="6" />
      <rect x="445" y="260" width="30" height="48" fill={`url(#insulation-${detail.slug})`} stroke={insulation} />
      <rect x="415" y="250" width="30" height="75" fill="#d5dce1" stroke={line} />
      <path d="M505 100H650M505 440H650" stroke="#7dd3fc" strokeWidth="4" />
      <Callout n={1} x={462} y={245} tx={70} ty={145} />
      <Callout n={2} x={430} y={285} tx={70} ty={270} />
      <Callout n={3} x={500} y={385} tx={70} ty={395} />
      <text x="385" y="515" textAnchor="middle" fontSize="10" fill={secondary}>ANKRAJ / SPANDREL / ÇEVRESEL YANGIN BARİYERİ</text>
    </g>
  );
}

function ExpansionJoint({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <path d="M70 125H310V440H70M650 125H410V440H650" fill={`url(#concrete-${detail.slug})`} stroke={line} strokeWidth="2" />
      <rect x="310" y="125" width="100" height="315" fill="#f8fafc" stroke="#94a3b8" strokeDasharray="6 5" />
      <path d="M310 180L360 235L410 180M310 300L360 245L410 300" fill="none" stroke={insulation} strokeWidth="8" />
      <path d="M320 120V445M400 120V445" stroke={membrane} strokeWidth="4" />
      <path d="M300 105H420" stroke={line} strokeWidth="12" />
      <Callout n={1} x={360} y={235} tx={65} ty={160} />
      <Callout n={2} x={320} y={360} tx={65} ty={275} />
      <Callout n={3} x={360} y={105} tx={65} ty={390} />
      <Dimension x1={310} x2={410} y={485} label="HAREKET DERZİ" />
    </g>
  );
}

function InteriorPartition({ detail }: { detail: ArchitecturalDetail }) {
  return (
    <g>
      <rect x="75" y="90" width="575" height="72" fill={`url(#concrete-${detail.slug})`} stroke={line} />
      <path d="M340 162V420M430 162V420" stroke={line} strokeWidth="7" />
      <rect x="347" y="162" width="76" height="258" fill={`url(#insulation-${detail.slug})`} stroke={insulation} />
      <path d="M330 180H440M330 400H440" stroke={line} strokeWidth="3" />
      <path d="M120 270H330M440 270H610" stroke="#94a3b8" strokeWidth="5" strokeDasharray="8 6" />
      <Callout n={1} x={385} y={145} tx={70} ty={190} />
      <Callout n={2} x={385} y={270} tx={70} ty={300} />
      <Callout n={3} x={440} y={400} tx={70} ty={410} />
      <text x="385" y="485" textAnchor="middle" fontSize="10" fill={secondary}>BÖLME ANA DÖŞEMEYE KADAR DEVAM EDER</text>
    </g>
  );
}

function ZoneLabels({ left, right }: { left: string; right: string }) {
  return (
    <>
      <text x="90" y="45" fontSize="10" fontWeight="800" fill={secondary}>{left}</text>
      <text x="650" y="45" textAnchor="end" fontSize="10" fontWeight="800" fill={secondary}>{right}</text>
      <path d="M120 42H620" stroke="#c2cbd3" strokeDasharray="4 5" />
    </>
  );
}

function Callout({ n, x, y, tx, ty }: { n: number; x: number; y: number; tx: number; ty: number }) {
  return (
    <g>
      <path d={`M${x} ${y}L${tx + 24} ${ty}`} fill="none" stroke={secondary} strokeWidth="1.2" />
      <circle cx={tx + 12} cy={ty} r="12" fill="#f8fafc" stroke={accent} strokeWidth="2" />
      <text x={tx + 12} y={ty + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill={accent}>{n}</text>
    </g>
  );
}

function Dimension({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <path d={`M${x1} ${y}H${x2}M${x1} ${y - 8}V${y + 8}M${x2} ${y - 8}V${y + 8}`} stroke={secondary} />
      <text x={(x1 + x2) / 2} y={y + 22} textAnchor="middle" fontSize="10" fill={secondary}>{label}</text>
    </g>
  );
}

function layerHint(layer: string) {
  const value = layer.toLocaleLowerCase("tr-TR");
  if (value.includes("su yalıt") || value.includes("membran")) return "Süreklilik ve bindirme kontrolü";
  if (value.includes("ısı") || value.includes("xps") || value.includes("mineral")) return "Isı köprüsü kesintisi";
  if (value.includes("taşıyıcı") || value.includes("beton") || value.includes("döşeme")) return "Taşıyıcı sistemle koordinasyon";
  if (value.includes("kaplama") || value.includes("sıva") || value.includes("bitiş")) return "Bitiş, tolerans ve bakım";
  if (value.includes("hava") || value.includes("buhar") || value.includes("rüzgâr")) return "Hava ve buhar sürekliliği";
  return "Ürün ve uygulama koşulunu doğrula";
}
