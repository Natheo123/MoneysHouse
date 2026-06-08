import type { AppLink, Category, Platform } from "@/types";
import { buildAppLogoUrl } from "@/lib/app-logos";
import { createEmptyDraft, slugifyAppName, type StoredCustomApp } from "@/lib/custom-apps-shared";

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i"
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHtmlEntities(m[1].trim());
  }
  return null;
}

function extractTitle(html: string): string | null {
  const og = extractMeta(html, "og:title");
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeHtmlEntities(m[1].trim()) : null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'");
}

function inferPlatforms(text: string): Platform[] {
  const lower = text.toLowerCase();
  const found = new Set<Platform>();
  if (/android|google play|play\.google/.test(lower)) found.add("android");
  if (/ios|iphone|ipad|app store|apps\.apple/.test(lower)) found.add("ios");
  if (/windows|microsoft store/.test(lower)) found.add("windows");
  if (/linux|ubuntu|debian/.test(lower)) found.add("linux");
  if (/web app|navigateur|browser|dashboard/.test(lower)) found.add("web");
  return found.size ? [...found] : ["web"];
}

function inferCategories(text: string): Category[] {
  const lower = text.toLowerCase();
  const found = new Set<Category>();
  if (/bande passante|bandwidth|passive|passif|earn|honeygain/.test(lower))
    found.add("bandwidth");
  if (/sondage|survey|opinion/.test(lower)) found.add("surveys");
  if (/sms|text message/.test(lower)) found.add("sms");
  if (/game|jeu|gaming/.test(lower)) found.add("games");
  if (/passive|passif|revenu/.test(lower)) found.add("passive");
  return found.size ? [...found] : ["passive"];
}

function inferColor(html: string): string {
  const theme = extractMeta(html, "theme-color");
  if (theme && /^#?[0-9a-f]{3,8}$/i.test(theme)) {
    return theme.startsWith("#") ? theme : `#${theme}`;
  }
  return "#AB9FF2";
}

function buildDownloadLinks(url: string, html: string): AppLink[] {
  const links: AppLink[] = [{ platform: "signup", label: "Site officiel", url }];
  const playMatch = html.match(
    /https?:\/\/play\.google\.com\/store\/apps\/details\?id=[^"'\s]+/i
  );
  const appleMatch = html.match(/https?:\/\/apps\.apple\.com\/[^"'\s]+/i);
  if (playMatch) {
    links.push({ platform: "android", label: "Google Play", url: playMatch[0] });
  }
  if (appleMatch) {
    links.push({ platform: "ios", label: "App Store", url: appleMatch[0] });
  }
  if (!playMatch && !appleMatch) {
    links.push({ platform: "web", label: "Accéder", url });
  }
  return links;
}

export async function researchAppFromUrl(
  inputUrl: string,
  nameHint?: string
): Promise<{ ok: true; draft: StoredCustomApp; hints: string[] } | { ok: false; error: string }> {
  let url = inputUrl.trim();
  if (!url) return { ok: false, error: "URL requise." };
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: "URL invalide." };
  }

  const hints: string[] = [];

  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MoneysHouseBot/1.0; +https://moneys-house.vercel.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(12_000),
      redirect: "follow",
    });

    if (!res.ok) {
      return { ok: false, error: `Impossible d'accéder au site (${res.status}).` };
    }

    const html = (await res.text()).slice(0, 500_000);
    const title = nameHint?.trim() || extractTitle(html) || parsed.hostname.replace(/^www\./, "");
    const description =
      extractMeta(html, "og:description") ||
      extractMeta(html, "description") ||
      `Application ${title} — informations à compléter.`;
    const shortDescription = description.slice(0, 160);
    const image = extractMeta(html, "og:image");
    const textBlob = `${html.slice(0, 50_000)} ${description}`;

    const draft = createEmptyDraft(title, parsed.toString());
    draft.slug = slugifyAppName(title);
    draft.id = draft.slug;
    draft.description = description;
    draft.shortDescription = shortDescription;
    draft.color = inferColor(html);
    draft.platforms = inferPlatforms(textBlob);
    draft.categories = inferCategories(textBlob);
    draft.downloadLinks = buildDownloadLinks(parsed.toString(), html);
    draft.logoUrl = image || buildAppLogoUrl(parsed.origin);
    draft.howItWorks = `Découvrez comment ${title} fonctionne sur ${parsed.hostname}.`;
    draft.advantages = ["À compléter après vérification"];
    draft.disadvantages = ["À compléter après vérification"];
    draft.tutorial = [
      {
        step: 1,
        title: "Créer un compte",
        description: `Inscrivez-vous sur ${parsed.hostname}.`,
      },
    ];
    draft.faq = [
      {
        question: `Comment utiliser ${title} ?`,
        answer: "Consultez le site officiel pour les instructions détaillées.",
      },
    ];

    hints.push("Titre et description extraits des balises meta du site.");
    if (image) hints.push("Logo/image détectée (Open Graph).");
    if (draft.platforms.length) hints.push(`Plateformes détectées : ${draft.platforms.join(", ")}`);
    hints.push("Vérifiez et corrigez les champs avant de publier.");

    return { ok: true, draft, hints };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erreur réseau.";
    return { ok: false, error: msg };
  }
}
