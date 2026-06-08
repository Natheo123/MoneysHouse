export interface TipsSettings {
  enabled: boolean;
  paypalUrl: string;
  updatedAt?: string;
}

export const DEFAULT_TIPS_SETTINGS: TipsSettings = {
  enabled: false,
  paypalUrl: "",
};

export function isValidPaypalUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return /(^|\.)paypal\.(com|me)$/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

export function normalizePaypalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol;
}

export function normalizeTipsSettings(raw: unknown): TipsSettings {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_TIPS_SETTINGS };

  const o = raw as Partial<TipsSettings>;
  const paypalUrl =
    typeof o.paypalUrl === "string" ? normalizePaypalUrl(o.paypalUrl) : "";

  return {
    enabled: Boolean(o.enabled) && Boolean(paypalUrl) && isValidPaypalUrl(paypalUrl),
    paypalUrl: paypalUrl && isValidPaypalUrl(paypalUrl) ? paypalUrl : "",
    updatedAt:
      typeof o.updatedAt === "string" ? o.updatedAt : new Date().toISOString().split("T")[0],
  };
}
