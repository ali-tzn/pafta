import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" aria-label="PAFTA ana sayfa">
            <Image
              src="/pafta-logo-white.png"
              alt="PAFTA"
              width={600}
              height={200}
              className="h-16 w-52 object-cover object-center"
            />
          </Link>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            Mimarlık öğrencileri için hesaplama araçları, Revit, BIM ve proje
            kaynakları.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-white">
            Ana Sayfa
          </Link>

          <Link href="/tools" className="transition hover:text-white">
            Araçlar
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-800 px-6 py-4 text-center text-sm text-slate-500">
        © 2026 PAFTA. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}