import Link from "next/link";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Ana Sayfa", href: "/" },
      { label: "Hesap Araçları", href: "/tools" },
      { label: "Revit Merkezi", href: "#" },
      { label: "CAD Arşivi", href: "#" },
    ],
  },
  {
    title: "Araçlar",
    links: [
      { label: "Ölçek Hesaplayıcı", href: "/tools/scale-calculator" },
      { label: "Merdiven Hesaplayıcı", href: "/tools/stair-calculator" },
      { label: "Alan Hesaplayıcı", href: "#" },
      { label: "Rampa Hesaplayıcı", href: "#" },
    ],
  },
  {
    title: "PAFTA",
    links: [
      { label: "Hakkımızda", href: "#" },
      { label: "İletişim", href: "#" },
      { label: "Gizlilik Politikası", href: "#" },
      { label: "Kullanım Koşulları", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Link href="/" className="text-2xl font-black tracking-widest">
            PAFTA
          </Link>

          <p className="mt-4 max-w-md leading-7 text-slate-400">
            Mimarlık öğrencileri için hesap araçları, dijital kaynaklar ve
            uygulama rehberleri sunan dijital kampüs.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="font-semibold text-slate-100">{group.title}</h2>

              <div className="mt-4 flex flex-col gap-3">
                {group.links.map((link) =>
                  link.href === "#" ? (
                    <span
                      key={link.label}
                      className="cursor-not-allowed text-sm text-slate-600"
                    >
                      {link.label}
                    </span>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-cyan-300"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 pt-6 text-sm text-slate-500">
        © 2026 PAFTA. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
