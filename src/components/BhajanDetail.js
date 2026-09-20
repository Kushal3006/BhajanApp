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
    <main className="min-h-screen bg-[#f7f4ee] px-4 pb-28 pt-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/browse"
          className="inline-flex min-h-12 items-center rounded-2xl border border-stone-200 bg-white px-5 text-sm font-black text-stone-700 shadow-sm transition hover:border-amber-200 hover:text-amber-700"
        >
          Back to bhajans
        </Link>

        <article className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[340px]">
              <img
                src={bhajan.thumbnail}
                alt={localizedBhajan.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-7">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-[0.12em]">
                    {bhajan.category}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                    {bhajan.language}
                  </span>
                </div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-100">
                  {bhajan.deity}
                </p>
                <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl">
                  {localizedBhajan.title}
                </h1>
              </div>
            </div>

            <div className="p-5 md:p-8">
              <div className="grid gap-3 border-b border-stone-200 pb-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-stone-500">
                    {t.duration}
                  </p>
                  <p className="mt-1 text-2xl font-black text-stone-950">
                    {bhajan.duration}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <FavoriteButton bhajan={bhajan} />
                  <DownloadButton bhajan={bhajan} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-black text-stone-800">
                    {t.audioPreview}
                  </p>
                  {isOfflineAudio && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                      {t.offline}
                    </span>
                  )}
                </div>
                <audio controls className="mt-4 w-full" src={audioSource}>
                  Your browser does not support the audio element.
                </audio>
              </div>

              <p className="mt-6 text-lg leading-8 text-stone-700">
                {localizedBhajan.description}
              </p>
            </div>
          </div>
        </article>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200 md:p-8">
          <h2 className="text-3xl font-black text-stone-950">{t.lyrics}</h2>
          <div className="mt-5 space-y-4 rounded-2xl bg-white p-1">
            {localizedBhajan.lyrics.map((line, index) => (
              <p
                key={`${bhajan.slug}-${index}`}
                className="rounded-2xl bg-stone-50 px-4 py-3 text-xl font-semibold leading-9 text-stone-800"
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
