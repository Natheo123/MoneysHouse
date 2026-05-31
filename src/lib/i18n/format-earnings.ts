import type { Locale } from "./types";

export function formatEarningsLocalized(locale: Locale, min?: number, max?: number): string {
  if (locale === "en") {
    if (min && max) return `€${min} to €${max}/mo`;
    if (min) return `From €${min}/mo`;
    if (max) return `Up to €${max}/mo`;
    return "Varies";
  }

  if (min && max) return `${min}€ à ${max}€/mois`;
  if (min) return `À partir de ${min}€/mois`;
  if (max) return `Jusqu'à ${max}€/mois`;
  return "Variables";
}
