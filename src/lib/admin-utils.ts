import { siteConfig } from "@/lib/config";

export const OWNER_EMAIL = siteConfig.ownerEmail;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isOwnerEmail(email: string): boolean {
  return normalizeEmail(email) === normalizeEmail(OWNER_EMAIL);
}
