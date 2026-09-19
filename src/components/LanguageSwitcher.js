"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage, languageOptions } = useLanguage();

  return (
    <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white p-1 shadow-sm">
      {languageOptions.map((option) => {
        const isActive = option.code === language;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? "bg-amber-600 text-white"
                : "text-stone-600 hover:text-amber-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
