const STORAGE_KEYS = {
  favorites: "bhakti-favorites",
  downloads: "bhakti-downloads",
  language: "bhakti-language",
};

const DATABASE_NAME = "bhakti-offline";
const DATABASE_VERSION = 1;
const STORE_NAME = "metadata";
const MIGRATION_KEY = "migration-version";
const MIGRATION_VERSION = "1";

const snapshot = {
  favorites: [],
  favoriteBhajans: [],
  downloads: [],
  language: "en",
};

let databasePromise;
let initializationPromise;
const listeners = new Set();

function isBrowser() {
  return typeof window !== "undefined";
}

function readLegacyValue(key, fallback) {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function readLegacyString(key, fallback = "") {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function normalizeLanguage(language) {
  return ["en", "hi", "gu"].includes(language) ? language : "en";
}

function normalizeDownloads(downloads) {
  if (!Array.isArray(downloads)) {
    return [];
  }

  return downloads
    .filter((bhajan) => bhajan && bhajan.id != null)
    .map((bhajan) => ({
      id: bhajan.id,
      slug: bhajan.slug || "",
      title: bhajan.title || "",
      titleEn: bhajan.titleEn || "",
      titleHi: bhajan.titleHi || "",
      titleGu: bhajan.titleGu || "",
      deity: bhajan.deity || "",
      category: bhajan.category || "",
      thumbnail: bhajan.thumbnail || "",
      duration: bhajan.duration || "",
      language: bhajan.language || "",
      description: bhajan.description || "",
      descriptionEn: bhajan.descriptionEn || "",
      descriptionHi: bhajan.descriptionHi || "",
      descriptionGu: bhajan.descriptionGu || "",
      lyrics: Array.isArray(bhajan.lyrics) ? bhajan.lyrics : [],
      lyricsEn: bhajan.lyricsEn || "",
      lyricsHi: bhajan.lyricsHi || "",
      lyricsGu: bhajan.lyricsGu || "",
      audioUrl: bhajan.audioUrl || "",
    }));
}

function normalizeBhajanMetadata(bhajans) {
  if (!Array.isArray(bhajans)) {
    return [];
  }

  return bhajans
    .filter((bhajan) => bhajan && bhajan.id != null)
    .map((bhajan) => ({
      id: bhajan.id,
      slug: bhajan.slug || "",
      title: bhajan.title || "",
      titleEn: bhajan.titleEn || "",
      titleHi: bhajan.titleHi || "",
      titleGu: bhajan.titleGu || "",
      deity: bhajan.deity || "",
      category: bhajan.category || "",
      thumbnail: bhajan.thumbnail || "",
      duration: bhajan.duration || "",
      language: bhajan.language || "",
      description: bhajan.description || "",
      descriptionEn: bhajan.descriptionEn || "",
      descriptionHi: bhajan.descriptionHi || "",
      descriptionGu: bhajan.descriptionGu || "",
      lyrics: Array.isArray(bhajan.lyrics) ? bhajan.lyrics : [],
      lyricsEn: bhajan.lyricsEn || "",
      lyricsHi: bhajan.lyricsHi || "",
      lyricsGu: bhajan.lyricsGu || "",
      audioUrl: bhajan.audioUrl || "",
    }));
}

function normalizeFavorites(favorites) {
  if (!Array.isArray(favorites)) {
    return [];
  }

  return [...new Set(favorites.filter((id) => id != null).map(String))];
}

function emitChange() {
  listeners.forEach((listener) => listener());

  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent("bhakti-storage-changed"));
  }
}

function openDatabase() {
  if (!isBrowser() || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB is unavailable"));
  }

  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Unable to open offline storage"));
    });
  }

  return databasePromise;
}

function readDatabaseValue(database, key) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function writeDatabaseValues(database, values) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    Object.entries(values).forEach(([key, value]) => store.put(value, key));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function initializeStorage() {
  if (!isBrowser()) {
    return;
  }

  const legacyFavorites = normalizeFavorites(
    readLegacyValue(STORAGE_KEYS.favorites, [])
  );
  const legacyDownloads = normalizeDownloads(
    readLegacyValue(STORAGE_KEYS.downloads, [])
  );
  const legacyLanguage = normalizeLanguage(
    readLegacyString(STORAGE_KEYS.language)
  );

  try {
    const database = await openDatabase();
    const migrationVersion = await readDatabaseValue(database, MIGRATION_KEY);
    const storedFavorites = await readDatabaseValue(database, "favorites");
    const storedFavoriteBhajans = await readDatabaseValue(
      database,
      "favoriteBhajans"
    );
    const storedDownloads = await readDatabaseValue(database, "downloads");
    const storedLanguage = await readDatabaseValue(database, "language");

    const shouldMigrate = migrationVersion !== MIGRATION_VERSION;
    snapshot.favorites = normalizeFavorites(
      shouldMigrate && legacyFavorites.length > 0
        ? legacyFavorites
        : storedFavorites || []
    );
    snapshot.favoriteBhajans = normalizeBhajanMetadata(
      storedFavoriteBhajans || []
    );
    snapshot.downloads = normalizeDownloads(
      shouldMigrate && legacyDownloads.length > 0
        ? legacyDownloads
        : storedDownloads || []
    );
    snapshot.language = normalizeLanguage(
      shouldMigrate && readLegacyString(STORAGE_KEYS.language)
        ? legacyLanguage
        : storedLanguage || "en"
    );

    await writeDatabaseValues(database, {
      favorites: snapshot.favorites,
      favoriteBhajans: snapshot.favoriteBhajans,
      downloads: snapshot.downloads,
      language: snapshot.language,
      [MIGRATION_KEY]: MIGRATION_VERSION,
    });
  } catch {
    // The in-memory snapshot keeps the app usable if browser storage is blocked.
    snapshot.favorites = legacyFavorites;
    snapshot.favoriteBhajans = [];
    snapshot.downloads = legacyDownloads;
    snapshot.language = legacyLanguage;
  }

  emitChange();
}

function ensureInitialized() {
  if (!initializationPromise) {
    initializationPromise = initializeStorage();
  }
  return initializationPromise;
}

async function persist(values) {
  try {
    const database = await openDatabase();
    await writeDatabaseValues(database, values);
  } catch {
    // IndexedDB can be unavailable in private or restricted WebViews.
  }
}

export function subscribeToStorageChanges(listener) {
  if (!isBrowser()) {
    return () => {};
  }

  ensureInitialized();
  listeners.add(listener);
  const handleStorageChange = () => listener();
  window.addEventListener("bhakti-storage-changed", handleStorageChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("bhakti-storage-changed", handleStorageChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function getFavoriteIds() {
  ensureInitialized();
  return snapshot.favorites;
}

export async function toggleFavoriteId(id, bhajan) {
  const normalizedId = String(id);
  const hasFavorite = snapshot.favorites.includes(normalizedId);
  snapshot.favorites = hasFavorite
    ? snapshot.favorites.filter((favoriteId) => favoriteId !== normalizedId)
    : [...snapshot.favorites, normalizedId];

  if (hasFavorite) {
    snapshot.favoriteBhajans = snapshot.favoriteBhajans.filter(
      (favorite) => String(favorite.id) !== normalizedId
    );
  } else if (bhajan) {
    const normalizedBhajan = normalizeBhajanMetadata([bhajan])[0];
    if (normalizedBhajan) {
      snapshot.favoriteBhajans = [
        normalizedBhajan,
        ...snapshot.favoriteBhajans.filter(
          (favorite) => String(favorite.id) !== normalizedId
        ),
      ];
    }
  }

  await persist({
    favorites: snapshot.favorites,
    favoriteBhajans: snapshot.favoriteBhajans,
  });
  emitChange();
  return snapshot.favorites;
}

export function getFavoriteBhajans() {
  ensureInitialized();
  return snapshot.favoriteBhajans;
}

export function getDownloadedBhajans() {
  ensureInitialized();
  return snapshot.downloads;
}

export async function toggleDownloadedBhajan(bhajan) {
  const normalizedBhajan = normalizeDownloads([bhajan])[0];
  const existingIndex = snapshot.downloads.findIndex(
    (downloaded) => String(downloaded.id) === String(bhajan.id)
  );

  snapshot.downloads =
    existingIndex >= 0
      ? snapshot.downloads.filter(
          (downloaded) => String(downloaded.id) !== String(bhajan.id)
        )
      : [normalizedBhajan, ...snapshot.downloads];

  await persist({ downloads: snapshot.downloads });
  emitChange();
  return snapshot.downloads;
}

export function isBhajanFavorite(id) {
  return getFavoriteIds().includes(String(id));
}

export function isBhajanDownloaded(id) {
  return getDownloadedBhajans().some(
    (downloaded) => String(downloaded.id) === String(id)
  );
}

export function getStoredLanguage() {
  ensureInitialized();
  return snapshot.language;
}

export async function setStoredLanguage(language) {
  snapshot.language = normalizeLanguage(language);
  await persist({ language: snapshot.language });
  emitChange();
  return snapshot.language;
}
