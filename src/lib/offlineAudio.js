import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

function getAudioPath(bhajanId) {
  return `audio/${String(bhajanId)}.mp3`;
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
  if (!isNativeAudioStorageAvailable()) {
    return null;
  }

  if (!bhajan.audioUrl) {
    throw new Error("This bhajan does not have an audio file.");
  }

  const response = await fetch(bhajan.audioUrl);

  if (!response.ok) {
    throw new Error(`Audio download failed with status ${response.status}.`);
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
    return null;
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
