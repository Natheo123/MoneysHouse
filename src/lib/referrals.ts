import { apps } from "@/lib/data/apps";

const REFERRAL_CODES_KEY = "moneys-house-referral-codes";

function loadOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REFERRAL_CODES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, string>): void {
  localStorage.setItem(REFERRAL_CODES_KEY, JSON.stringify(overrides));
}

export function getReferralCode(appId: string): string {
  const overrides = loadOverrides();
  if (overrides[appId] !== undefined) return overrides[appId];
  const app = apps.find((a) => a.id === appId);
  return app?.referralCode ?? "";
}

export function getAllReferralCodes(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const app of apps) {
    result[app.id] = getReferralCode(app.id);
  }
  return result;
}

export function setReferralCode(appId: string, code: string): void {
  const overrides = loadOverrides();
  overrides[appId] = code.trim();
  saveOverrides(overrides);
}

export function hasReferralProgram(appId: string): boolean {
  const app = apps.find((a) => a.id === appId);
  return app?.hasReferral !== false;
}
