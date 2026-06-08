import type { App, Category, Difficulty, Platform } from "@/types";

export type StoredCustomApp = App & { custom?: true; sourceUrl?: string };

export function slugifyAppName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function parseStoredCustomApps(raw: unknown): StoredCustomApp[] {
  if (!Array.isArray(raw)) return [];
  const result: StoredCustomApp[] = [];
  for (const item of raw) {
    const app = normalizeCustomApp(item);
    if (app) result.push(app);
  }
  return result;
}

const PLATFORMS: Platform[] = ["android", "ios", "windows", "linux", "web"];
const CATEGORIES: Category[] = ["passive", "surveys", "sms", "bandwidth", "games"];
const DIFFICULTIES: Difficulty[] = ["very-easy", "easy", "medium", "hard"];

export function normalizeCustomApp(raw: unknown): StoredCustomApp | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<StoredCustomApp>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  if (!name) return null;

  const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : slugifyAppName(name);
  const slug = typeof o.slug === "string" && o.slug.trim() ? o.slug.trim() : id;

  return {
    id,
    slug,
    name,
    color: typeof o.color === "string" ? o.color : "#AB9FF2",
    logoUrl:
      typeof o.logoUrl === "string" && o.logoUrl.trim() ? o.logoUrl.trim() : undefined,
    description: typeof o.description === "string" ? o.description : name,
    shortDescription:
      typeof o.shortDescription === "string" ? o.shortDescription : name,
    earningsMin: typeof o.earningsMin === "number" ? o.earningsMin : undefined,
    earningsMax: typeof o.earningsMax === "number" ? o.earningsMax : undefined,
    earningsLabel: typeof o.earningsLabel === "string" ? o.earningsLabel : undefined,
    difficulty: DIFFICULTIES.includes(o.difficulty as Difficulty)
      ? (o.difficulty as Difficulty)
      : "easy",
    difficultyLabel:
      typeof o.difficultyLabel === "string" ? o.difficultyLabel : "Facile",
    platforms: Array.isArray(o.platforms)
      ? o.platforms.filter((p): p is Platform => PLATFORMS.includes(p as Platform))
      : ["web"],
    categories: Array.isArray(o.categories)
      ? o.categories.filter((c): c is Category => CATEGORIES.includes(c as Category))
      : ["passive"],
    downloadLinks: Array.isArray(o.downloadLinks) ? o.downloadLinks : [],
    referralCodes: Array.isArray(o.referralCodes) ? o.referralCodes : [],
    referralLinks: Array.isArray(o.referralLinks) ? o.referralLinks : [],
    referralBonusTitle: typeof o.referralBonusTitle === "string" ? o.referralBonusTitle : undefined,
    referralBonusDescription:
      typeof o.referralBonusDescription === "string" ? o.referralBonusDescription : undefined,
    referralFaqHint: typeof o.referralFaqHint === "string" ? o.referralFaqHint : undefined,
    referralInstructions:
      typeof o.referralInstructions === "string"
        ? o.referralInstructions
        : "Instructions de parrainage à compléter.",
    hasReferral: o.hasReferral !== false,
    howItWorks: typeof o.howItWorks === "string" ? o.howItWorks : "",
    advantages: Array.isArray(o.advantages) ? o.advantages.map(String) : [],
    disadvantages: Array.isArray(o.disadvantages) ? o.disadvantages.map(String) : [],
    tutorial: Array.isArray(o.tutorial) ? o.tutorial : [],
    faq: Array.isArray(o.faq) ? o.faq : [],
    featured: Boolean(o.featured),
    custom: true,
    sourceUrl: typeof o.sourceUrl === "string" ? o.sourceUrl : undefined,
  };
}

export function createEmptyDraft(name: string, sourceUrl?: string): StoredCustomApp {
  const id = slugifyAppName(name) || `app-${Date.now()}`;
  return {
    id,
    slug: id,
    name,
    color: "#AB9FF2",
    description: "",
    shortDescription: "",
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["web"],
    categories: ["passive"],
    downloadLinks: sourceUrl
      ? [{ platform: "web", label: "Site officiel", url: sourceUrl }]
      : [],
    referralCodes: [],
    referralInstructions: "",
    howItWorks: "",
    advantages: [],
    disadvantages: [],
    tutorial: [],
    faq: [],
    featured: false,
    custom: true,
    sourceUrl,
  };
}
