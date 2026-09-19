import { prisma } from "@/lib/prisma";

function toBhajanViewModel(bhajan) {
  return {
    id: bhajan.id,
    slug: bhajan.slug,
    title: bhajan.title,
    titleEn: bhajan.titleEn || "",
    titleHi: bhajan.titleHi || "",
    titleGu: bhajan.titleGu || "",
    deity: bhajan.deity,
    category: bhajan.category.name,
    language: bhajan.language,
    duration: bhajan.duration || "",
    featured: bhajan.featured,
    description: bhajan.description || "",
    descriptionEn: bhajan.descriptionEn || "",
    descriptionHi: bhajan.descriptionHi || "",
    descriptionGu: bhajan.descriptionGu || "",
    thumbnail: bhajan.thumbnailUrl || "",
    audioUrl: bhajan.audioUrl || "",
    lyrics: bhajan.lyrics ? bhajan.lyrics.split("\n").filter(Boolean) : [],
    lyricsEn: bhajan.lyricsEn || "",
    lyricsHi: bhajan.lyricsHi || "",
    lyricsGu: bhajan.lyricsGu || "",
  };
}

export async function getPublishedBhajans() {
  const bhajans = await prisma.bhajan.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return bhajans.map(toBhajanViewModel);
}

export async function getPublishedBhajanBySlug(slug) {
  const bhajan = await prisma.bhajan.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true },
  });

  return bhajan ? toBhajanViewModel(bhajan) : null;
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}
