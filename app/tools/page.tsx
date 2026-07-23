import Link from "next/link";

const tools = [
  {
    title: "📐 Ölçek Hesaplayıcı",
    description: "Gerçek ölçüyü çizim ölçüsüne dönüştür.",
    href: "/tools/scale-calculator",
  },
  {
    title: "📏 m² Hesaplayıcı",
    description: "Yakında eklenecek.",
    href: "#",
  },
  {
    title: "🧱 m³ Hesaplayıcı",
    description: "Yakında eklenecek.",
    href: "#",
  },
  {
    title: "♿ Rampa Hesaplayıcı",
    description: "Yakında eklenecek.",
    href: "#",
  },
  {
    title: "🪜 Merdiven Hesaplayıcı",
    description: "Yakında eklenecek.",
    href: "#",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold">Hesap Araçları</h1>

        <p className="mt-4 text-slate-300">
          Mimarlık öğrencileri için ücretsiz hesaplama araçları.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400 hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold">{tool.title}</h2>

              <p className="mt-3 text-slate-400">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
