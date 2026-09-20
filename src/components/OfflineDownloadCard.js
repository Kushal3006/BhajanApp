"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOfflineAudioUrl } from "@/lib/offlineAudio";
import { getLocalizedBhajan } from "@/lib/localizedContent";
import { useLanguage } from "@/components/LanguageProvider";

export default function OfflineDownloadCard({ bhajan }) {
  const { language } = useLanguage();
  const localizedBhajan = getLocalizedBhajan(bhajan, language);
  const [audioSource, setAudioSource] = useState(bhajan.audioUrl || "");
  const [isAudioAvailable, setIsAudioAvailable] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getOfflineAudioUrl(bhajan.id)
      .then((offlineUrl) => {
        if (isMounted && offlineUrl) {
          setAudioSource(offlineUrl);
          setIsAudioAvailable(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAudioAvailable(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [bhajan.audioUrl, bhajan.id]);

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <Link href={`/bhajan/${bhajan.slug}`} className="block transition hover:opacity-90">
        {bhajan.thumbnail ? (
          <img
            src={bhajan.thumbnail}
            alt={localizedBhajan.title}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-amber-100 text-amber-700">
            Bhakti
          </div>
        )}
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-800">
            Offline
          </span>
          <span className="text-sm font-bold text-stone-500">{bhajan.duration}</span>
        </div>
        <Link href={`/bhajan/${bhajan.slug}`} className="block">
          <h2 className="text-xl font-black leading-snug text-stone-950">
            {localizedBhajan.title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-stone-600">
            {bhajan.deity}
          </p>
        </Link>
        {isAudioAvailable ? (
          <audio controls preload="metadata" className="w-full" src={audioSource}>
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            Offline audio is unavailable. Connect to the internet and download it again.
          </p>
        )}
      </div>
    </article>
  );
}
