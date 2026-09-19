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
    <article className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm">
      <Link href={`/bhajan/${bhajan.slug}`} className="block transition hover:opacity-90">
        {bhajan.thumbnail ? (
          <img src={bhajan.thumbnail} alt={localizedBhajan.title} className="h-48 w-full object-cover" />
        ) : (
          <div className="flex h-48 items-center justify-center bg-amber-100 text-amber-700">
            Bhakti
          </div>
        )}
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            Offline
          </span>
          <span className="text-xs font-medium text-stone-500">{bhajan.duration}</span>
        </div>
        <Link href={`/bhajan/${bhajan.slug}`} className="block">
          <h2 className="text-xl font-bold text-stone-900">{localizedBhajan.title}</h2>
          <p className="text-sm text-stone-600">{bhajan.deity}</p>
        </Link>
        {isAudioAvailable ? (
          <audio controls preload="metadata" className="w-full" src={audioSource}>
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p className="text-sm text-rose-600">
            Offline audio is unavailable. Connect to the internet and download it again.
          </p>
        )}
      </div>
    </article>
  );
}
