"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { bhajanCatalog } from "@/data/bhajans";
import { getLocalizedBhajan } from "@/lib/localizedContent";
import { getFavoriteIds, subscribeToStorageChanges } from "@/lib/storage";

export default function FavoritesPage() {
  const { t, language } = useLanguage();
  const favoriteIds = useSyncExternalStore(
    subscribeToStorageChanges,
    getFavoriteIds,
    () => []
  );

  const favorites = bhajanCatalog.filter((bhajan) =>
    favoriteIds.includes(String(bhajan.id))
  );

  return (
    <main className="min-h-screen bg-stone-50 px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">{t.saved}</p>
            <h1 className="mt-2 text-3xl font-bold text-stone-900">{t.favorites}</h1>
          </div>
          <Link
            href="/browse"
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-200 hover:text-amber-700"
          >
            {t.browse}
          </Link>
        </header>

        {favorites.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((bhajan) => {
              const localizedBhajan = getLocalizedBhajan(bhajan, language);

              return <Link
                key={bhajan.id}
                href={`/bhajan/${bhajan.slug}`}
                className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img src={bhajan.thumbnail} alt={localizedBhajan.title} className="h-48 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                      {bhajan.category}
                    </span>
                    <span className="text-xs font-medium text-stone-500">{bhajan.duration}</span>
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">{localizedBhajan.title}</h2>
                  <p className="text-sm text-stone-600">{bhajan.deity}</p>
                </div>
              </Link>;
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-stone-800">{t.noFavorites}</p>
            <p className="mt-2 text-stone-600">{t.noFavoritesHint}</p>
          </div>
        )}
      </div>
    </main>
  );
}
