"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { trackToolEvent } from "@/lib/analytics";
import {
  FAVORITE_STORAGE_KEY,
  RECENT_STORAGE_KEY,
  WORKSPACE_EVENT,
  workspaceItemMap,
  type RecentWorkspaceItem,
  type WorkspaceItem,
} from "@/lib/workspace";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(WORKSPACE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(WORKSPACE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return JSON.stringify({
    recent: window.localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]",
    favorites: window.localStorage.getItem(FAVORITE_STORAGE_KEY) ?? "[]",
  });
}

const serverSnapshot = JSON.stringify({ recent: "[]", favorites: "[]" });

export default function WorkspaceDashboard() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
  const stored = JSON.parse(snapshot) as { recent: string; favorites: string };
  const recentHrefs = (JSON.parse(stored.recent) as RecentWorkspaceItem[])
    .map((entry) => entry.href);
  const favoriteHrefs = JSON.parse(stored.favorites) as string[];

  const favorites = favoriteHrefs
    .map((href) => workspaceItemMap.get(href))
    .filter((item): item is WorkspaceItem => Boolean(item));
  const recent = recentHrefs
    .filter((href) => !favoriteHrefs.includes(href))
    .map((href) => workspaceItemMap.get(href))
    .filter((item): item is WorkspaceItem => Boolean(item))
    .slice(0, 6);

  if (favorites.length === 0 && recent.length === 0) return null;

  function removeFavorite(href: string) {
    const updated = favoriteHrefs.filter((favoriteHref) => favoriteHref !== href);
    window.localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(WORKSPACE_EVENT));
  }

  function clearRecent() {
    window.localStorage.removeItem(RECENT_STORAGE_KEY);
    window.dispatchEvent(new Event(WORKSPACE_EVENT));
    trackToolEvent("workspace", "recent_cleared");
  }

  return (
    <section className="px-4 pb-4 pt-1 text-white sm:px-6 sm:pb-5">
      <div className="mx-auto max-w-7xl rounded-2xl border border-violet-400/20 bg-violet-400/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">
              PAFTA Çalışma Masam
            </p>
            <h2 className="mt-1.5 text-xl font-bold">Kaldığın yerden devam et</h2>
            <p className="mt-1 text-xs text-slate-500">
              Yalnızca bu cihazdaki tarayıcıda saklanır.
            </p>
          </div>
          {recent.length > 0 && (
            <button
              type="button"
              onClick={clearRecent}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-900 hover:text-white"
            >
              Geçmişi temizle
            </button>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              ★ Favoriler
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((item) => (
                <WorkspaceCard
                  key={item.href}
                  item={item}
                  onRemove={() => removeFavorite(item.href)}
                />
              ))}
            </div>
          </div>
        )}

        {recent.length > 0 && (
          <div className={favorites.length > 0 ? "mt-5" : "mt-4"}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Son kullanılanlar
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((item) => (
                <WorkspaceCard key={item.href} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function WorkspaceCard({
  item,
  onRemove,
}: {
  item: WorkspaceItem;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950">
      <Link
        href={item.href}
        onClick={() =>
          trackToolEvent("workspace", "recent_opened", { href: item.href })
        }
        className="group flex min-w-0 flex-1 items-center gap-3 px-3 py-3"
      >
        <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-900 px-1 text-xs font-bold text-cyan-300">
          {item.icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold group-hover:text-cyan-300">
            {item.title}
          </span>
          <span className="mt-0.5 block text-[11px] text-slate-500">{item.category}</span>
        </span>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${item.title} aracını favorilerden çıkar`}
          className="mr-2 rounded-lg px-2 py-2 text-amber-300 hover:bg-slate-900"
        >
          ★
        </button>
      )}
    </div>
  );
}
