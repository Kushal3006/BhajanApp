"use client";

import { useSyncExternalStore } from "react";
import {
  isBhajanFavorite,
  subscribeToStorageChanges,
  toggleFavoriteId,
} from "@/lib/storage";

export default function FavoriteButton({ bhajan, compact = false }) {
  const isFavorite = useSyncExternalStore(
    subscribeToStorageChanges,
    () => isBhajanFavorite(bhajan.id),
    () => false
  );

  const handleToggle = async () => {
    await toggleFavoriteId(bhajan.id, bhajan);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={
        compact
          ? `rounded-full border px-3 py-2 text-xs font-semibold transition ${
              isFavorite
                ? "border-amber-600 bg-amber-600 text-white"
                : "border-stone-200 bg-white text-stone-700 hover:border-amber-200 hover:text-amber-700"
            }`
          : `rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
              isFavorite
                ? "border-amber-600 bg-amber-600 text-white"
                : "border-stone-200 bg-white text-stone-700 hover:border-amber-200 hover:text-amber-700"
            }`
      }
    >
      {isFavorite ? "Saved" : "Favorite"}
    </button>
  );
}
