import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import { getAllAppsServer } from "@/lib/apps-catalog-server";
import {
  getCustomAppsServer,
  removeCustomAppServer,
  requestDiscordPublishServer,
  upsertCustomAppServer,
} from "@/lib/custom-apps-store";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

export async function GET(request: NextRequest) {
  const customOnly = request.nextUrl.searchParams.get("custom") === "1";
  if (customOnly) {
    const custom = await getCustomAppsServer();
    return NextResponse.json({ apps: custom });
  }
  const apps = await getAllAppsServer();
  return NextResponse.json({ apps });
}

export async function POST(request: NextRequest) {
  let body: { action?: string; app?: unknown; appId?: string; requestedBy?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const requestedBy = body.requestedBy ? normalizeEmail(body.requestedBy) : "";
  if (!requestedBy || !(await isAdminEmail(requestedBy))) {
    return NextResponse.json({ ok: false, error: "Accès admin requis." }, { status: 403 });
  }

  if (body.action === "upsert") {
    const result = await upsertCustomAppServer(body.app);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "remove") {
    const result = await removeCustomAppServer(body.appId ?? "");
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "request-discord") {
    const result = await requestDiscordPublishServer(body.appId ?? "");
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
