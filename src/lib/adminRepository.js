import { prisma } from "@/lib/prisma";
import {
  deleteStorageObjectFromPublicUrl,
} from "@/lib/storageAdmin";

const allowedStatuses = new Set(["DRAFT", "PUBLISHED", "ARCHIVED"]);

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeBhajanInput(input) {
  const titleEn = String(input.titleEn || "").trim();
  const titleHi = String(input.titleHi || "").trim();
  const titleGu = String(input.titleGu || "").trim();
  const title = String(input.title || titleEn || titleHi || titleGu || "").trim();
  const slug = normalizeSlug(input.slug || title);
  const deity = String(input.deity || "").trim();
  const lyricsEn = String(input.lyricsEn || "").trim();
  const lyricsHi = String(input.lyricsHi || "").trim();
  const lyricsGu = String(input.lyricsGu || "").trim();
  const lyrics = String(input.lyrics || lyricsEn || lyricsHi || lyricsGu || "").trim();
  const categoryId = String(input.categoryId || "").trim();
  const status = String(input.status || "DRAFT").toUpperCase();

  if (!title || !slug || !deity || !lyrics || !categoryId) {
    throw Object.assign(
      new Error("Title, slug, deity, lyrics, and category are required."),
      { status: 400 }
    );
  }

  if (!allowedStatuses.has(status)) {
    throw Object.assign(new Error("Invalid content status."), { status: 400 });
  }

  return {
    title,
    titleEn: titleEn || null,
    titleHi: titleHi || null,
    titleGu: titleGu || null,
    slug,
    deity,
    lyrics,
    lyricsEn: lyricsEn || null,
    lyricsHi: lyricsHi || null,
    lyricsGu: lyricsGu || null,
    categoryId,
    status,
    language: String(input.language || "Hindi").trim(),
    description: String(
      input.description || input.descriptionEn || input.descriptionHi || input.descriptionGu || ""
    ).trim() || null,
    descriptionEn: String(input.descriptionEn || "").trim() || null,
    descriptionHi: String(input.descriptionHi || "").trim() || null,
    descriptionGu: String(input.descriptionGu || "").trim() || null,
    audioUrl: String(input.audioUrl || "").trim() || null,
    thumbnailUrl: String(input.thumbnailUrl || "").trim() || null,
    duration: String(input.duration || "").trim() || null,
    featured: Boolean(input.featured),
  };
}

export async function listAdminBhajans() {
  return prisma.bhajan.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function listAdminCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createAdminBhajan(input) {
  const data = normalizeBhajanInput(input);
  return prisma.bhajan.create({
    data,
    include: { category: true },
  });
}

export async function updateAdminBhajan(id, input) {
  const data = normalizeBhajanInput(input);
  const existingBhajan = await prisma.bhajan.findUnique({
    where: { id },
    select: { audioUrl: true, thumbnailUrl: true },
  });

  if (!existingBhajan) {
    throw Object.assign(new Error("Bhajan not found."), { status: 404 });
  }

  const updatedBhajan = await prisma.bhajan.update({
    where: { id },
    data,
    include: { category: true },
  });

  const cleanupTasks = [];

  if (existingBhajan.audioUrl && existingBhajan.audioUrl !== data.audioUrl) {
    cleanupTasks.push(
      deleteStorageObjectFromPublicUrl(existingBhajan.audioUrl, "audio")
    );
  }

  if (
    existingBhajan.thumbnailUrl &&
    existingBhajan.thumbnailUrl !== data.thumbnailUrl
  ) {
    cleanupTasks.push(
      deleteStorageObjectFromPublicUrl(existingBhajan.thumbnailUrl, "image")
    );
  }

  const cleanupResults = await Promise.allSettled(cleanupTasks);
  const cleanupFailure = cleanupResults.find(
    (result) => result.status === "rejected"
  );

  if (cleanupFailure) {
    console.error("Media cleanup failed after bhajan update.", cleanupFailure.reason);
  }

  return updatedBhajan;
}

export async function updateBhajanStatus(id, status) {
  const normalizedStatus = String(status || "").toUpperCase();

  if (!allowedStatuses.has(normalizedStatus)) {
    throw Object.assign(new Error("Invalid content status."), { status: 400 });
  }

  return prisma.bhajan.update({
    where: { id },
    data: { status: normalizedStatus },
    include: { category: true },
  });
}

export async function deleteAdminBhajan(id) {
  const existingBhajan = await prisma.bhajan.findUnique({
    where: { id },
    select: { audioUrl: true, thumbnailUrl: true },
  });

  if (!existingBhajan) {
    throw Object.assign(new Error("Bhajan not found."), { status: 404 });
  }

  await prisma.bhajan.delete({
    where: { id },
  });

  const cleanupTasks = [];

  if (existingBhajan.audioUrl) {
    cleanupTasks.push(
      deleteStorageObjectFromPublicUrl(existingBhajan.audioUrl, "audio")
    );
  }

  if (existingBhajan.thumbnailUrl) {
    cleanupTasks.push(
      deleteStorageObjectFromPublicUrl(existingBhajan.thumbnailUrl, "image")
    );
  }

  const cleanupResults = await Promise.allSettled(cleanupTasks);
  const cleanupFailure = cleanupResults.find(
    (result) => result.status === "rejected"
  );

  if (cleanupFailure) {
    console.error("Media cleanup failed after bhajan deletion.", cleanupFailure.reason);
  }

  return { deleted: true };
}

export async function createAdminCategory(input) {
  const name = String(input.name || "").trim();
  const slug = String(input.slug || name).trim().toLowerCase();

  if (!name || !slug) {
    throw Object.assign(new Error("Category name and slug are required."), {
      status: 400,
    });
  }

  return prisma.category.create({
    data: { name, slug },
  });
}
