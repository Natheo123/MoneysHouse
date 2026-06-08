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
  earningsText?: string;
}

export interface DiscordAppJobPayload {
  id: string;
  slug: string;
  name: string;
  color?: string;
  guides: Record<Locale, DiscordGuideContent>;
}

function stripExternalUrls(text: string, siteHostname: string): string {
  return text.replace(/https?:\/\/\S+/gi, siteHostname);
}

function sanitizeTutorialForDiscord(
  tutorial: App["tutorial"],
  locale: Locale,
  siteHostname: string
): DiscordGuideContent["tutorial"] {
  if (!tutorial?.length) return tutorial;

  return tutorial.map((step) => ({
    ...step,
    description: step.description
      .replace(/https?:\/\/\S+/gi, siteHostname)
      .replace(
        /(?:Inscrivez-vous|Sign up) (?:sur|on) \S+\./gi,
        locale === "fr"
          ? `Consulte la fiche sur ${siteHostname} pour t'inscrire.`
          : `Open the app page on ${siteHostname} to sign up.`
      ),
  }));
}

function toGuideContent(app: App, locale: Locale): DiscordGuideContent {
  const localized = localizeApp(app, locale);
  const siteHostname = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://moneys-house.vercel.app"
  ).hostname.replace(/^www\./, "");

  return {
    description: stripExternalUrls(localized.description, siteHostname),
    shortDescription: stripExternalUrls(localized.shortDescription, siteHostname),
    howItWorks: localized.howItWorks
      ? stripExternalUrls(localized.howItWorks, siteHostname).replace(
          /(?:Découvrez comment|Learn how) (.+?) (?:fonctionne sur|works on) \S+/i,
          locale === "fr"
            ? `Consulte la fiche $1 sur ${siteHostname} pour commencer.`
            : `Open the $1 page on ${siteHostname} to get started.`
        )
      : localized.howItWorks,
    advantages: localized.advantages,
    disadvantages: localized.disadvantages,
    tutorial: sanitizeTutorialForDiscord(localized.tutorial, locale, siteHostname),
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
