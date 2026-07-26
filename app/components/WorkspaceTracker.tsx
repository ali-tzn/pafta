"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { trackToolEvent } from "@/lib/analytics";
import {
  FAVORITE_STORAGE_KEY,
  RECENT_STORAGE_KEY,
  WORKSPACE_EVENT,
  workspaceItemMap,
  type RecentWorkspaceItem,
} from "@/lib/workspace";

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function notifyWorkspaceUpdate() {
  window.dispatchEvent(new Event(WORKSPACE_EVENT));
}

export default function WorkspaceTracker() {
  const pathname = usePathname();
  const currentItem = workspaceItemMap.get(pathname);
  const favoritesJson = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(WORKSPACE_EVENT, onStoreChange);
      window.addEventListener("storage", onStoreChange);
      return () => {
        window.removeEventListener(WORKSPACE_EVENT, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => window.localStorage.getItem(FAVORITE_STORAGE_KEY) ?? "[]",
    () => "[]"
  );
  const isFavorite = currentItem
    ? (JSON.parse(favoritesJson) as string[]).includes(currentItem.href)
    : false;

  useEffect(() => {
    if (!currentItem) return;
    const recent = readJson<RecentWorkspaceItem[]>(RECENT_STORAGE_KEY, [])
      .filter((item) => item.href !== currentItem.href);
    const updated = [
      { href: currentItem.href, visitedAt: Date.now() },
      ...recent,
    ].slice(0, 6);
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    notifyWorkspaceUpdate();
  }, [currentItem]);

  if (!currentItem) return null;

  function toggleFavorite() {
    const favorites = readJson<string[]>(FAVORITE_STORAGE_KEY, []);
    const willBeFavorite = !favorites.includes(currentItem!.href);
    const updated = willBeFavorite
      ? [currentItem!.href, ...favorites].slice(0, 12)
      : favorites.filter((href) => href !== currentItem!.href);
    window.localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(updated));
    notifyWorkspaceUpdate();
    trackToolEvent("workspace", willBeFavorite ? "favorite_added" : "favorite_removed", {
      href: currentItem!.href,
    });
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-pressed={isFavorite}
      className={`fixed bottom-4 right-4 z-40 flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-xl backdrop-blur transition max-sm:w-11 max-sm:px-0 ${
        isFavorite
          ? "border-amber-300/50 bg-amber-300 text-slate-950"
          : "border-slate-700 bg-slate-950/95 text-slate-200 hover:border-amber-300/60 hover:text-amber-200"
      }`}
    >
      <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
      <span className="hidden sm:inline">
        {isFavorite ? "Favorilerde" : "Favoriye ekle"}
      </span>
    </button>
  );
}
