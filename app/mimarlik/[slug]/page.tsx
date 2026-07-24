import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  architectureArticles,
  getArchitectureArticle,
} from "../articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return architectureArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArchitectureArticle(slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: `/mimarlik/${article.slug}`,
    },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      title: article.title,
      description: article.description,
      url: `/mimarlik/${article.slug}`,
    },
  };
}

export default async function ArchitectureArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArchitectureArticle(slug);
  if (!article) notFound();

  const relatedArticles = architectureArticles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    inLanguage: "tr-TR",
    mainEntityOfPage: `https://paftaedu.com/mimarlik/${article.slug}`,
    author: {
      "@type": "Organization",
      name: "PAFTA",
      url: "https://paftaedu.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PAFTA",
      url: "https://paftaedu.com",
    },
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://paftaedu.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mimarlık Rehberi",
        item: "https://paftaedu.com/mimarlik",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.shortTitle,
        item: `https://paftaedu.com/mimarlik/${article.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      {[articleData, faqData, breadcrumbData].map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <article className="mx-auto max-w-4xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/mimarlik" className="transition hover:text-cyan-400">
            Mimarlık Rehberi
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{article.shortTitle}</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-semibold text-cyan-300">
              {article.category}
            </span>
            <span className="text-slate-400">{article.period}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{article.readingTime}</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            {article.intro}
          </p>
        </header>

        <aside className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-semibold text-cyan-300">Kısa özet</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            {article.summary.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mt-12 space-y-12 leading-8 text-slate-300">
          {article.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Önemli isimler</h2>
            <ul className="mt-4 space-y-2 text-slate-300">
              {article.architects.map((architect) => (
                <li key={architect}>• {architect}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Örnek yapılar ve tasarımlar</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              {article.examples.map((example) => (
                <li key={example.name}>
                  <strong className="text-white">{example.name}</strong>
                  <span className="block text-sm text-slate-400">
                    {example.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Sık sorulan sorular</h2>
          <div className="mt-6 space-y-4">
            {article.faq.map((item) => (
              <details
                key={item.question}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <summary className="cursor-pointer list-none font-semibold">
                  {item.question}
                </summary>
                <p className="mt-4 leading-7 text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Kaynaklar ve ileri okuma</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Bu rehber öğrenci odaklı bir başlangıç metnidir. Akademik
            çalışmalarında aşağıdaki kurumsal kaynakları ve ders kaynaklarını
            ayrıca incele.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {article.sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                {source.label} ↗
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">İlgili mimarlık yazıları</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/mimarlik/${item.slug}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 font-semibold transition hover:border-cyan-400/60 hover:text-cyan-300"
              >
                {item.shortTitle} →
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
