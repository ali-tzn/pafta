import Link from "next/link";

export type ContentLink = {
  href: string;
  title: string;
  description?: string;
  label?: string;
};

export function ContentMeta({
  items,
  sourceNote,
  sources = [],
}: {
  items?: { id: string; label: string }[];
  sourceNote?: string;
  sources?: { label: string; href: string }[];
}) {
  return (
    <aside className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
        <span><strong className="text-slate-200">Son kontrol:</strong> 1 Ağustos 2026</span>
        <span><strong className="text-slate-200">Hazırlayan:</strong> PAFTA editörü</span>
        {sourceNote && <span><strong className="text-slate-200">Kaynak:</strong> {sourceNote}</span>}
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        Bu içerik, mimarlık eğitimi ve uygulama deneyiminde karşılaşılan gerçek
        çalışma ihtiyaçları temel alınarak hazırlanmıştır. Teknik kararlar proje
        koşulları, güncel standartlar ve üretici verileriyle ayrıca doğrulanmalıdır.
      </p>
      {sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {sources.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
              {source.label} ↗
            </a>
          ))}
        </div>
      )}
      {items && items.length > 1 && (
        <details className="mt-4 border-t border-slate-800 pt-4">
          <summary className="cursor-pointer font-semibold text-cyan-300">Bu sayfada neler var?</summary>
          <nav className="mt-3 grid gap-2 sm:grid-cols-2">
            {items.map((item, index) => (
              <a key={item.id} href={`#${item.id}`} className="text-sm text-slate-400 transition hover:text-cyan-300">
                {index + 1}. {item.label}
              </a>
            ))}
          </nav>
        </details>
      )}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-800 pt-4 text-xs text-slate-500">
        <Link href="/about" className="hover:text-cyan-300">İçerik hazırlama yaklaşımımız</Link>
        <Link href="/contact" className="hover:text-cyan-300">Hata veya düzeltme bildir</Link>
      </div>
    </aside>
  );
}

export function RelatedContent({
  items,
  next,
  title = "Buradan devam et",
}: {
  items: ContentLink[];
  next?: ContentLink;
  title?: string;
}) {
  return (
    <section className="mt-12 border-t border-slate-800 pt-9">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">İlgili içerikler</p>
      <h2 className="mt-2 text-2xl font-bold">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <Link key={item.href} href={item.href} className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/50">
            {item.label && <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">{item.label}</span>}
            <h3 className="mt-2 font-semibold group-hover:text-cyan-300">{item.title}</h3>
            {item.description && <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>}
          </Link>
        ))}
      </div>
      {next && (
        <Link href={next.href} className="mt-5 flex items-center justify-between rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-5 transition hover:border-cyan-300">
          <span><span className="block text-xs font-semibold uppercase tracking-wider text-cyan-400">Sıradaki rehber</span><strong className="mt-1 block text-cyan-100">{next.title}</strong></span>
          <span className="text-xl text-cyan-300">→</span>
        </Link>
      )}
    </section>
  );
}
