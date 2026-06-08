export interface Partner {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  discordUrl?: string;
  offers: string[];
  promoText?: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export function slugifyPartner(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function parseStoredPartners(raw: unknown): Partner[] {
  if (!Array.isArray(raw)) return [];
  const result: Partner[] = [];
  for (const item of raw) {
    const p = normalizePartner(item);
    if (p) result.push(p);
  }
  return result.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function normalizePartner(raw: unknown): Partner | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<Partner>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  if (!name) return null;

  const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : slugifyPartner(name);
  const slug = typeof o.slug === "string" && o.slug.trim() ? o.slug.trim() : id;

  return {
    id,
    slug,
    name,
    tagline: typeof o.tagline === "string" ? o.tagline.trim() : "",
    description: typeof o.description === "string" ? o.description.trim() : "",
    logoUrl: typeof o.logoUrl === "string" ? o.logoUrl.trim() : undefined,
    websiteUrl: typeof o.websiteUrl === "string" ? o.websiteUrl.trim() : undefined,
    discordUrl: typeof o.discordUrl === "string" ? o.discordUrl.trim() : undefined,
    offers: Array.isArray(o.offers) ? o.offers.map((x) => String(x).trim()).filter(Boolean) : [],
    promoText: typeof o.promoText === "string" ? o.promoText.trim() : undefined,
    featured: Boolean(o.featured),
    order: typeof o.order === "number" ? o.order : 0,
    createdAt:
      typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString().split("T")[0],
  };
}

export function createEmptyPartner(name: string): Partner {
  const id = slugifyPartner(name) || `partner-${Date.now()}`;
  return {
    id,
    slug: id,
    name,
    tagline: "",
    description: "",
    offers: [],
    featured: false,
    order: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
}
