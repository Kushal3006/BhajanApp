"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function MobileNav() {
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t.home, icon: "H" },
    { href: "/browse", label: t.browse, icon: "B" },
    { href: "/favorites", label: t.favorites, icon: "S" },
    { href: "/downloads", label: t.downloads, icon: "O" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center text-xs font-bold text-stone-600 transition hover:bg-amber-50 hover:text-amber-800"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-[11px] font-black">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
