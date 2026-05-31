"use client";

import { cn } from "@/lib/utils";
import { FlagIcon } from "@/components/icons/FlagIcon";
import { useLanguage } from "@/context/LanguageContext";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n";

const options: Locale[] = ["fr", "en"];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-phantom-dark/10 bg-phantom-bg/90 p-0.5 shrink-0",
        className
      )}
      role="group"
      aria-label={t("language.switch")}
    >
      {options.map((option) => {
        const active = locale === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLocale(option)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-phantom-purple text-white shadow-sm"
                : "text-phantom-gray hover:text-phantom-dark hover:bg-phantom-lavender/40"
            )}
            aria-pressed={active}
            aria-label={option === "fr" ? t("language.french") : t("language.english")}
          >
            <FlagIcon locale={option} />
            <span>{LOCALE_LABELS[option]}</span>
          </button>
        );
      })}
    </div>
  );
}
