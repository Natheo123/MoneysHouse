import type { App } from "@/types";
import type { Locale } from "./types";
import { appsEn } from "./apps-en";

export function localizeApp(app: App, locale: Locale): App {
  if (locale === "fr") return app;

  const en = appsEn[app.id];
  if (!en) {
    return {
      ...app,
      earningsLabel: app.earningsLabel
        ? ({ Variables: "Varies", "Récompenses Google Play": "Google Play rewards" }[app.earningsLabel] ??
          app.earningsLabel)
        : app.earningsLabel,
    };
  }

  return {
    ...app,
    ...en,
    referralBonusTitle: en.referralBonusTitle ?? app.referralBonusTitle,
    referralBonusDescription: en.referralBonusDescription ?? app.referralBonusDescription,
    referralInstructions: en.referralInstructions ?? app.referralInstructions,
    referralFaqHint: en.referralFaqHint ?? app.referralFaqHint,
    downloadLinks: en.downloadLinks ?? app.downloadLinks,
    tutorial: en.tutorial ?? app.tutorial,
    faq: en.faq ?? app.faq,
    advantages: en.advantages ?? app.advantages,
    disadvantages: en.disadvantages ?? app.disadvantages,
    earningsLabel:
      en.earningsLabel ??
      (app.earningsLabel
        ? ({ Variables: "Varies", "Récompenses Google Play": "Google Play rewards" }[app.earningsLabel] ??
          app.earningsLabel)
        : undefined),
  };
}

export function localizeApps(apps: App[], locale: Locale): App[] {
  return apps.map((app) => localizeApp(app, locale));
}
