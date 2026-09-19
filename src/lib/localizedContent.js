const languageSuffixes = {
  en: "En",
  hi: "Hi",
  gu: "Gu",
};

function getLanguageCandidates(language) {
  const normalizedLanguage = String(language || "en").toLowerCase();
  const suffix = languageSuffixes[normalizedLanguage] || "En";

  return [suffix, "Hi", "Gu", "En"];
}

export function getLocalizedText(content, field, language, fallback = "") {
  for (const suffix of getLanguageCandidates(language)) {
    const value = content?.[`${field}${suffix}`];
    if (Array.isArray(value) && value.length > 0) {
      return value.join("\n");
    }
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  const legacyValue = content?.[field];
  if (Array.isArray(legacyValue)) {
    return legacyValue.join("\n");
  }
  return typeof legacyValue === "string" ? legacyValue : fallback;
}

export function getLocalizedBhajan(content, language) {
  const lyrics = getLocalizedText(content, "lyrics", language);

  return {
    ...content,
    title: getLocalizedText(content, "title", language, content?.title || ""),
    description: getLocalizedText(content, "description", language),
    lyrics: lyrics.split("\n").filter(Boolean),
  };
}
