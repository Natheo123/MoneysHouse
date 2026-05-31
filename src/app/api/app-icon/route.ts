import { NextRequest, NextResponse } from "next/server";
import { apps } from "@/lib/data/apps";
import { getItunesAppId } from "@/lib/app-logos";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const appId = request.nextUrl.searchParams.get("appId");
  const app = apps.find((a) => a.id === appId);
  if (!app) {
    return NextResponse.json({ ok: false, error: "Application introuvable." }, { status: 404 });
  }

  const iosUrl = app.downloadLinks.find((l) => l.platform === "ios")?.url;
  const itunesId = iosUrl ? getItunesAppId(iosUrl) : null;
  if (!itunesId) {
    return NextResponse.json({ ok: false, error: "Pas de fiche App Store." }, { status: 404 });
  }

  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${itunesId}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Lookup iTunes impossible." }, { status: 502 });
    }

    const data = (await res.json()) as {
      results?: Array<{ artworkUrl512?: string; artworkUrl100?: string }>;
    };
    const url = data.results?.[0]?.artworkUrl512 ?? data.results?.[0]?.artworkUrl100;
    if (!url) {
      return NextResponse.json({ ok: false, error: "Icône introuvable." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur réseau." }, { status: 502 });
  }
}
