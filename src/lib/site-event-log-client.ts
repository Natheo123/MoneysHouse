export type SiteLogEvent =
  | {
      type: "signup";
      name: string;
      email: string;
    }
  | {
      type: "app-link";
      appId: string;
      appName: string;
      appSlug: string;
      linkLabel: string;
      linkUrl: string;
      platform?: string;
      userName?: string;
      userEmail?: string;
    };

/** Envoie un événement au serveur (fire-and-forget, sans bloquer l'UI). */
export function logSiteEvent(event: SiteLogEvent): void {
  void fetch("/api/events/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => undefined);
}
