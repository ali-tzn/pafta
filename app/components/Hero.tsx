export default function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
      <span className="rounded-full border border-cyan-500 px-4 py-2 text-sm text-cyan-400">
        Mimarlık Öğrencilerinin Dijital Kampüsü
      </span>

      <h1 className="mt-8 text-6xl font-bold">
        PAFTA
      </h1>

      <p className="mt-6 max-w-2xl text-xl text-slate-300">
        Revit, AutoCAD, Rhino, BIM, ücretsiz dosyalar ve mimarlık
        öğrencilerinin ihtiyaç duyduğu her şey tek platformda.
      </p>

      <div className="mt-10 w-full max-w-xl">
        <input
          type="text"
          placeholder="Revit, CAD, araç veya konu ara..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none focus:border-cyan-400"
        />
      </div>
    </section>
  );
}
