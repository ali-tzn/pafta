import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <Image
          src="/pafta-logo-white.png"
          alt="PAFTA"
          width={600}
          height={200}
          priority
          className="h-16 w-52 object-cover object-center sm:h-20 sm:w-64 md:h-24 md:w-80"
        />

        <p className="-mt-1 text-base font-medium text-cyan-400 sm:text-lg md:text-xl">
          Mimarlık öğrencilerinin dijital kampüsü.
        </p>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          Hesaplama araçları, Revit ve BIM içerikleri, proje kaynakları ve
          mimarlık öğrencilerinin ihtiyaç duyduğu dijital çözümler tek yerde.
        </p>

        <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Link
            href="/tools"
            className="min-h-12 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Araçları Keşfet
          </Link>

          <Link
            href="/revit"
            className="min-h-12 rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Revit Rehberleri
          </Link>
        </div>
      </div>
    </section>
  );
}
