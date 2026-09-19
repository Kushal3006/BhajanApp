const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  { name: "Aarti", slug: "aarti" },
  { name: "Bhajan", slug: "bhajan" },
  { name: "Chalisa", slug: "chalisa" },
  { name: "Kirtan", slug: "kirtan" },
  { name: "Mantra", slug: "mantra" },
  { name: "Stotra", slug: "stotra" },
];

async function seed() {
  const { bhajanCatalog } = await import("../src/data/bhajans.js");
  const categoryByName = new Map();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });

    categoryByName.set(savedCategory.name, savedCategory);
  }

  for (const bhajan of bhajanCatalog) {
    const category = categoryByName.get(bhajan.category);

    if (!category) {
      throw new Error(`Missing category for bhajan: ${bhajan.title}`);
    }

    await prisma.bhajan.upsert({
      where: { slug: bhajan.slug },
      update: {
        title: bhajan.title,
        titleEn: bhajan.title,
        titleHi: bhajan.title,
        deity: bhajan.deity,
        language: bhajan.language,
        description: bhajan.description,
        descriptionEn: bhajan.description,
        descriptionHi: bhajan.description,
        lyrics: bhajan.lyrics.join("\n"),
        lyricsEn: bhajan.lyrics.join("\n"),
        lyricsHi: bhajan.lyrics.join("\n"),
        audioUrl: bhajan.audioUrl,
        thumbnailUrl: bhajan.thumbnail,
        duration: bhajan.duration,
        featured: bhajan.featured,
        categoryId: category.id,
        status: "PUBLISHED",
      },
      create: {
        slug: bhajan.slug,
        title: bhajan.title,
        titleEn: bhajan.title,
        titleHi: bhajan.title,
        deity: bhajan.deity,
        language: bhajan.language,
        description: bhajan.description,
        descriptionEn: bhajan.description,
        descriptionHi: bhajan.description,
        lyrics: bhajan.lyrics.join("\n"),
        lyricsEn: bhajan.lyrics.join("\n"),
        lyricsHi: bhajan.lyrics.join("\n"),
        audioUrl: bhajan.audioUrl,
        thumbnailUrl: bhajan.thumbnail,
        duration: bhajan.duration,
        featured: bhajan.featured,
        categoryId: category.id,
        status: "PUBLISHED",
      },
    });
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
