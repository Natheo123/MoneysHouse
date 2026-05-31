import type { Locale } from "./types";
import { eurToUsd } from "./currency";

export function formatEarningsLocalized(locale: Locale, min?: number, max?: number): string {
  if (locale === "en") {
    if (min && max) return `$${eurToUsd(min)} to $${eurToUsd(max)}/mo`;
    if (min) return `From $${eurToUsd(min)}/mo`;
    if (max) return `Up to $${eurToUsd(max)}/mo`;
    return "Varies";
  }

  if (min && max) return `${min}€ à ${max}€/mois`;
  if (min) return `À partir de ${min}€/mois`;
  if (max) return `Jusqu'à ${max}€/mois`;
  return "Variables";
}
