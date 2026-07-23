import Link from "next/link";

const tools = [
  {
    title: "Ölçek Hesaplayıcı",
    description:
      "Gerçek ölçüyü seçtiğin ölçeğe göre çizim ölçüsüne dönüştür.",
    href: "/tools/scale-calculator",
    icon: "📐",
    category: "Temel Hesaplar",
    status: "Hazır",
  },
  {
    title: "Merdiven Hesaplayıcı",
    description:
      "Kat yüksekliğine göre rıht sayısını, basamak genişliğini ve yatay uzunluğu hesapla.",
    href: "/tools/stair-calculator",
    icon: "🪜",
    category: "Mimari Hesaplar",
    status: "Hazır",
  },
  {
    title: "Alan Hesaplayıcı",
    description:
      "Dikdörtgen ve kare alanların metrekare hesabını hızlıca yap.",
    href: "#",
    icon: "📏",
    category: "Temel Hesaplar",
    status: "Yakında",
  },
  {
    title: "Beton Hacmi Hesaplayıcı",
    description:
      "Kolon, kiriş, döşeme ve temel için yaklaşık beton hacmini hesapla.",
    href: "#",
    icon: "🧱",
    category: "Yapı Hesapları",
    status: "Yakında",
  },
  {
    title: "Rampa Hesaplayıcı",
    description:
      "Kot farkı ve eğim yüzdesine göre gerekli rampa uzunluğunu hesapla.",
    href: "#",
    icon: "♿",
    category: "Mimari Hesaplar",
    status: "Yakında",
  },
  {
    title: "Otopark Hesaplayıcı",
    description:
      "Alan ve kullanım türüne göre yaklaşık otopark ihtiyacını hesapla.",
    href: "#",
    icon: "🚗",
    category: "Yerleşim Hesapları",
    status: "Yakında",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            PAFTA Araçları
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Mimarlık öğrencileri için hızlı ve pratik hesap araçları
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Ölçek, merdiven, alan, beton hacmi ve daha birçok hesabı tek bir
            yerde yap.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const isAvailable = tool.status === "Hazır";

            const card = (
              <article
                className={`group h-full rounded-3xl border p-6 transition duration-300 ${
                  isAvailable
                    ? "border-slate-800 bg-slate-900 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-950/30"
                    : "cursor-not-allowed border-slate-800 bg-slate-900/60 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-3xl">
                    {tool.icon}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isAvailable
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>

                <p className="mt-6 text-sm font-medium text-cyan-400">
                  {tool.category}
                </p>

                <h2 className="mt-2 text-2xl font-bold">{tool.title}</h2>

                <p className="mt-3 leading-7 text-slate-400">
                  {tool.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
                  <span className="text-sm font-semibold text-slate-200">
                    {isAvailable ? "Aracı aç" : "Geliştiriliyor"}
                  </span>

                  <span
                    className={`text-xl transition ${
                      isAvailable ? "group-hover:translate-x-1" : ""
                    }`}
                  >
                    →
                  </span>
                </div>
              </article>
            );

            if (!isAvailable) {
              return <div key={tool.title}>{card}</div>;
            }

            return (
              <Link key={tool.title} href={tool.href}>
                {card}
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}