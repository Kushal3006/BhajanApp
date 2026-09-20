"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BhajanCard from "@/components/BhajanCard";
import { useLanguage } from "@/components/LanguageProvider";

const getQuickLinks = (t) => [
  {
    href: "/browse",
    label: t.startListening,
    description: "Open all bhajans and play one now",
    tone: "bg-amber-600 text-white",
  },
  {
    href: "/favorites",
    label: t.favorites,
    description: "Your saved bhajans in one place",
    tone: "bg-rose-50 text-rose-800",
  },
  {
    href: "/downloads",
    label: t.downloads,
    description: "Listen without internet",
    tone: "bg-emerald-50 text-emerald-800",
  },
];

export default function HomeContent({ bhajans }) {
  const { t } = useLanguage();
  const quickLinks = getQuickLinks(t);
  const featuredBhajans = bhajans.filter((bhajan) => bhajan.featured);
  const heroBhajan = featuredBhajans[0] || bhajans[0];
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(bhajans.map((bhajan) => bhajan.category).filter(Boolean)),
    ];

    return ["All", ...uniqueCategories];
  }, [bhajans]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const selectedBhajans = useMemo(() => {
    if (selectedCategory === "All") {
      return bhajans;
    }

    return bhajans.filter((bhajan) => bhajan.category === selectedCategory);
  }, [bhajans, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#f7f4ee]">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
          <div className="order-2 lg:order-1">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-amber-700">
              {t.devotionalMusic}
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-tight text-stone-950 md:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-stone-700">
              {t.heroText}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href="/browse"
                className="flex min-h-16 items-center justify-center rounded-2xl bg-amber-600 px-6 py-4 text-lg font-black text-white shadow-sm transition hover:bg-amber-700"
              >
                {t.startListening}
              </Link>
              <Link
                href="/favorites"
                className="flex min-h-16 items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-4 text-lg font-black text-stone-800 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800"
              >
                {t.myFavorites}
              </Link>
            </div>
          </div>

          {heroBhajan ? (
            <Link
              href={`/bhajan/${heroBhajan.slug}`}
              className="order-1 overflow-hidden rounded-3xl border border-stone-200 bg-stone-950 shadow-lg transition hover:-translate-y-1 hover:shadow-xl lg:order-2"
            >
              <div className="relative min-h-[340px]">
                <img
                  src={heroBhajan.thumbnail}
                  alt={heroBhajan.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-7">
                  <p className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-sm font-black text-amber-700">
                    Featured for today
                  </p>
                  <h2 className="text-3xl font-black leading-tight md:text-4xl">
                    {heroBhajan.title}
                  </h2>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-base font-bold text-stone-100">
                      {heroBhajan.deity} - {heroBhajan.duration}
                    </span>
                    <span className="rounded-full bg-amber-500 px-5 py-3 text-sm font-black text-white">
                      Play
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="order-1 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200 lg:order-2">
              <p className="text-lg font-semibold text-stone-800">
                Content is being prepared
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl border border-stone-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${item.tone}`}
            >
              <p className="text-sm font-black uppercase tracking-[0.14em] opacity-80">
                {t.quickAccess}
              </p>
              <h3 className="mt-2 text-2xl font-black">{item.label}</h3>
              <p className="mt-2 text-base font-medium opacity-80">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 pt-4 md:px-8 lg:px-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">
              Choose category
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">
              Select and listen
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-stone-600">
              Tap any category below. The bhajans for that category will show
              here on the home page.
            </p>
          </div>
          <Link
            href="/browse"
            className="rounded-full bg-white px-4 py-2 text-sm font-black text-amber-700 shadow-sm ring-1 ring-stone-200 hover:text-amber-800"
          >
            {t.viewAll}
          </Link>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const count =
              category === "All"
                ? bhajans.length
                : bhajans.filter((bhajan) => bhajan.category === category)
                    .length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`min-h-24 rounded-2xl border p-4 text-left shadow-sm transition ${
                  isSelected
                    ? "border-amber-600 bg-amber-600 text-white"
                    : "border-stone-200 bg-white text-stone-900 hover:border-amber-200 hover:bg-amber-50"
                }`}
              >
                <span className="block text-2xl font-black">{category}</span>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-black ${
                    isSelected
                      ? "bg-white text-amber-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {count} bhajans
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-2xl font-black text-stone-950">
            {selectedCategory === "All" ? "All bhajans" : selectedCategory}
          </h3>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-stone-700 shadow-sm ring-1 ring-stone-200">
            {selectedBhajans.length}
          </span>
        </div>

        {selectedBhajans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {selectedBhajans.map((bhajan) => (
              <BhajanCard key={bhajan.id} bhajan={bhajan} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-white p-8 text-center text-stone-600">
            No bhajans available in this category.
          </p>
        )}
      </section>
    </main>
  );
}
