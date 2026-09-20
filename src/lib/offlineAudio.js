import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

const AUDIO_CACHE_NAME = "bhakti-offline-audio-v1";

function getAudioPath(bhajanId) {
  return `audio/${String(bhajanId)}.mp3`;
}

function getWebAudioCacheKey(bhajanId) {
  return `https://bhakti.local/offline-audio/${String(bhajanId)}`;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = String(reader.result || "");
      const separatorIndex = result.indexOf(",");
      resolve(separatorIndex >= 0 ? result.slice(separatorIndex + 1) : result);
    };
    reader.onerror = () => reject(new Error("Unable to prepare audio for offline storage."));
    reader.readAsDataURL(blob);
  });
}

export function isNativeAudioStorageAvailable() {
  return Capacitor.isNativePlatform();
}

export async function downloadAudioFile(bhajan) {
  if (!bhajan.audioUrl) {
    throw new Error("This bhajan does not have an audio file.");
  }

  const response = await fetch(bhajan.audioUrl);

  if (!response.ok) {
    throw new Error(`Audio download failed with status ${response.status}.`);
  }

  if (!isNativeAudioStorageAvailable()) {
    if (!("caches" in window)) {
      throw new Error("Offline audio storage is not available in this browser.");
    }

    const cache = await window.caches.open(AUDIO_CACHE_NAME);
    await cache.put(getWebAudioCacheKey(bhajan.id), response.clone());
    return getWebAudioCacheKey(bhajan.id);
  }

  const base64Data = await blobToBase64(await response.blob());
  const path = getAudioPath(bhajan.id);

  await Filesystem.writeFile({
    path,
    data: base64Data,
    directory: Directory.Data,
    recursive: true,
  });

  return path;
}

export async function removeAudioFile(bhajanId) {
  if (!isNativeAudioStorageAvailable()) {
    if ("caches" in window) {
      const cache = await window.caches.open(AUDIO_CACHE_NAME);
      await cache.delete(getWebAudioCacheKey(bhajanId));
    }
    return;
  }

  try {
    await Filesystem.deleteFile({
      path: getAudioPath(bhajanId),
      directory: Directory.Data,
    });
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    if (!message.includes("not found") && !message.includes("does not exist")) {
      throw error;
    }
  }
}

export async function getOfflineAudioUrl(bhajanId) {
  if (!isNativeAudioStorageAvailable()) {
    if (!("caches" in window)) {
      return null;
    }

    const cache = await window.caches.open(AUDIO_CACHE_NAME);
    const response = await cache.match(getWebAudioCacheKey(bhajanId));

    if (!response) {
      return null;
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  try {
    const { uri } = await Filesystem.getUri({
      path: getAudioPath(bhajanId),
      directory: Directory.Data,
    });

    return Capacitor.convertFileSrc(uri);
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("not found") || message.includes("does not exist")) {
      return null;
    }

    throw error;
  }
}
