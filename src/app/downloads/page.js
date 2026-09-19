"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OfflineDownloadCard from "@/components/OfflineDownloadCard";
import { useLanguage } from "@/components/LanguageProvider";
import { getDownloadedBhajans } from "@/lib/storage";

export default function DownloadsPage() {
  const { t } = useLanguage();
  const [downloadedBhajans, setDownloadedBhajans] = useState([]);

  useEffect(() => {
    const refreshDownloads = () => {
      setDownloadedBhajans(getDownloadedBhajans());
    };

    refreshDownloads();
    window.addEventListener("bhakti-storage-changed", refreshDownloads);

    return () => {
      window.removeEventListener("bhakti-storage-changed", refreshDownloads);
    };
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">{t.offline}</p>
            <h1 className="mt-2 text-3xl font-bold text-stone-900">{t.downloads}</h1>
            <p className="mt-2 text-sm text-stone-600">Available on this device without internet.</p>
          </div>
          <Link href="/browse" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-200 hover:text-amber-700">
            {t.browse}
          </Link>
        </header>

        {downloadedBhajans.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {downloadedBhajans.map((bhajan) => (
              <OfflineDownloadCard key={bhajan.id} bhajan={bhajan} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-stone-800">{t.noDownloads}</p>
            <p className="mt-2 text-stone-600">{t.noDownloadsHint}</p>
          </div>
        )}
      </div>
    </main>
  );
}
