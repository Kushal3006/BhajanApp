"use client";

import { LanguageProvider } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";
import OfflineStatus from "@/components/OfflineStatus";

export default function ClientShell({ children }) {
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
