import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <Image
          src="/pafta-logo-white.png"
          alt="PAFTA"
          width={600}
          height={200}
          priority
          className="h-20 w-64 object-cover object-center md:h-24 md:w-80"
        />

        <p className="-mt-2 text-lg font-medium text-cyan-400 md:text-xl">
          Mimarlık öğrencilerinin dijital kampüsü.
        </p>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          Hesaplama araçları, Revit ve BIM içerikleri, proje kaynakları ve
          mimarlık öğrencilerinin ihtiyaç duyduğu dijital çözümler tek yerde.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tools"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Araçları Keşfet
          </Link>

          <Link
            href="/revit"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Revit Rehberleri
          </Link>
        </div>
      </div>
    </section>
  );
}