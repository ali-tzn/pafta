import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategory,
  getMaterial,
  getMaterialsByCategory,
  materials,
  ratingLabels,
} from "../../materials";
import { ArticleSeo, createSeoMetadata } from "@/lib/seo";
import { getMaterialTechnicalData } from "../../technical-data";
import FacadeAssemblyDiagram from "../../FacadeAssemblyDiagram";
import { ContentMeta } from "@/app/components/ContentNavigation";

type Props = {
  params: Promise<{ category: string; material: string }>;
};

export function generateStaticParams() {
  return materials.map((material) => ({
    category: material.category,
    material: material.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, material: slug } = await params;
  const material = getMaterial(category, slug);
  if (!material) return {};
  return createSeoMetadata({
    title: `${material.name} Nedir? Özellikleri, Kullanımı ve Avantajları`,
    description: material.summary,
    path: `/yapi-malzemeleri/${category}/${material.slug}`,
    keywords: material.keywords,
  });
}

export default async function MaterialDetailPage({ params }: Props) {
  const { category: categorySlug, material: materialSlug } = await params;
  const category = getCategory(categorySlug);
  const material = getMaterial(categorySlug, materialSlug);
  if (!category || !material) notFound();
  const related = getMaterialsByCategory(category.slug).filter(
    (item) => item.slug !== material.slug
  );
  const technical = getMaterialTechnicalData(material.slug, category.slug);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <ArticleSeo title={`${material.name} Nedir?`} description={material.summary} path={`/yapi-malzemeleri/${category.slug}/${material.slug}`} section={`${category.name} Malzemeleri`} sectionPath={`/yapi-malzemeleri/${category.slug}`} keywords={material.keywords} />
      <article className="mx-auto max-w-4xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/yapi-malzemeleri">Yapı Malzemeleri</Link>
          <span className="mx-2">/</span>
          <Link href={`/yapi-malzemeleri/${category.slug}`}>{category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{material.name}</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            {category.name}
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            {material.name} Nedir?
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            {material.description}
          </p>
        </header>
        <ContentMeta items={[{ id: "teknik-degerler", label: "Teknik değerler" }, { id: "kalinlik-secimi", label: "Kalınlık seçimi" }, ...(category.slug === "cephe-kaplama" ? [{ id: "ornek-cephe-kesiti", label: "Örnek cephe kesiti" }] : []), { id: "kullanim-notlari", label: "Kullanım ve seçim notları" }]} sourceNote="Tipik ürün aralıkları ve üretici teknik föyü kontrolü" />

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Genel performans görünümü</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Puanlar 5 üzerinden genel ön değerlendirmedir; kesin ürün değeri
            değildir. Üretici ve sistem seçimine göre değişebilir.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Object.entries(material.ratings).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">
                    {ratingLabels[key as keyof typeof ratingLabels]}
                  </span>
                  <strong className="text-cyan-300">{value}/5</strong>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${value * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {technical && (
          <>
            <section id="teknik-degerler" className="mt-12 scroll-mt-24">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Ön tasarım verisi
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Teknik değerler ve ne anlama geldikleri
                  </h2>
                </div>
                <span className="text-sm text-slate-500">Tipik aralıklar</span>
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="bg-slate-900 text-slate-300">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Özellik</th>
                        <th className="px-5 py-4 font-semibold">Tipik değer</th>
                        <th className="px-5 py-4 font-semibold">Tasarım notu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                      {technical.values.map((row) => (
                        <tr key={row.label}>
                          <th className="px-5 py-4 font-medium text-white">{row.label}</th>
                          <td className="px-5 py-4 font-semibold text-cyan-300">{row.value}</td>
                          <td className="px-5 py-4 leading-6 text-slate-400">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Bu aralıklar ürün seçimine başlangıç içindir. Şartname, enerji,
                statik, yangın veya akustik hesabında güncel üretici teknik föyü,
                performans beyanı ve ilgili proje standardı esas alınmalıdır.
              </p>
            </section>

            <section id="kalinlik-secimi" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold">Kalınlık nasıl seçilir?</h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                Tek bir “doğru kalınlık” yoktur. Kullanım yeri, açıklık veya yük,
                yangın ve ses hedefi, enerji hesabı, nem koşulu ve komşu
                katmanlar birlikte değerlendirilir.
              </p>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {technical.thicknesses.map((choice) => (
                  <article key={choice.use} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <h3 className="font-semibold text-white">{choice.use}</h3>
                    <p className="mt-3 text-lg font-bold text-cyan-300">{choice.typical}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{choice.decision}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">Projeye eklemeden önce kontrol et</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {technical.designChecks.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl bg-slate-950/70 p-4 text-slate-300">
                    <span aria-hidden className="text-cyan-300">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {category.slug === "cephe-kaplama" && <FacadeAssemblyDiagram materialName={material.name} />}

        <div id="kullanim-notlari" className="mt-12 grid scroll-mt-24 gap-6 md:grid-cols-2">
          <InfoBlock title="Kullanım alanları" items={material.uses} />
          <InfoBlock title="Avantajları" items={material.advantages} />
          <InfoBlock
            title="Dikkat edilmesi gerekenler"
            items={material.considerations}
          />
          <InfoBlock title="Seçim ve uygulama notları" items={material.selectionNotes} />
        </div>

        <section className="mt-12 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
          <h2 className="text-xl font-semibold text-amber-200">
            Teknik değerleri nasıl kullanmalısın?
          </h2>
          <p className="mt-3 leading-7 text-slate-300">
            Aynı malzeme adını taşıyan iki ürünün yoğunluğu, kalınlığı,
            dayanımı, yangın sınıfı ve çevresel performansı farklı olabilir.
            Şartname veya uygulama kararı verirken güncel ürün teknik föyünü,
            performans beyanını, ilgili standardı ve bütün yapı sistemi
            içindeki katmanları kontrol et.
          </p>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">Aynı kategorideki alternatifler</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/yapi-malzemeleri/${category.slug}/${item.slug}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 font-semibold hover:border-cyan-400/60 hover:text-cyan-300"
                >
                  {item.name} →
                </Link>
              ))}
            </div>
            <Link
              href="/yapi-malzemeleri/karsilastir"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
            >
              Alternatifleri karşılaştır
            </Link>
          </section>
        )}
      </article>
    </main>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-cyan-400">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
