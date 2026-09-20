"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { getLocalizedBhajan } from "@/lib/localizedContent";
import { getOfflineAudioUrl } from "@/lib/offlineAudio";
import { isBhajanDownloaded } from "@/lib/storage";

export default function BhajanCard({ bhajan }) {
  const { language } = useLanguage();
  const localizedBhajan = getLocalizedBhajan(bhajan, language);
  const audioRef = useRef(null);
  const [audioSource, setAudioSource] = useState(bhajan.audioUrl || "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function resolveAudioSource() {
      if (!isBhajanDownloaded(bhajan.id)) {
        return;
      }

      const offlineUrl = await getOfflineAudioUrl(bhajan.id).catch(() => null);
      if (isMounted && offlineUrl) {
        setAudioSource(offlineUrl);
      }
    }

    resolveAudioSource();
    return () => {
      isMounted = false;
    };
  }, [bhajan.id]);

  async function handlePlay(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!audioSource) {
      return;
    }

    setIsLoadingAudio(true);

    try {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        await audioRef.current?.play();
      }
    } catch {
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/bhajan/${bhajan.slug}`} className="hidden md:block">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={bhajan.thumbnail}
            alt={localizedBhajan.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-white">
            {bhajan.category}
          </span>
          <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {bhajan.duration}
          </span>
        </div>
      </Link>

      <div className="hidden space-y-4 p-4 md:block">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">
              {bhajan.deity}
            </p>
            <h3 className="mt-1 text-xl font-black leading-snug text-stone-950">
              {localizedBhajan.title}
            </h3>
          </div>
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
            {bhajan.language}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-stone-600">
          {localizedBhajan.description}
        </p>
        <button
          type="button"
          onClick={handlePlay}
          className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-amber-50 text-base font-black text-amber-800 transition hover:bg-amber-600 hover:text-white"
        >
          {isLoadingAudio ? "Loading..." : isPlaying ? "Pause" : "Play now"}
        </button>
      </div>

      <div className="flex items-center gap-3 p-3 md:hidden">
        <Link
          href={`/bhajan/${bhajan.slug}`}
          className="min-w-0 flex-1"
        >
          <div className="flex items-center gap-3">
            <img
              src={bhajan.thumbnail}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">
                {bhajan.deity}
              </p>
              <h3 className="truncate text-base font-black text-stone-950">
                {localizedBhajan.title}
              </h3>
              <p className="text-xs font-semibold text-stone-500">
                {bhajan.category} · {bhajan.duration}
              </p>
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`${isPlaying ? "Pause" : "Play"} ${localizedBhajan.title}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-600 text-lg font-black text-white shadow-md shadow-amber-200 transition hover:bg-amber-700"
        >
          {isLoadingAudio ? "…" : isPlaying ? "Ⅱ" : "▶"}
        </button>
      </div>

      <audio
        ref={audioRef}
        src={audioSource}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </article>
  );
}
