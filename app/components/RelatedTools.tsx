import Link from "next/link";

const pdfTools = [
  ["PDF → PNG / JPG", "/pdf-tools/pdf-to-png"],
  ["PDF Birleştirme", "/pdf-tools/merge"],
  ["PDF Sıkıştırma", "/pdf-tools/compress"],
  ["Pafta Boyutu ve Ölçek", "/pdf-tools/resize-pages"],
  ["PDF Sayfalarını Ayır", "/pdf-tools/split"],
  ["PDF Sayfalarını Düzenle", "/pdf-tools/organize"],
];

const calculationTools = [
  ["TAKS–KAKS", "/tools/taks-kaks"],
  ["Ölçek Hesaplama", "/tools/scale-calculator"],
  ["Merdiven Hesaplama", "/tools/stair-calculator"],
  ["Rampa Hesaplama", "/tools/ramp-calculator"],
  ["Alan Hesaplama", "/tools/area-calculator"],
  ["Beton Hacmi", "/tools/concrete-calculator"],
];

export default function RelatedTools({
  currentHref,
  kind,
}: {
  currentHref: string;
  kind: "pdf" | "calculation";
}) {
  const items = (kind === "pdf" ? pdfTools : calculationTools)
    .filter(([, href]) => href !== currentHref)
    .slice(0, 4);

  return (
    <section className="mx-auto mt-14 max-w-7xl border-t border-slate-800 pt-9">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Bununla birlikte kullanabileceğin araçlar</h2>
        <Link
          href={kind === "pdf" ? "/pdf-tools" : "/tools"}
          className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Tümünü gör →
        </Link>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([title, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
          >
            {title} →
          </Link>
        ))}
      </div>
    </section>
  );
}
