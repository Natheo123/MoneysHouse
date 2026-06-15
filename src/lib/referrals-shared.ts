export interface ReferralBonus {
  title: string;
  description: string;
}

export interface AppReferrals {
  codes: string[];
  links: string[];
  bonusTitle?: string;
  bonusDescription?: string;
}

export const REFERRAL_CODES_UPDATED_EVENT = "referral-codes-updated";

export function normalizeCodes(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((c): c is string => typeof c === "string")
      .map((c) => c.trim())
      .filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) return [raw.trim()];
  return [];
}

export function normalizeLink(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function normalizeLinks(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((l): l is string => typeof l === "string")
    .map(normalizeLink)
    .filter(Boolean);
}

export function isValidLink(link: string): boolean {
  try {
    const url = new URL(link);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseStoredEntry(raw: unknown): AppReferrals {
  if (Array.isArray(raw) || typeof raw === "string") {
    return { codes: normalizeCodes(raw), links: [] };
  }
  if (raw && typeof raw === "object") {
    const entry = raw as {
      codes?: unknown;
      links?: unknown;
      bonusTitle?: unknown;
      bonusDescription?: unknown;
    };
    return {
      codes: normalizeCodes(entry.codes),
      links: normalizeLinks(entry.links),
      bonusTitle:
        typeof entry.bonusTitle === "string" ? entry.bonusTitle.trim() : undefined,
      bonusDescription:
        typeof entry.bonusDescription === "string"
          ? entry.bonusDescription.trim()
          : undefined,
    };
  }
  return { codes: [], links: [] };
}

export function normalizeAppReferrals(data: AppReferrals): AppReferrals {
  return {
    codes: normalizeCodes(data.codes),
    links: normalizeLinks(data.links),
    bonusTitle: data.bonusTitle?.trim() || undefined,
    bonusDescription: data.bonusDescription?.trim() || undefined,
  };
}

import { apps } from "@/lib/data/apps";

import type { App } from "@/types";

export function hasReferralProgram(
  appId: string,
  app?: Pick<App, "hasReferral"> | null
): boolean {
  if (app !== undefined) return app?.hasReferral !== false;
  const staticApp = apps.find((a) => a.id === appId);
  if (staticApp) return staticApp.hasReferral !== false;
  return true;
}

export function mergeReferralsWithAppDefaults(
  appId: string,
  stored: Record<string, AppReferrals>,
  app?: App | null
): AppReferrals {
  const resolved = app ?? apps.find((a) => a.id === appId) ?? null;
  if (!(appId in stored)) {
    return {
      codes: resolved?.referralCodes?.filter(Boolean) ?? [],
      links: resolved?.referralLinks?.filter(Boolean) ?? [],
      bonusTitle: resolved?.referralBonusTitle,
      bonusDescription: resolved?.referralBonusDescription,
    };
  }
  const entry = stored[appId];
  return {
    codes: entry.codes,
    links: entry.links,
    bonusTitle: entry.bonusTitle || resolved?.referralBonusTitle,
    bonusDescription: entry.bonusDescription || resolved?.referralBonusDescription,
  };
}

export function getReferralBonusFromData(
  appId: string,
  data: AppReferrals,
  app?: App | null
): ReferralBonus | null {
  const resolved = app ?? apps.find((a) => a.id === appId) ?? null;
  if (!hasReferralProgram(appId, resolved)) return null;
  const title = data.bonusTitle || resolved?.referralBonusTitle;
  if (!title) return null;
  return {
    title,
    description:
      data.bonusDescription ||
      resolved?.referralBonusDescription ||
      "Utilisez notre code ou lien parrain pour débloquer ce bonus à l'inscription.",
  };
}

/** Lien parrain admin en priorité, sinon le lien de téléchargement de base. */
export function resolveOutboundAppUrl(
  referralLinks: string[],
  fallbackDownloadUrl: string
): string {
  const primaryReferral = normalizeLinks(referralLinks).find(isValidLink);
  if (primaryReferral) return primaryReferral;

  const fallback = fallbackDownloadUrl.trim();
  if (!fallback) return "";
  const normalized = normalizeLink(fallback);
  return isValidLink(normalized) ? normalized : fallback;
}
