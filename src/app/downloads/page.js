"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import OfflineDownloadCard from "@/components/OfflineDownloadCard";
import { useLanguage } from "@/components/LanguageProvider";
import { getDownloadedBhajans, subscribeToStorageChanges } from "@/lib/storage";

export default function DownloadsPage() {
  const { t } = useLanguage();
  const downloadedBhajans = useSyncExternalStore(
    subscribeToStorageChanges,
    getDownloadedBhajans,
    () => []
  );

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 pb-28 pt-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
              {t.offline}
            </p>
            <h1 className="mt-2 text-4xl font-black text-stone-950 md:text-5xl">
              {t.downloads}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-stone-600">
              Available on this device without internet.
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-amber-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-amber-700"
          >
            {t.browse}
          </Link>
        </header>

        {downloadedBhajans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {downloadedBhajans.map((bhajan) => (
              <OfflineDownloadCard key={bhajan.id} bhajan={bhajan} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm md:p-12">
            <p className="text-2xl font-black text-stone-900">
              {t.noDownloads}
            </p>
            <p className="mx-auto mt-2 max-w-md text-base leading-7 text-stone-600">
              {t.noDownloadsHint}
            </p>
            <Link
              href="/browse"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-amber-600 px-6 text-sm font-black text-white"
            >
              {t.browse}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
