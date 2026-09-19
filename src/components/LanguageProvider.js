"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  getStoredLanguage,
  setStoredLanguage,
  subscribeToStorageChanges,
} from "@/lib/storage";
import { languageOptions, translations } from "@/lib/translations";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }) {
  const language = useSyncExternalStore(
    subscribeToStorageChanges,
    getStoredLanguage,
    () => "en"
  );

  const setLanguage = async (nextLanguage) => {
    await setStoredLanguage(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language] || translations.en,
      languageOptions,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
