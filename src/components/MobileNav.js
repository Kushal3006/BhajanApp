"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function MobileNav() {
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t.home },
    { href: "/browse", label: t.browse },
    { href: "/favorites", label: t.favorites },
    { href: "/downloads", label: t.downloads },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl px-2 py-2 text-center text-xs font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-amber-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
