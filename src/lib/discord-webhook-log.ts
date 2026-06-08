import "server-only";

import { siteConfig } from "@/lib/config";

const WEBHOOK_URL = process.env.DISCORD_SITE_LOG_WEBHOOK_URL?.trim();

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
  footer?: { text: string };
}

async function postDiscordLog(embed: DiscordEmbed): Promise<void> {
  if (!WEBHOOK_URL) return;

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: `${siteConfig.name} — Logs`,
      embeds: [{ ...embed, timestamp: embed.timestamp ?? new Date().toISOString() }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Discord log webhook failed:", res.status, detail.slice(0, 200));
  }
}

function clip(value: string, max = 900): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export async function logSignupToDiscord(payload: {
  name: string;
  email: string;
}): Promise<void> {
  await postDiscordLog({
    title: "🆕 Nouveau compte",
    color: 0x57f287,
    fields: [
      { name: "Prénom", value: clip(payload.name.trim() || "—"), inline: true },
      { name: "Email", value: clip(payload.email.trim().toLowerCase()), inline: true },
    ],
    footer: { text: siteConfig.url.replace(/^https?:\/\//, "") },
  });
}

export async function logAppLinkClickToDiscord(payload: {
  appId: string;
  appName: string;
  appSlug: string;
  linkLabel: string;
  linkUrl: string;
  platform?: string;
  userName?: string;
  userEmail?: string;
}): Promise<void> {
  const userLine =
    payload.userEmail?.trim()
      ? `${payload.userName?.trim() || "Utilisateur"} (${payload.userEmail.trim().toLowerCase()})`
      : "Visiteur non connecté";

  await postDiscordLog({
    title: "🔗 Clic lien application",
    color: 0xab9ff2,
    description: `Quelqu'un part vers **${payload.appName}** via Money's House.`,
    fields: [
      { name: "Application", value: clip(payload.appName), inline: true },
      { name: "Lien", value: clip(payload.linkLabel), inline: true },
      { name: "Plateforme", value: clip(payload.platform?.trim() || "—"), inline: true },
      { name: "Utilisateur", value: clip(userLine), inline: false },
      {
        name: "Fiche site",
        value: `${siteConfig.url}/apps/${payload.appSlug}`,
        inline: false,
      },
      { name: "Destination", value: clip(payload.linkUrl), inline: false },
    ],
    footer: { text: `app:${payload.appId}` },
  });
}
