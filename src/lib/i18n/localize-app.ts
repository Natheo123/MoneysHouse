import type { App } from "@/types";
import type { Locale } from "./types";
import { appsEn } from "./apps-en";
import { convertCurrencyInText } from "./currency";
import { translateCustomFrenchText, translateLinkLabel } from "./custom-app-en";

function applyEnCurrencyToApp(app: App): App {
  const c = (text: string) => convertCurrencyInText(text, "en");

  return {
    ...app,
    description: c(app.description),
    shortDescription: c(app.shortDescription),
    howItWorks: app.howItWorks ? c(app.howItWorks) : app.howItWorks,
    referralBonusDescription: app.referralBonusDescription
      ? c(app.referralBonusDescription)
      : app.referralBonusDescription,
    referralInstructions: app.referralInstructions ? c(app.referralInstructions) : app.referralInstructions,
    referralFaqHint: app.referralFaqHint ? c(app.referralFaqHint) : app.referralFaqHint,
    advantages: app.advantages?.map(c),
    disadvantages: app.disadvantages?.map(c),
    tutorial: app.tutorial?.map((step) => ({
      ...step,
      title: c(step.title),
      description: c(step.description),
    })),
    faq: app.faq?.map((item) => ({
      ...item,
      question: c(item.question),
      answer: c(item.answer),
    })),
    downloadLinks: app.downloadLinks?.map((link) => ({
      ...link,
      label: c(link.label),
    })),
  };
}

function applyCustomEnglishCopy(app: App): App {
  return {
    ...app,
    description: translateCustomFrenchText(app.description),
    shortDescription: translateCustomFrenchText(app.shortDescription),
    howItWorks: app.howItWorks ? translateCustomFrenchText(app.howItWorks) : app.howItWorks,
    referralInstructions: app.referralInstructions
      ? translateCustomFrenchText(app.referralInstructions)
      : app.referralInstructions,
    advantages: app.advantages?.map(translateCustomFrenchText),
    disadvantages: app.disadvantages?.map(translateCustomFrenchText),
    tutorial: app.tutorial?.map((step) => ({
      ...step,
      title: translateCustomFrenchText(step.title),
      description: translateCustomFrenchText(step.description),
    })),
    faq: app.faq?.map((item) => ({
      ...item,
      question: translateCustomFrenchText(item.question),
      answer: translateCustomFrenchText(item.answer),
    })),
    downloadLinks: app.downloadLinks?.map((link) => ({
      ...link,
      label: translateLinkLabel(link.label),
    })),
    difficultyLabel:
      app.difficultyLabel === "Facile"
        ? "Easy"
        : app.difficultyLabel === "Moyen"
          ? "Medium"
          : app.difficultyLabel === "Difficile"
            ? "Hard"
            : app.difficultyLabel,
  };
}

export function localizeApp(app: App, locale: Locale): App {
  if (locale === "fr") return app;

  const en = appsEn[app.id];
  const merged = en
    ? {
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
            ? ({ Variables: "Varies", "Récompenses Google Play": "Google Play rewards" }[
                app.earningsLabel
              ] ?? app.earningsLabel)
            : undefined),
      }
    : applyCustomEnglishCopy(app);

  return applyEnCurrencyToApp(merged);
}

export function localizeApps(apps: App[], locale: Locale): App[] {
  return apps.map((app) => localizeApp(app, locale));
}
