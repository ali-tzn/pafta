import Hero from "./components/Hero";
import Categories from "./components/Categories";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Hero />
      <Categories />
    </main>
  );
}