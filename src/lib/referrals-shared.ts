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

export function hasReferralProgram(appId: string): boolean {
  const app = apps.find((a) => a.id === appId);
  return app?.hasReferral !== false;
}

export function mergeReferralsWithAppDefaults(
  appId: string,
  stored: Record<string, AppReferrals>
): AppReferrals {
  const app = apps.find((a) => a.id === appId);
  if (!(appId in stored)) {
    return {
      codes: app?.referralCodes?.filter(Boolean) ?? [],
      links: app?.referralLinks?.filter(Boolean) ?? [],
      bonusTitle: app?.referralBonusTitle,
      bonusDescription: app?.referralBonusDescription,
    };
  }
  const entry = stored[appId];
  return {
    codes: entry.codes,
    links: entry.links,
    bonusTitle: entry.bonusTitle || app?.referralBonusTitle,
    bonusDescription: entry.bonusDescription || app?.referralBonusDescription,
  };
}

export function getReferralBonusFromData(
  appId: string,
  data: AppReferrals
): ReferralBonus | null {
  if (!hasReferralProgram(appId)) return null;
  const app = apps.find((a) => a.id === appId);
  const title = data.bonusTitle || app?.referralBonusTitle;
  if (!title) return null;
  return {
    title,
    description:
      data.bonusDescription ||
      app?.referralBonusDescription ||
      "Utilisez notre code ou lien parrain pour débloquer ce bonus à l'inscription.",
  };
}
