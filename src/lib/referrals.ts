import { apps } from "@/lib/data/apps";

const REFERRAL_CODES_KEY = "moneys-house-referral-codes";

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

function loadOverrides(): Record<string, string[] | string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REFERRAL_CODES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const REFERRAL_CODES_UPDATED_EVENT = "referral-codes-updated";

function notifyReferralCodesChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REFERRAL_CODES_UPDATED_EVENT));
}

function saveOverrides(overrides: Record<string, string[]>): void {
  localStorage.setItem(REFERRAL_CODES_KEY, JSON.stringify(overrides));
  notifyReferralCodesChanged();
}

function getDefaultCodes(appId: string): string[] {
  const app = apps.find((a) => a.id === appId);
  return app?.referralCodes?.filter(Boolean) ?? [];
}

export function getReferralCodes(appId: string): string[] {
  const overrides = loadOverrides();
  if (overrides[appId] !== undefined) return normalizeCodes(overrides[appId]);
  return getDefaultCodes(appId);
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

export function setReferralCodes(appId: string, codes: string[]): void {
  const overrides = loadOverrides();
  const normalized = normalizeCodes(codes);
  const stored: Record<string, string[]> = {};
  for (const [id, value] of Object.entries(overrides)) {
    stored[id] = normalizeCodes(value);
  }
  stored[appId] = normalized;
  saveOverrides(stored);
}

export function addReferralCode(appId: string, code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;
  const current = getReferralCodes(appId);
  if (current.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return false;
  setReferralCodes(appId, [...current, trimmed]);
  return true;
}

export function removeReferralCode(appId: string, code: string): void {
  const current = getReferralCodes(appId);
  setReferralCodes(
    appId,
    current.filter((c) => c !== code)
  );
}

export function hasReferralProgram(appId: string): boolean {
  const app = apps.find((a) => a.id === appId);
  return app?.hasReferral !== false;
}
