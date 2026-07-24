import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "PAFTA hakkında görüş, hata bildirimi, içerik önerisi ve iş birliği talepleri için iletişime geçin.",
  alternates: {
    canonical: "/contact",
  },
};

const contactEmail = "iletisim@paftaedu.com";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          İletişim
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Bize ulaş
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Hata bildirimi, yeni araç önerisi, içerik düzeltmesi veya iş birliği
          için e-posta gönderebilirsin.
        </p>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            E-posta
          </p>
          <a
            href={`mailto:${contactEmail}?subject=PAFTA%20İletişim`}
            className="mt-3 block break-all text-xl font-semibold text-cyan-400 transition hover:text-cyan-300 sm:text-2xl"
          >
            {contactEmail}
          </a>
          <p className="mt-4 leading-7 text-slate-400">
            E-postanda ilgili sayfanın bağlantısını ve karşılaştığın durumu
            mümkün olduğunca açık şekilde belirtmen çözümü hızlandırır.
          </p>
        </section>

        <section className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            ["Hata bildirimi", "Çalışmayan araçlar veya yanlış sonuçlar"],
            ["İçerik önerisi", "Yeni hesaplayıcı ve rehber fikirleri"],
            ["İş birliği", "Eğitim, içerik ve proje ortaklıkları"],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800 p-5"
            >
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
