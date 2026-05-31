import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function FlagIcon({ locale, className }: { locale: Locale; className?: string }) {
  if (locale === "fr") {
    return (
      <svg
        viewBox="0 0 24 16"
        aria-hidden
        className={cn("h-3.5 w-5 rounded-[2px] border border-phantom-dark/10 shrink-0", className)}
      >
        <rect width="8" height="16" fill="#0055A4" />
        <rect x="8" width="8" height="16" fill="#FFFFFF" />
        <rect x="16" width="8" height="16" fill="#EF4135" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 16"
      aria-hidden
      className={cn("h-3.5 w-5 rounded-[2px] border border-phantom-dark/10 shrink-0", className)}
    >
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M12 0 V16 M0 8 H24" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}
