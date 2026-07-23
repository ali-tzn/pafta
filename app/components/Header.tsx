import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="PAFTA ana sayfa">
          <Image
            src="/pafta-logo-white.png"
            alt="PAFTA"
            width={600}
            height={200}
            priority
            className="h-20 w-64 object-cover object-center"
          />
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <Link href="/" className="transition hover:text-white">
            Ana Sayfa
          </Link>

          <Link href="/tools" className="transition hover:text-white">
            Araçlar
          </Link>
        </nav>
      </div>
    </header>
  );
}