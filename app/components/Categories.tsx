const items = [
  "🧮 Hesap Araçları",
  "📚 Revit",
  "📐 CAD Blokları",
  "🏗️ Yapı Malzemeleri",
  "🤖 AI",
  "📂 Dosya Merkezi",
];

export default function Categories() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-cyan-400 hover:scale-105"
        >
          <h2 className="text-xl font-semibold">{item}</h2>
        </div>
      ))}
    </section>
  );
}