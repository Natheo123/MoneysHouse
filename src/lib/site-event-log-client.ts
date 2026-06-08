export type SiteLogEvent =
  | {
      type: "signup";
      name: string;
      email: string;
    }
  | {
      type: "app-visit";
      appId: string;
      appName: string;
      appSlug: string;
      userName?: string;
      userEmail?: string;
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

function postSiteEvent(event: SiteLogEvent): void {
  const payload = JSON.stringify(event);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon("/api/events/log", blob)) return;
  }

  void fetch("/api/events/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

/** Envoie un événement au serveur (fire-and-forget, sans bloquer l'UI). */
export function logSiteEvent(event: SiteLogEvent): void {
  postSiteEvent(event);
}

/** Variante awaitable pour les actions suivies d'une redirection immédiate. */
export async function logSiteEventAsync(event: SiteLogEvent): Promise<void> {
  try {
    await fetch("/api/events/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    postSiteEvent(event);
  }
}
