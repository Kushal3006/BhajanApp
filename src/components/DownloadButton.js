"use client";

import { useState, useSyncExternalStore } from "react";
import {
  isBhajanDownloaded,
  subscribeToStorageChanges,
  toggleDownloadedBhajan,
} from "@/lib/storage";
import {
  downloadAudioFile,
  getOfflineAudioUrl,
  removeAudioFile,
} from "@/lib/offlineAudio";

export default function DownloadButton({ bhajan, compact = false }) {
  const isDownloaded = useSyncExternalStore(
    subscribeToStorageChanges,
    () => isBhajanDownloaded(bhajan.id),
    () => false
  );
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async () => {
    setIsBusy(true);
    setError("");

    try {
      if (isDownloaded) {
        await removeAudioFile(bhajan.id);
      } else {
        await downloadAudioFile(bhajan);
        const offlineUrl = await getOfflineAudioUrl(bhajan.id);
        if (!offlineUrl) {
          throw new Error("The audio file could not be saved for offline use.");
        }
      }

      await toggleDownloadedBhajan(bhajan);
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isBusy}
        className={
          compact
            ? `min-h-11 rounded-full border px-3 py-2 text-xs font-black transition ${
                isDownloaded
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:border-emerald-200 hover:text-emerald-700"
              }`
            : `min-h-12 rounded-2xl border px-4 py-2.5 text-sm font-black transition ${
                isDownloaded
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:border-emerald-200 hover:text-emerald-700"
              }`
        }
      >
        {isBusy ? "Preparing..." : isDownloaded ? "Downloaded" : "Download"}
      </button>
      {error && <span className="max-w-32 text-xs text-rose-600">{error}</span>}
    </>
  );
}
