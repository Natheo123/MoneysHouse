import type { Locale } from "./types";
import { fr } from "./fr";
import { en } from "./en";
import { faqItemsFr, faqItemsEn } from "./faq";
import type { FAQItem } from "@/types";

export const dictionaries = { fr, en } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getFaqItems(locale: Locale): FAQItem[] {
  return locale === "en" ? faqItemsEn : faqItemsFr;
}

export * from "./types";
export * from "./get";
export * from "./localize-app";
