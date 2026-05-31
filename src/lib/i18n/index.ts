import type { Locale } from "./types";
import { fr } from "./fr";
import { en } from "./en";
import { faqItemsFr, faqItemsEn } from "./faq";
import { convertCurrencyInText } from "./currency";
import type { FAQItem } from "@/types";

export const dictionaries = { fr, en } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getFaqItems(locale: Locale): FAQItem[] {
  const items = locale === "en" ? faqItemsEn : faqItemsFr;
  if (locale === "fr") return items;

  return items.map((item) => ({
    ...item,
    question: convertCurrencyInText(item.question, "en"),
    answer: item.answer ? convertCurrencyInText(item.answer, "en") : item.answer,
  }));
}

export * from "./types";
export * from "./get";
export * from "./localize-app";
export * from "./legal-pages";
export * from "./blog-i18n";
export * from "./format-earnings";
export * from "./currency";
