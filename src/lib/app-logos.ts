/** Icône haute résolution via le favicon / logo officiel (Google Favicon API). */
export function buildAppLogoUrl(siteUrl: string, size = 128): string {
  const encoded = encodeURIComponent(siteUrl);
  return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encoded}&size=${size}`;
}

/** Icône officielle depuis la fiche Google Play. */
export function buildPlayStoreLogoUrl(packageId: string, size = 128): string {
  return buildAppLogoUrl(
    `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`,
    size
  );
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
