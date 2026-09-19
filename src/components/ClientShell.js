"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";
import OfflineStatus from "@/components/OfflineStatus";

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
        <div className="flex justify-end px-4 pt-4">
          <div className="flex items-center gap-3">
            <OfflineStatus />
            <LanguageSwitcher />
          </div>
        </div>
        {children}
      </div>
      <MobileNav />
    </LanguageProvider>
  );
}
