"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LanguageProvider } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";
import OfflineStatus from "@/components/OfflineStatus";

function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600 text-lg font-black text-white shadow-sm">
            B
          </span>
          <span>
            <span className="block text-lg font-black leading-tight text-stone-950">
              Bhakti
            </span>
            <span className="block text-xs font-medium text-stone-500">
              Daily bhajans
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/browse" className="rounded-full px-4 py-2 text-sm font-bold text-stone-700 hover:bg-amber-50 hover:text-amber-800">
            Browse
          </Link>
          <Link href="/favorites" className="rounded-full px-4 py-2 text-sm font-bold text-stone-700 hover:bg-rose-50 hover:text-rose-700">
            Favorites
          </Link>
          <Link href="/downloads" className="rounded-full px-4 py-2 text-sm font-bold text-stone-700 hover:bg-emerald-50 hover:text-emerald-700">
            Offline
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <OfflineStatus />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default function ClientShell({ children }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Unable to register offline app shell.", error);
      });
    }
  }, []);

  return (
    <LanguageProvider>
      <div className="mx-auto min-h-dvh w-full">
        <AppHeader />
        {children}
      </div>
      <MobileNav />
    </LanguageProvider>
  );
}
