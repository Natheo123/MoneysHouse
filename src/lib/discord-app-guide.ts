import { localizeApp } from "@/lib/i18n/localize-app";
import { formatEarningsLocalized } from "@/lib/i18n/format-earnings";
import type { Locale } from "@/lib/i18n/types";
import type { App } from "@/types";

export interface DiscordGuideContent {
  description?: string;
  shortDescription?: string;
  howItWorks?: string;
  advantages?: string[];
  disadvantages?: string[];
  tutorial?: { step: number; title: string; description: string }[];
  downloadLinks?: { label: string; url: string }[];
  referralInstructions?: string;
  earningsText?: string;
}

export interface DiscordAppJobPayload {
  id: string;
  slug: string;
  name: string;
  color?: string;
  guides: Record<Locale, DiscordGuideContent>;
}

function toGuideContent(app: App, locale: Locale): DiscordGuideContent {
  const localized = localizeApp(app, locale);

  return {
    description: localized.description,
    shortDescription: localized.shortDescription,
    howItWorks: localized.howItWorks,
    advantages: localized.advantages,
    disadvantages: localized.disadvantages,
    tutorial: localized.tutorial,
    downloadLinks: localized.downloadLinks?.map((link) => ({
      label: link.label,
      url: link.url,
    })),
    referralInstructions: localized.referralInstructions,
    earningsText:
      localized.earningsMin || localized.earningsMax
        ? formatEarningsLocalized(locale, localized.earningsMin, localized.earningsMax)
        : undefined,
  };
}

export function buildDiscordAppJobPayload(app: App): DiscordAppJobPayload {
  return {
    id: app.id,
    slug: app.slug,
    name: app.name,
    color: app.color,
    guides: {
      fr: toGuideContent(app, "fr"),
      en: toGuideContent(app, "en"),
    },
  };
}
