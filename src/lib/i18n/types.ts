export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];

export const LOCALE_STORAGE_KEY = "mh-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "ENG",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
};
