"use client";

import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTips } from "@/context/TipsContext";
import { useTranslation } from "@/context/LanguageContext";

export function TipsSupport() {
  const { t } = useTranslation();
  const { ready, settings } = useTips();
  const pathname = usePathname();

  if (!ready || !settings.enabled || !settings.paypalUrl) return null;
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={settings.paypalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#0070BA] text-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold shadow-lg shadow-[#0070BA]/25 hover:bg-[#005ea6] transition-colors"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label={t("tips.cta")}
    >
      <Heart className="h-4 w-4 fill-current" />
      <span>{t("tips.cta")}</span>
    </a>
  );
}
