"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { getLocalizedBhajan } from "@/lib/localizedContent";

export default function BhajanCard({ bhajan }) {
  const { language } = useLanguage();
  const localizedBhajan = getLocalizedBhajan(bhajan, language);

  return (
    <Link
      href={`/bhajan/${bhajan.slug}`}
      className="group block overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={bhajan.thumbnail}
          alt={localizedBhajan.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white">
          {bhajan.category}
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {bhajan.duration}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-700">
              {bhajan.deity}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-stone-900">{localizedBhajan.title}</h3>
          </div>
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
            {bhajan.language}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-stone-600">
          {localizedBhajan.description}
        </p>

        <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
          <span className="font-medium text-amber-700">Listen now</span>
          <span className="text-stone-500">→</span>
        </div>
      </div>
    </Link>
  );
}
