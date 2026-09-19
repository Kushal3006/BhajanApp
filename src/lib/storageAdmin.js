import { getSupabaseAdminClient } from "@/lib/supabase";

const bucketNames = {
  audio: () => process.env.SUPABASE_STORAGE_AUDIO_BUCKET || "audio",
  image: () => process.env.SUPABASE_STORAGE_IMAGE_BUCKET || "images",
};

function getConfiguredBucket(kind) {
  if (!bucketNames[kind]) {
    throw new Error("Storage type must be audio or image.");
  }

  return bucketNames[kind]();
}

export function getStoragePathFromPublicUrl(url, kind) {
  if (!url || !bucketNames[kind]) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const marker = `/storage/v1/object/public/${getConfiguredBucket(kind)}/`;
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex < 0) {
      return null;
    }

    return decodeURIComponent(parsedUrl.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function deleteStorageObject(kind, path) {
  if (!path) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  const bucket = getConfiguredBucket(kind);
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteStorageObjectFromPublicUrl(url, kind) {
  const path = getStoragePathFromPublicUrl(url, kind);

  if (path) {
    await deleteStorageObject(kind, path);
  }
}
