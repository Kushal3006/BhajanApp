"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function OfflineStatus() {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(window.navigator.onLine);

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm ${
        isOnline
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isOnline ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {isOnline ? t.online : t.offlineStatus}
    </div>
  );
}
