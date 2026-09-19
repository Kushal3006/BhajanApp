"use client";

import Link from "next/link";
import BhajanCard from "@/components/BhajanCard";
import { useLanguage } from "@/components/LanguageProvider";

const getQuickLinks = (t) => [
  { href: "/browse", label: t.browse, description: "Search all bhajans" },
  { href: "/favorites", label: t.favorites, description: "Saved devotionals" },
  { href: "/downloads", label: t.downloads, description: t.offlineReady },
];

export default function HomeContent({ bhajans }) {
  const { t } = useLanguage();
  const quickLinks = getQuickLinks(t);
  const featuredBhajans = bhajans.filter((bhajan) => bhajan.featured);
  const heroBhajan = featuredBhajans[0] || bhajans[0];

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-12">
          <nav className="mb-10 flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-bold tracking-[0.2em] text-amber-700">BHAKTI</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/browse" className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-200 hover:text-amber-700">
                {t.browse}
              </Link>
              <Link href="/downloads" className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700">
                {t.offlineLibrary}
              </Link>
            </div>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                {t.devotionalMusic}
              </p>
              <h1 className="max-w-xl text-4xl font-black leading-tight text-stone-900 md:text-6xl">{t.heroTitle}</h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-stone-700">{t.heroText}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/browse" className="rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700">
                  {t.startListening}
                </Link>
                <Link href="/favorites" className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-200 hover:text-amber-700">
                  {t.myFavorites}
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-stone-200">
                  <p className="text-2xl font-bold text-stone-900">{bhajans.length}</p>
                  <p className="mt-1 text-sm text-stone-600">Bhajans</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-stone-200">
                  <p className="text-2xl font-bold text-stone-900">6</p>
                  <p className="mt-1 text-sm text-stone-600">{t.offlineReady}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-stone-200">
                  <p className="text-2xl font-bold text-stone-900">{t.offline}</p>
                  <p className="mt-1 text-sm text-stone-600">{t.saved}</p>
                </div>
              </div>
            </div>

            {heroBhajan ? (
              <div className="rounded-[30px] bg-white p-4 shadow-xl ring-1 ring-stone-200">
                <div className="overflow-hidden rounded-[24px]">
                  <img src={heroBhajan.thumbnail} alt={heroBhajan.title} className="h-[430px] w-full object-cover" />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-amber-700">Featured</p>
                    <h2 className="mt-1 text-2xl font-bold text-stone-900">{heroBhajan.title}</h2>
                  </div>
                  <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">{heroBhajan.duration}</div>
                </div>
              </div>
            ) : (
              <div className="rounded-[30px] bg-white p-10 text-center shadow-xl ring-1 ring-stone-200">
                <p className="text-lg font-semibold text-stone-800">Content is being prepared</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-[26px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{t.quickAccess}</p>
              <h3 className="mt-3 text-xl font-bold text-stone-900">{item.label}</h3>
              <p className="mt-2 text-sm text-stone-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Featured</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900">{t.popular}</h2>
          </div>
          <Link href="/browse" className="text-sm font-semibold text-amber-700 hover:text-amber-800">{t.viewAll}</Link>
        </div>
        {featuredBhajans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredBhajans.map((bhajan) => <BhajanCard key={bhajan.id} bhajan={bhajan} />)}
          </div>
        ) : (
          <p className="rounded-3xl bg-white p-8 text-center text-stone-600">No featured bhajans available.</p>
        )}
      </section>
    </main>
  );
}
