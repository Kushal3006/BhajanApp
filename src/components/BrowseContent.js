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
    <main className="min-h-screen bg-[#f7f4ee] px-4 pb-28 pt-6 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">
              {t.browse}
            </p>
            <h1 className="mt-2 text-4xl font-black text-stone-950 md:text-5xl">
              {t.bhajansLibrary}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-stone-600">
              Search by name or choose a category. Every result opens directly
              to the player.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 text-sm font-black text-stone-700 shadow-sm transition hover:border-amber-200 hover:text-amber-700"
          >
            {t.backToHome}
          </Link>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 md:p-5">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-stone-700">
              Search bhajans
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="min-h-14 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-lg font-semibold text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white"
            />
          </label>
          <div className="mt-4">
            <FilterChips
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-stone-950">{t.results}</h2>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-800">
              {filteredBhajans.length}
            </span>
          </div>

          {filteredBhajans.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBhajans.map((bhajan) => (
                <BhajanCard key={bhajan.id} bhajan={bhajan} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="text-xl font-black text-stone-800">{t.noResults}</p>
              <p className="mt-2 text-stone-600">{t.noResultsHint}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
