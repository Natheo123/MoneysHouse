import type { App } from "@/types";
import type { Locale } from "./types";
import { appsEn } from "./apps-en";

export function localizeApp(app: App, locale: Locale): App {
  if (locale === "fr") return app;

  const en = appsEn[app.id];
  if (!en) return app;

  return {
    ...app,
    ...en,
    downloadLinks: en.downloadLinks ?? app.downloadLinks,
    tutorial: en.tutorial ?? app.tutorial,
    faq: en.faq ?? app.faq,
    advantages: en.advantages ?? app.advantages,
    disadvantages: en.disadvantages ?? app.disadvantages,
  };
}

export function localizeApps(apps: App[], locale: Locale): App[] {
  return apps.map((app) => localizeApp(app, locale));
}
