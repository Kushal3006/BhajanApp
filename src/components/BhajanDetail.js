"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DownloadButton from "@/components/DownloadButton";
import FavoriteButton from "@/components/FavoriteButton";
import { useLanguage } from "@/components/LanguageProvider";
import { getOfflineAudioUrl } from "@/lib/offlineAudio";
import { isBhajanDownloaded } from "@/lib/storage";
import { getLocalizedBhajan } from "@/lib/localizedContent";

export default function BhajanDetail({ bhajan }) {
  const { t, language } = useLanguage();
  const localizedBhajan = getLocalizedBhajan(bhajan, language);
  const [audioSource, setAudioSource] = useState(bhajan.audioUrl);
  const [isOfflineAudio, setIsOfflineAudio] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function resolveAudioSource() {
      if (!isBhajanDownloaded(bhajan.id)) {
        if (isMounted) {
          setAudioSource(bhajan.audioUrl);
          setIsOfflineAudio(false);
        }
        return;
      }

      try {
        const offlineUrl = await getOfflineAudioUrl(bhajan.id);

        if (isMounted) {
          setAudioSource(offlineUrl || bhajan.audioUrl);
          setIsOfflineAudio(Boolean(offlineUrl));
        }
      } catch {
        if (isMounted) {
          setAudioSource(bhajan.audioUrl);
          setIsOfflineAudio(false);
        }
      }
    }

    function refreshAudioSource() {
      resolveAudioSource();
    }

    resolveAudioSource();
    window.addEventListener("bhakti-storage-changed", refreshAudioSource);

    return () => {
      isMounted = false;
      window.removeEventListener("bhakti-storage-changed", refreshAudioSource);
    };
  }, [bhajan.audioUrl, bhajan.id]);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/browse"
          className="inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-200 hover:text-amber-700"
        >
          ← {t.backToBhajans}
        </Link>

        <article className="mt-8 overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-stone-200">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[300px]">
              <img
                src={bhajan.thumbnail}
                alt={localizedBhajan.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                    {bhajan.category}
                  </span>
                  <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {bhajan.language}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-100">
                  {bhajan.deity}
                </p>
                <h1 className="mt-2 text-3xl font-bold md:text-5xl">{localizedBhajan.title}</h1>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-stone-500">
                    {t.duration}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-stone-900">
                    {bhajan.duration}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FavoriteButton bhajan={bhajan} />
                  <DownloadButton bhajan={bhajan} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-stone-600">{t.audioPreview}</p>
                  {isOfflineAudio && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {t.offline}
                    </span>
                  )}
                </div>
                <audio controls className="mt-4 w-full" src={audioSource}>
                  Your browser does not support the audio element.
                </audio>
              </div>

              <p className="mt-6 text-base leading-8 text-stone-700">
                {localizedBhajan.description}
              </p>
            </div>
          </div>
        </article>

        <section className="mt-8 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-2xl font-bold text-stone-900">{t.lyrics}</h2>
          <div className="mt-6 space-y-4 rounded-2xl bg-amber-50 p-6">
            {localizedBhajan.lyrics.map((line, index) => (
              <p
                key={`${bhajan.slug}-${index}`}
                className="text-lg leading-8 text-stone-800"
              >
                {line}
              </p>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
