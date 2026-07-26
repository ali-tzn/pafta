import type { ArchitecturalDetail } from "./details";

const colors = ["#e2e8f0", "#f1f5f9", "#fde68a", "#bae6fd", "#cbd5e1", "#fed7aa", "#bbf7d0"];

export default function DetailDiagram({ detail }: { detail: ArchitecturalDetail }) {
  const horizontal = ["Çatı", "Zemin ve Temel", "Islak Hacim"].includes(detail.category);
  const wetRoom = detail.category === "Islak Hacim";
  const foundation = detail.category === "Zemin ve Temel";

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
      <div className="flex flex-col justify-between gap-2 border-b border-slate-800 p-6 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-400">Şematik teknik anlatım</p><h2 className="mt-2 text-2xl font-bold">Katman ve birleşim diyagramı</h2></div>
        <span className="text-sm text-slate-500">Önerilen çizim ölçeği {detail.scale}</span>
      </div>
      <div className="overflow-x-auto bg-slate-100 p-4">
        <svg viewBox="0 0 1000 520" className="min-w-[800px]" role="img" aria-label={`${detail.title} şematik katman çizimi`}>
          <defs>
            <pattern id={`hatch-${detail.slug}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="#64748b" strokeWidth="2" opacity=".45" /></pattern>
            <marker id={`detail-arrow-${detail.slug}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#334155" /></marker>
          </defs>
          <rect x="0" y="0" width="1000" height="520" fill="#f8fafc" />
          <text x="45" y="42" fontSize="13" fontWeight="800" fill="#0f172a">{detail.category.toLocaleUpperCase("tr-TR")} / ŞEMATİK KESİT</text>
          <line x1="45" y1="54" x2="955" y2="54" stroke="#94a3b8" />

          {horizontal ? detail.layers.map((layer, index) => {
            const height = 38;
            const y = 110 + index * height;
            return <g key={layer}>
              <rect x="175" y={y} width="460" height={height} fill={colors[index % colors.length]} stroke="#334155" />
              {index % 3 === 2 && <rect x="175" y={y} width="460" height={height} fill={`url(#hatch-${detail.slug})`} />}
              <line x1="635" y1={y + height / 2} x2="715" y2={y + height / 2} stroke="#64748b" />
              <circle cx="635" cy={y + height / 2} r="3" fill="#334155" />
              <text x="730" y={y + height / 2 + 5} fontSize="12" fontWeight="700" fill="#0f172a">{index + 1}. {layer}</text>
            </g>;
          }) : detail.layers.map((layer, index) => {
            const width = 56;
            const x = 180 + index * width;
            return <g key={layer}>
              <rect x={x} y="115" width={width} height="300" fill={colors[index % colors.length]} stroke="#334155" />
              {index % 3 === 2 && <rect x={x} y="115" width={width} height="300" fill={`url(#hatch-${detail.slug})`} />}
              <line x1={x + width / 2} y1="115" x2={x + width / 2} y2={85 - (index % 2) * 20} stroke="#64748b" />
              <text x={x + width / 2} y={76 - (index % 2) * 20} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a">{index + 1}</text>
              <line x1={x + width / 2} y1="415" x2="700" y2={440 + index * 9} stroke="#64748b" />
              <text x="715" y={444 + index * 9} fontSize="11" fontWeight="700" fill="#0f172a">{index + 1}. {layer}</text>
            </g>;
          })}

          {foundation && <>
            <path d="M130 390H680V435H235V485H130Z" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
            <path d="M145 410V475M145 475H225" stroke="#2563eb" strokeWidth="5" />
            <text x="260" y="480" fontSize="11" fontWeight="700" fill="#1d4ed8">Yatay–düşey yalıtım sürekliliği</text>
          </>}
          {wetRoom && <>
            <path d="M175 105V410H635" fill="none" stroke="#2563eb" strokeWidth="6" />
            <path d="M580 410L620 385L635 410" fill="#0f172a" />
            <text x="430" y="455" fontSize="11" fontWeight="700" fill="#1d4ed8">Köşe bandı + süzgeç bağlantısı</text>
          </>}

          <line x1="145" y1="92" x2="145" y2="420" stroke="#0f172a" markerEnd={`url(#detail-arrow-${detail.slug})`} />
          <text x="127" y="265" transform="rotate(-90 127 265)" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">{horizontal ? "ÜST → ALT KATMAN SIRASI" : "İÇ → DIŞ KATMAN SIRASI"}</text>
          <rect x="715" y="92" width="235" height="52" rx="8" fill="#ecfeff" stroke="#0891b2" />
          <text x="832" y="114" textAnchor="middle" fontSize="11" fontWeight="800" fill="#155e75">KRİTİK İLKE</text>
          <text x="832" y="132" textAnchor="middle" fontSize="10" fill="#334155">Su · ısı · hava katmanlarını kesintisiz bağla</text>
          <text x="45" y="500" fontSize="10" fill="#64748b">Şema ölçekli uygulama çizimi değildir; katman sırası ve süreklilik kararını anlatır.</text>
        </svg>
      </div>
    </section>
  );
}
