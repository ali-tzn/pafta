export default function Header() {
  return (
    <header className="border-b border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <h1 className="text-2xl font-bold tracking-wider text-cyan-400">
          PAFTA
        </h1>

        <nav className="flex gap-6 text-sm text-slate-300">
          <a href="#">Araçlar</a>
          <a href="#">Revit</a>
          <a href="#">CAD</a>
          <a href="#">Blog</a>
        </nav>
      </div>
    </header>
  );
}