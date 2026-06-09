export const PUBLIC_AUTH_PATHS = ["/connexion", "/inscription"] as const;

export function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/** Chemin de retour sûr après connexion ou inscription. */
export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  if (isPublicAuthPath(next)) return "/";
  return next;
}
