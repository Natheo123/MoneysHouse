import type { Locale } from "./types";

/** Taux fixe pour l'affichage (1 € ≈ 1,08 $). */
export const EUR_TO_USD_RATE = 1.08;

export function eurToUsd(eur: number): number {
  return Math.round(eur * EUR_TO_USD_RATE);
}

export function formatCurrencyLocalized(locale: Locale, eur: number): string {
  if (locale === "en") return `$${eurToUsd(eur)}`;
  return `${eur}€`;
}

/** Convertit les montants € présents dans un texte libre (FAQ, descriptions…). */
export function convertCurrencyInText(text: string, locale: Locale): string {
  if (locale === "fr" || !text.includes("€")) return text;

  let result = text;

  result = result.replace(
    /€(\d+(?:[.,]\d+)?)\s*(?:to|-)\s*€(\d+(?:[.,]\d+)?)/gi,
    (_, min, max) => `$${eurToUsd(parseFloat(min))} to $${eurToUsd(parseFloat(max))}`
  );

  result = result.replace(
    /(\d+(?:[.,]\d+)?)\s*(?:to|-)\s*(\d+(?:[.,]\d+)?)\s*€/gi,
    (_, min, max) => `$${eurToUsd(parseFloat(min))} to $${eurToUsd(parseFloat(max))}`
  );

  result = result.replace(
    /(\d+(?:[.,]\d+)?)\s*(?:à|a)\s*(\d+(?:[.,]\d+)?)\s*€/gi,
    (_, min, max) => `$${eurToUsd(parseFloat(min))} to $${eurToUsd(parseFloat(max))}`
  );

  result = result.replace(/€(\d+(?:[.,]\d+)?)/g, (_, amount) =>
    `$${eurToUsd(parseFloat(amount))}`
  );

  result = result.replace(/(\d+(?:[.,]\d+)?)\s*€/g, (_, amount) =>
    `$${eurToUsd(parseFloat(amount))}`
  );

  return result;
}
