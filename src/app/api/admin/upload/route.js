import { assertAdminRequest, adminErrorResponse } from "@/lib/adminAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  deleteStorageObject,
  deleteStorageObjectFromPublicUrl,
} from "@/lib/storageAdmin";

export const runtime = "nodejs";

const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const allowedTypes = {
  audio: new Set(["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg"]),
  image: new Set(["image/jpeg", "image/png", "image/webp"]),
};

function getUploadConfig(kind) {
  if (kind === "audio") {
    return {
      bucket: process.env.SUPABASE_STORAGE_AUDIO_BUCKET || "audio",
      maxBytes: MAX_AUDIO_BYTES,
    };
  }

  if (kind === "image") {
    return {
      bucket: process.env.SUPABASE_STORAGE_IMAGE_BUCKET || "images",
      maxBytes: MAX_IMAGE_BYTES,
    };
  }

  throw Object.assign(new Error("Upload type must be audio or image."), {
    status: 400,
  });
}

export async function POST(request) {
  try {
    await assertAdminRequest(request);

    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") || "");

    if (!file || typeof file.arrayBuffer !== "function") {
      throw Object.assign(new Error("A file is required."), { status: 400 });
    }

    const config = getUploadConfig(kind);

    if (!allowedTypes[kind].has(file.type)) {
      throw Object.assign(new Error(`Unsupported ${kind} file type.`), {
        status: 400,
      });
    }

    if (file.size > config.maxBytes) {
      throw Object.assign(new Error(`${kind} file is too large.`), {
        status: 413,
      });
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9-_]/gi, "-")
      .toLowerCase()
      .slice(0, 80);
    const path = `${kind}/${Date.now()}-${safeName || "upload"}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(config.bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from(config.bucket).getPublicUrl(path);

    return Response.json({ url: data.publicUrl, path, bucket: config.bucket });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request) {
  try {
    await assertAdminRequest(request);
    const body = await request.json();
    const kind = String(body.kind || "");
    const path = String(body.path || "");
    const url = String(body.url || "");

    if (!path && !url) {
      throw Object.assign(new Error("Storage path or URL is required."), {
        status: 400,
      });
    }

    if (path) {
      await deleteStorageObject(kind, path);
    } else {
      await deleteStorageObjectFromPublicUrl(url, kind);
    }

    return Response.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
