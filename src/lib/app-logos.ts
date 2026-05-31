/** Logo local hébergé dans /public/logos */
export function localAppLogo(filename: string): string {
  return `/logos/${filename}`;
}

/** Icône via le favicon / logo officiel du site (Google Favicon API). */
export function buildAppLogoUrl(siteUrl: string, size = 128): string {
  const encoded = encodeURIComponent(siteUrl);
  return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encoded}&size=${size}`;
}

/** Icône depuis le domaine officiel (sans passer par Play Store). */
export function buildDomainLogoUrl(domain: string, size = 128): string {
  const host = domain.replace(/^https?:\/\//, "").split("/")[0];
  return buildAppLogoUrl(`https://${host}`, size);
}

/** Fallback DuckDuckGo — souvent meilleur pour les petits sites. */
export function buildDuckDuckGoIconUrl(siteUrl: string): string {
  try {
    const host = new URL(siteUrl).hostname;
    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
  } catch {
    return "";
  }
}

/** Extrait l'id numérique App Store depuis une URL iOS. */
export function getItunesAppId(iosUrl: string): string | null {
  const match = iosUrl.match(/\/id(\d+)/);
  return match?.[1] ?? null;
}

/** Extrait l'id de package Android depuis une URL Play Store. */
export function getPlayStorePackageId(playStoreUrl: string): string | null {
  try {
    const id = new URL(playStoreUrl).searchParams.get("id");
    return id?.trim() || null;
  } catch {
    return null;
  }
}

export function resolveAppLogoUrls(app: {
  logoUrl?: string;
  downloadLinks: { platform: string; url: string }[];
}): string[] {
  const candidates: string[] = [];
  if (app.logoUrl) candidates.push(app.logoUrl);

  const platformOrder = ["signup", "web", "ios", "android", "windows", "linux"];
  for (const platform of platformOrder) {
    const link = app.downloadLinks.find((l) => l.platform === platform);
    if (!link?.url) continue;

    try {
      const host = new URL(link.url).hostname;
      const isStorePage =
        host.includes("play.google.com") || host.includes("apps.apple.com");

      if (!isStorePage) {
        candidates.push(buildAppLogoUrl(link.url));
        const ddg = buildDuckDuckGoIconUrl(link.url);
        if (ddg) candidates.push(ddg);
      }
    } catch {
      // ignore invalid URLs
    }
  }

  return [...new Set(candidates.filter(Boolean))];
}

/** @deprecated Ne pas utiliser — renvoie l'icône Google Play, pas celle de l'app. */
export function buildPlayStoreLogoUrl(packageId: string, size = 128): string {
  return buildAppLogoUrl(
    `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`,
    size
  );
}
