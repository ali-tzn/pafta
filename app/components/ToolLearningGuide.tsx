import Link from "next/link";

type GuideItem = {
  title: string;
  text: string;
};

type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

export default function ToolLearningGuide({
  eyebrow = "Araç rehberi",
  title,
  description,
  steps,
  formulas,
  example,
  mistakes,
  faqs,
  relatedLinks,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  steps: GuideItem[];
  formulas?: GuideItem[];
  example: GuideItem;
  mistakes: GuideItem[];
  faqs: { question: string; answer: string }[];
  relatedLinks: RelatedLink[];
}) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-16 border-t border-slate-800 pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData).replace(/</g, "\\u003c"),
        }}
      />

      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-4xl text-3xl font-bold sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">
        {description}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((item, index) => (
          <article
            key={item.title}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-bold text-cyan-300">
              {index + 1}
            </span>
            <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {formulas && formulas.length > 0 && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-7">
            <h3 className="text-2xl font-bold">Hesaplama mantığı</h3>
            <div className="mt-6 space-y-5">
              {formulas.map((item) => (
                <div key={item.title}>
                  <p className="font-semibold text-cyan-300">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-7">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
            Uygulamalı örnek
          </p>
          <h3 className="mt-3 text-2xl font-bold">{example.title}</h3>
          <p className="mt-4 leading-8 text-slate-300">{example.text}</p>
        </section>
      </div>

      <section className="mt-10 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-7">
        <h3 className="text-2xl font-bold text-amber-200">
          Sık yapılan hatalar
        </h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {mistakes.map((item) => (
            <article key={item.title} className="rounded-2xl bg-slate-950/70 p-5">
              <h4 className="font-semibold text-white">{item.title}</h4>
              <p className="mt-2 text-sm leading-7 text-slate-400">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-3xl font-bold">Sık sorulan sorular</h3>
        <div className="mt-6 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <summary className="cursor-pointer list-none font-semibold text-white">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-cyan-300 transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-bold">Sonraki adımda kullanabileceğin araçlar</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {relatedLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/50"
            >
              <p className="font-semibold text-cyan-300">{item.label} →</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
