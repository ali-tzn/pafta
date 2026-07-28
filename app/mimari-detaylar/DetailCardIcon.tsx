type Props = {
  slug: string;
  title: string;
};

const common = {
  stroke: "#334155",
  strokeWidth: 3,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function DetailCardIcon({ slug, title }: Props) {
  let drawing;

  switch (slug) {
    case "dis-duvar-mantolama-subasman":
      drawing = <>
        <path d="M105 16V72H82V101H220" {...common} strokeWidth="12" />
        <path d="M122 16V82H94V101" {...common} stroke="#f59e0b" strokeWidth="9" />
        <path d="M92 78H225" {...common} stroke="#0284c7" strokeWidth="4" />
        <path d="M210 101V86H242" {...common} />
      </>;
      break;
    case "havalandirmali-cephe-duvar-birlesimi":
      drawing = <>
        <rect x="82" y="15" width="45" height="90" fill="#cbd5e1" stroke="#334155" strokeWidth="3" />
        <rect x="137" y="15" width="24" height="90" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
        <path d="M178 96V24M178 24L170 36M178 24L186 36" stroke="#0284c7" strokeWidth="3" fill="none" />
        <rect x="197" y="10" width="34" height="100" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
        <path d="M161 40H197M161 80H197" {...common} />
      </>;
      break;
    case "pencere-denizlik-damlalik":
      drawing = <>
        <path d="M78 12V108M78 42H128V88H78" {...common} strokeWidth="10" />
        <rect x="130" y="37" width="70" height="55" fill="#bae6fd" stroke="#0369a1" strokeWidth="4" />
        <path d="M118 94L227 102L237 96" {...common} strokeWidth="7" />
        <path d="M221 102V111" {...common} stroke="#0284c7" />
      </>;
      break;
    case "parapet-ve-ters-cati":
      drawing = <>
        <path d="M72 18V102H245" {...common} strokeWidth="12" />
        <path d="M87 34V88H246" {...common} stroke="#f59e0b" strokeWidth="8" />
        <path d="M91 87V37" {...common} stroke="#2563eb" strokeWidth="4" />
        <path d="M60 18H105L111 23H55Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
        <path d="M60 25V33M106 25V33" {...common} />
      </>;
      break;
    case "teras-cati-suzgec":
      drawing = <>
        <path d="M55 70L132 88L205 70" {...common} strokeWidth="10" />
        <path d="M55 55L132 73L205 55" {...common} stroke="#2563eb" strokeWidth="4" />
        <path d="M118 68H146V84H139V112H125V84H118Z" fill="#64748b" stroke="#334155" strokeWidth="3" />
        <path d="M224 38V91M214 81L224 91L234 81" stroke="#0284c7" strokeWidth="4" fill="none" />
      </>;
      break;
    case "yesil-cati-parapet":
      drawing = <>
        <path d="M61 18V102H247" {...common} strokeWidth="11" />
        <path d="M76 88H247" stroke="#2563eb" strokeWidth="4" />
        <path d="M93 73H247" stroke="#92400e" strokeWidth="16" />
        <path d="M116 72Q108 50 122 40M151 72Q145 48 160 34M190 72Q184 50 200 42" stroke="#16a34a" strokeWidth="4" fill="none" />
        <path d="M222 73V104" stroke="#0284c7" strokeWidth="5" />
      </>;
      break;
    case "zemine-oturan-doseme":
      drawing = <>
        <path d="M77 15V102H244" {...common} strokeWidth="14" />
        <path d="M92 25V87H230" stroke="#2563eb" strokeWidth="5" fill="none" />
        <path d="M108 102V79H145V102M175 102V79H212V102" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
        <circle cx="68" cy="91" r="10" fill="#bae6fd" stroke="#0369a1" strokeWidth="3" />
        <path d="M58 91H42" stroke="#0369a1" strokeWidth="3" />
      </>;
      break;
    case "islak-hacim-duvar-doseme":
      drawing = <>
        <path d="M73 18V96H240" {...common} strokeWidth="12" />
        <path d="M88 31V80H234" stroke="#2563eb" strokeWidth="5" fill="none" />
        <path d="M106 80L164 94L220 80" stroke="#94a3b8" strokeWidth="9" fill="none" />
        <path d="M153 84H175V96H168V112H160V96H153Z" fill="#334155" />
        <path d="M108 28H222M108 41H222" stroke="#0ea5e9" strokeWidth="2" />
      </>;
      break;
    case "balkon-doseme-isi-koprusu":
      drawing = <>
        <path d="M48 70H132M172 70H270" {...common} strokeWidth="16" />
        <rect x="132" y="57" width="40" height="27" fill="#fde68a" stroke="#b45309" strokeWidth="3" />
        <path d="M48 50H129M175 48L268 41" stroke="#2563eb" strokeWidth="4" />
        <path d="M259 41V53" {...common} />
        <path d="M112 28V105" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 5" />
      </>;
      break;
    case "giydirme-cephe-doseme-kenari":
      drawing = <>
        <path d="M60 62H180" {...common} strokeWidth="18" />
        <path d="M205 12V110" stroke="#0369a1" strokeWidth="9" />
        <path d="M180 47H205M180 76H205" {...common} />
        <rect x="181" y="52" width="24" height="20" fill="#f59e0b" />
        <path d="M221 12V110" stroke="#38bdf8" strokeWidth="3" />
        <path d="M224 22H258M224 100H258" {...common} />
      </>;
      break;
    case "dilatasyon-duvar-doseme":
      drawing = <>
        <path d="M47 38H132V100H47M273 38H188V100H273" {...common} strokeWidth="13" />
        <path d="M132 49L160 76L188 49M132 87L160 60L188 87" stroke="#f59e0b" strokeWidth="5" fill="none" />
        <path d="M144 30V108M176 30V108" stroke="#2563eb" strokeWidth="3" strokeDasharray="5 4" />
      </>;
      break;
    default:
      drawing = <>
        <path d="M60 22H260M60 98H260" {...common} strokeWidth="10" />
        <path d="M100 22V98M220 22V98" {...common} />
        <path d="M112 22V98M124 22V98M196 22V98M208 22V98" stroke="#f59e0b" strokeWidth="4" />
        <path d="M148 40H172V80H148Z" fill="#bae6fd" stroke="#0369a1" strokeWidth="3" />
      </>;
  }

  return (
    <svg viewBox="0 0 320 150" className="h-32 w-full" role="img" aria-label={`${title} şematik ön izlemesi`}>
      <defs>
        <pattern id={`preview-grid-${slug}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="#dbe2e8" strokeWidth=".55" />
        </pattern>
      </defs>
      <rect width="320" height="150" rx="12" fill="#eef1f3" />
      <rect width="320" height="150" rx="12" fill={`url(#preview-grid-${slug})`} />
      <path d="M16 23H304" stroke="#aeb9c2" />
      <text x="16" y="16" fontSize="7.5" fontWeight="800" letterSpacing="1.2" fill="#475569">
        PAFTA / ŞEMATİK DETAY
      </text>
      <text x="304" y="16" textAnchor="end" fontSize="7.5" fill="#64748b">KESİT</text>
      <g transform="translate(0 20)">{drawing}</g>
      <path d="M16 132H304" stroke="#aeb9c2" />
      <circle cx="25" cy="141" r="5.5" fill="#0284c7" />
      <text x="25" y="143.5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="white">1</text>
      <text x="36" y="144" fontSize="7.5" fontWeight="700" fill="#475569">KRİTİK BİRLEŞİM</text>
      <text x="304" y="144" textAnchor="end" fontSize="7" fill="#64748b">ÖLÇEKSİZ ÖN İZLEME</text>
    </svg>
  );
}
