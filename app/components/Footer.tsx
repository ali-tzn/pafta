import Image from "next/image";
import Link from "next/link";
import CookieSettingsButton from "./CookieSettingsButton";

const footerGroups = [
  {
    title: "Çalış",
    links: [
      ["Proje Araçları", "/proje-araclari"],
      ["Hesap Araçları", "/tools"],
      ["PDF Araçları", "/pdf-tools"],
      ["Teslim Araçları", "/teslim-araclari"],
    ],
  },
  {
    title: "Öğren",
    links: [
      ["Mimarlık Rehberi", "/mimarlik"],
      ["Yapı Malzemeleri", "/yapi-malzemeleri"],
      ["Revit", "/revit"],
      ["BIM", "/bim"],
    ],
  },
  {
    title: "PAFTA",
    links: [
      ["Hakkımızda", "/about"],
      ["İletişim", "/contact"],
      ["Gizlilik", "/privacy"],
      ["Kullanım Koşulları", "/terms"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050c15] text-white">
      <div className="mx-auto grid max-w-[1380px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.15fr_1.85fr] md:py-16">
        <div>
          <Link href="/" aria-label="PAFTA ana sayfa" className="inline-flex">
            <Image
              src="/pafta-logo-white.png"
              alt="PAFTA"
              width={180}
              height={54}
              className="h-12 w-40 object-cover object-center"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Mimarlık öğrencileri ve tasarımcılar için ücretsiz araçlar, teknik
            bilgiler ve açık rehberler.
          </p>
          <a
            href="mailto:iletisim@paftaedu.com"
            className="mt-5 inline-block text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            iletisim@paftaedu.com
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                {group.title}
              </h2>
              <div className="mt-4 grid gap-3 text-sm text-slate-400">
                {group.links.map(([label, href]) => (
                  <Link key={href} href={href} className="hover:text-white">
                    {label}
                  </Link>
                ))}
                {group.title === "PAFTA" && <CookieSettingsButton />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.07] px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 PAFTA. Tüm hakları saklıdır.</span>
          <span>Mimarlığın dijital çalışma alanı.</span>
        </div>
      </div>
    </footer>
  );
}
