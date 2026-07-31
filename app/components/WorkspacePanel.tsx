"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { FAVORITE_STORAGE_KEY, RECENT_STORAGE_KEY, WORKSPACE_EVENT, workspaceItemMap, type RecentWorkspaceItem } from "@/lib/workspace";

function subscribe(callback: () => void) { window.addEventListener(WORKSPACE_EVENT, callback); window.addEventListener("storage", callback); return () => { window.removeEventListener(WORKSPACE_EVENT, callback); window.removeEventListener("storage", callback); }; }
function snapshot() { return `${window.localStorage.getItem(FAVORITE_STORAGE_KEY) ?? "[]"}|${window.localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]"}`; }

export default function WorkspacePanel() {
  const data = useSyncExternalStore(subscribe, snapshot, () => "[]|[]");
  const separator = data.indexOf("|");
  let favoritePaths: string[] = []; let recent: RecentWorkspaceItem[] = [];
  try { favoritePaths = JSON.parse(data.slice(0, separator)); recent = JSON.parse(data.slice(separator + 1)); } catch {}
  const favorites = favoritePaths.map((href) => workspaceItemMap.get(href) ?? { href, title: href.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? href, category: "İçerik", icon: "★" });
  const recents = recent.map((entry) => workspaceItemMap.get(entry.href) ?? { href: entry.href, title: entry.title ?? entry.href.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? entry.href, category: entry.category ?? "İçerik", icon: "↗" });
  if (!favorites.length && !recents.length) return null;
  return <section className="px-4 py-8 sm:px-6"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">{favorites.length > 0 && <List title="Favorilerin" items={favorites.slice(0, 4)} icon="★" />}{recents.length > 0 && <List title="Son baktıkların" items={recents.slice(0, 4)} icon="↺" />}</div></section>;
}

function List({ title, items, icon }: { title: string; icon: string; items: { href: string; title: string; category: string }[] }) { return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h2 className="text-sm font-semibold text-slate-200"><span className="mr-2 text-cyan-400">{icon}</span>{title}</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{items.map((item) => <Link key={item.href} href={item.href} className="rounded-xl bg-slate-950 px-3 py-2.5 text-sm transition hover:text-cyan-300"><span className="block truncate font-medium capitalize">{item.title}</span><span className="text-xs text-slate-500">{item.category}</span></Link>)}</div></div>; }
