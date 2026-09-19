"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BhajanCard from "@/components/BhajanCard";
import FilterChips from "@/components/FilterChips";
import { useLanguage } from "@/components/LanguageProvider";
import { getLocalizedBhajan } from "@/lib/localizedContent";

export default function BrowseContent({ bhajans, categories }) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBhajans = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return bhajans.filter((bhajan) => {
      const localizedBhajan = getLocalizedBhajan(bhajan, language);
      const matchesCategory =
        activeCategory === "All" || bhajan.category === activeCategory;
      const matchesSearch =
        !normalized ||
        localizedBhajan.title.toLowerCase().includes(normalized) ||
        bhajan.deity.toLowerCase().includes(normalized) ||
        localizedBhajan.description.toLowerCase().includes(normalized) ||
        localizedBhajan.lyrics.join(" ").toLowerCase().includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, bhajans, language, searchTerm]);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">{t.browse}</p>
            <h1 className="mt-2 text-3xl font-bold text-stone-900 md:text-4xl">{t.bhajansLibrary}</h1>
          </div>
          <Link href="/" className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-200 hover:text-amber-700">
            {t.backToHome}
          </Link>
        </header>

        <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-stone-200 md:p-6">
          <div className="flex flex-col gap-4">
            <label className="relative block">
              <span className="sr-only">{t.browse}</span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-base text-stone-700 outline-none transition focus:border-amber-400 focus:bg-white"
              />
            </label>
            <FilterChips categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900">{t.results}</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
              {filteredBhajans.length}
            </span>
          </div>

          {filteredBhajans.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBhajans.map((bhajan) => <BhajanCard key={bhajan.id} bhajan={bhajan} />)}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="text-lg font-medium text-stone-800">{t.noResults}</p>
              <p className="mt-2 text-stone-600">{t.noResultsHint}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
