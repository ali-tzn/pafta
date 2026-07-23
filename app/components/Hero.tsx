import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="bg-slate-950 px-6 py-20 text-white md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <Image
          src="/pafta-logo-white.png"
          alt="PAFTA"
          width={600}
          height={200}
          priority
          className="h-24 w-80 object-cover object-center md:h-28 md:w-96"
        />

        <p className="mt-4 text-lg font-medium text-cyan-400 md:text-xl">
          Mimarlık öğrencilerinin dijital kampüsü.
        </p>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
          Hesaplama araçları, Revit ve BIM içerikleri, proje kaynakları ve
          mimarlık öğrencilerinin ihtiyaç duyduğu dijital çözümler tek yerde.
        </p>

        <SearchBar />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/tools"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Araçları Keşfet
          </Link>

          <Link
            href="/tools/scale-calculator"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Ölçek Hesaplayıcı
          </Link>
        </div>
      </div>
    </section>
  );
}
