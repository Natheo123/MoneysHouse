"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDictionary,
  getFaqItems,
  localizeApp,
  localizeApps,
  translate,
  formatEarningsLocalized,
  formatCurrencyLocalized,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n";
import type { App } from "@/types";
import type { FAQItem } from "@/types";
import { useApps } from "@/context/AppsContext";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  localizedApps: App[];
  getLocalizedApp: (app: App) => App;
  faqItems: FAQItem[];
  ready: boolean;
  formatEarnings: (min?: number, max?: number) => string;
  formatCurrency: (eur: number) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "en" ? "en" : "fr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { apps } = useApps();
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === "en" ? "en" : "fr";
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const dict = useMemo(() => getDictionary(locale), [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(dict, key, params),
    [dict]
  );

  const localizedApps = useMemo(() => localizeApps(apps, locale), [apps, locale]);
  const getLocalizedApp = useCallback((app: App) => localizeApp(app, locale), [locale]);
  const faqItems = useMemo(() => getFaqItems(locale), [locale]);
  const formatEarnings = useCallback(
    (min?: number, max?: number) => formatEarningsLocalized(locale, min, max),
    [locale]
  );
  const formatCurrency = useCallback(
    (eur: number) => formatCurrencyLocalized(locale, eur),
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      localizedApps,
      getLocalizedApp,
      faqItems,
      ready,
      formatEarnings,
      formatCurrency,
    }),
    [locale, setLocale, t, localizedApps, getLocalizedApp, faqItems, ready, formatEarnings, formatCurrency]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useTranslation() {
  const { t, locale } = useLanguage();
  return { t, locale };
}
