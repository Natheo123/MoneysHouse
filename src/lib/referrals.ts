import { apps } from "@/lib/data/apps";

const REFERRAL_STORAGE_KEY = "moneys-house-referrals";
const LEGACY_REFERRAL_CODES_KEY = "moneys-house-referral-codes";

export interface AppReferrals {
  codes: string[];
  links: string[];
}

export const REFERRAL_CODES_UPDATED_EVENT = "referral-codes-updated";

function normalizeCodes(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((c): c is string => typeof c === "string")
      .map((c) => c.trim())
      .filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) return [raw.trim()];
  return [];
}

function normalizeLinks(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((l): l is string => typeof l === "string")
    .map(normalizeLink)
    .filter(Boolean);
}

function normalizeLink(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidLink(link: string): boolean {
  try {
    const url = new URL(link);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseStoredEntry(raw: unknown): AppReferrals {
  if (Array.isArray(raw) || typeof raw === "string") {
    return { codes: normalizeCodes(raw), links: [] };
  }
  if (raw && typeof raw === "object") {
    const entry = raw as { codes?: unknown; links?: unknown };
    return {
      codes: normalizeCodes(entry.codes),
      links: normalizeLinks(entry.links),
    };
  }
  return { codes: [], links: [] };
}

function loadAllStored(): Record<string, AppReferrals> {
  if (typeof window === "undefined") return {};

  const readKey = (key: string): Record<string, AppReferrals> => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const result: Record<string, AppReferrals> = {};
      for (const [appId, value] of Object.entries(parsed)) {
        result[appId] = parseStoredEntry(value);
      }
      return result;
    } catch {
      return {};
    }
  };

  const current = readKey(REFERRAL_STORAGE_KEY);
  if (Object.keys(current).length > 0) return current;

  const legacy = readKey(LEGACY_REFERRAL_CODES_KEY);
  if (Object.keys(legacy).length > 0) {
    saveAllStored(legacy);
    localStorage.removeItem(LEGACY_REFERRAL_CODES_KEY);
    return legacy;
  }

  return {};
}

function notifyReferralsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REFERRAL_CODES_UPDATED_EVENT));
}

function saveAllStored(data: Record<string, AppReferrals>): void {
  localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(data));
  notifyReferralsChanged();
}

function getDefaultReferrals(appId: string): AppReferrals {
  const app = apps.find((a) => a.id === appId);
  return {
    codes: app?.referralCodes?.filter(Boolean) ?? [],
    links: app?.referralLinks?.filter(Boolean) ?? [],
  };
}

function getStoredReferrals(appId: string): AppReferrals {
  const stored = loadAllStored();
  if (stored[appId] !== undefined) return stored[appId];
  return getDefaultReferrals(appId);
}

function updateStoredReferrals(appId: string, referrals: AppReferrals): void {
  const stored = loadAllStored();
  stored[appId] = referrals;
  saveAllStored(stored);
}

export function getReferralData(appId: string): AppReferrals {
  return getStoredReferrals(appId);
}

export function getReferralCodes(appId: string): string[] {
  return getStoredReferrals(appId).codes;
}

export function getReferralLinks(appId: string): string[] {
  return getStoredReferrals(appId).links;
}

export function getReferralCode(appId: string): string {
  return getReferralCodes(appId)[0] ?? "";
}

export function getAllReferralCodes(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const app of apps) {
    result[app.id] = getReferralCodes(app.id);
  }
  return result;
}

export function getAllReferralLinks(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const app of apps) {
    result[app.id] = getReferralLinks(app.id);
  }
  return result;
}

export function getAllReferralData(): Record<string, AppReferrals> {
  const result: Record<string, AppReferrals> = {};
  for (const app of apps) {
    result[app.id] = getReferralData(app.id);
  }
  return result;
}

export function setReferralData(appId: string, data: AppReferrals): void {
  updateStoredReferrals(appId, {
    codes: normalizeCodes(data.codes),
    links: normalizeLinks(data.links),
  });
}

export function setReferralCodes(appId: string, codes: string[]): void {
  const current = getStoredReferrals(appId);
  setReferralData(appId, { ...current, codes: normalizeCodes(codes) });
}

export function setReferralLinks(appId: string, links: string[]): void {
  const current = getStoredReferrals(appId);
  setReferralData(appId, { ...current, links: normalizeLinks(links) });
}

export function addReferralCode(appId: string, code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;
  const current = getStoredReferrals(appId);
  if (current.codes.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return false;
  setReferralData(appId, { ...current, codes: [...current.codes, trimmed] });
  return true;
}

export function addReferralLink(appId: string, link: string): boolean {
  const normalized = normalizeLink(link);
  if (!normalized || !isValidLink(normalized)) return false;
  const current = getStoredReferrals(appId);
  if (current.links.some((l) => l.toLowerCase() === normalized.toLowerCase())) return false;
  setReferralData(appId, { ...current, links: [...current.links, normalized] });
  return true;
}

export function removeReferralCode(appId: string, code: string): void {
  const current = getStoredReferrals(appId);
  setReferralData(appId, {
    ...current,
    codes: current.codes.filter((c) => c !== code),
  });
}

export function removeReferralLink(appId: string, link: string): void {
  const current = getStoredReferrals(appId);
  setReferralData(appId, {
    ...current,
    links: current.links.filter((l) => l !== link),
  });
}

export function hasReferralProgram(appId: string): boolean {
  const app = apps.find((a) => a.id === appId);
  return app?.hasReferral !== false;
}

export function hasReferralContent(appId: string): boolean {
  const data = getReferralData(appId);
  return data.codes.length > 0 || data.links.length > 0;
}
