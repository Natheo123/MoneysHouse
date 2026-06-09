"use client";

import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTips } from "@/context/TipsContext";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/context/LanguageContext";

export function TipsSupport() {
  const { t } = useTranslation();
  const { ready, settings } = useTips();
  const { user } = useUser();
  const pathname = usePathname();

  if (!user) return null;

  if (!ready || !settings.enabled || !settings.paypalUrl) return null;
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={settings.paypalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#0070BA] text-white px-3 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg shadow-[#0070BA]/25 hover:bg-[#005ea6] transition-colors max-w-[calc(100vw-1.5rem)] right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:right-6 sm:bottom-6"
      aria-label={t("tips.cta")}
    >
      <Heart className="h-4 w-4 fill-current shrink-0" />
      <span className="truncate">{t("tips.cta")}</span>
    </a>
  );
}
