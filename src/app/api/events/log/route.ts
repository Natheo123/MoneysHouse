import { NextRequest, NextResponse } from "next/server";
import { getAppBySlugServer } from "@/lib/apps-catalog-server";
import {
  logAppLinkClickToDiscord,
  logAppVisitToDiscord,
  logSignupToDiscord,
} from "@/lib/discord-webhook-log";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const type = body.type;

  if (type === "signup") {
    const name = isNonEmptyString(body.name) ? body.name.trim() : "";
    const email = isNonEmptyString(body.email) ? body.email.trim().toLowerCase() : "";
    if (!name || !email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Données invalides." }, { status: 400 });
    }

    const sent = await logSignupToDiscord({ name, email });
    if (!sent) {
      console.warn("Signup log non envoyé sur Discord (webhook absent ou refusé).");
    }
    return NextResponse.json({ ok: true, sent });
  }

  if (type === "app-visit") {
    const appId = isNonEmptyString(body.appId) ? body.appId.trim() : "";
    const appSlug = isNonEmptyString(body.appSlug) ? body.appSlug.trim() : "";
    const appName = isNonEmptyString(body.appName) ? body.appName.trim() : "";

    if (!appId || !appSlug || !appName) {
      return NextResponse.json({ ok: false, error: "Données invalides." }, { status: 400 });
    }

    const catalogApp = await getAppBySlugServer(appSlug);
    if (!catalogApp || catalogApp.id !== appId) {
      return NextResponse.json({ ok: false, error: "Application introuvable." }, { status: 400 });
    }

    const userName = isNonEmptyString(body.userName) ? body.userName.trim() : undefined;
    const userEmail = isNonEmptyString(body.userEmail) ? body.userEmail.trim().toLowerCase() : undefined;

    const sent = await logAppVisitToDiscord({
      appId,
      appName,
      appSlug,
      userName,
      userEmail,
    });

    if (!sent) {
      console.warn("App visit log non envoyé sur Discord (webhook absent ou refusé).");
    }

    return NextResponse.json({ ok: true, sent });
  }

  if (type === "app-link") {
    const appId = isNonEmptyString(body.appId) ? body.appId.trim() : "";
    const appSlug = isNonEmptyString(body.appSlug) ? body.appSlug.trim() : "";
    const appName = isNonEmptyString(body.appName) ? body.appName.trim() : "";
    const linkLabel = isNonEmptyString(body.linkLabel) ? body.linkLabel.trim() : "";
    const linkUrl = isNonEmptyString(body.linkUrl) ? body.linkUrl.trim() : "";

    if (!appId || !appSlug || !appName || !linkLabel || !linkUrl) {
      return NextResponse.json({ ok: false, error: "Données invalides." }, { status: 400 });
    }

    const catalogApp = await getAppBySlugServer(appSlug);
    if (!catalogApp || catalogApp.id !== appId) {
      return NextResponse.json({ ok: false, error: "Application introuvable." }, { status: 400 });
    }

    const platform = isNonEmptyString(body.platform) ? body.platform.trim() : undefined;
    const userName = isNonEmptyString(body.userName) ? body.userName.trim() : undefined;
    const userEmail = isNonEmptyString(body.userEmail) ? body.userEmail.trim().toLowerCase() : undefined;

    const sent = await logAppLinkClickToDiscord({
      appId,
      appName,
      appSlug,
      linkLabel,
      linkUrl,
      platform,
      userName,
      userEmail,
    });

    if (!sent) {
      console.warn("App link log non envoyé sur Discord (webhook absent ou refusé).");
    }

    return NextResponse.json({ ok: true, sent });
  }

  return NextResponse.json({ ok: false, error: "Type inconnu." }, { status: 400 });
}
