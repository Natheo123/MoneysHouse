import { NextRequest, NextResponse } from "next/server";
import { resolveAppById } from "@/lib/apps-merge";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import { getAllAppsServer } from "@/lib/apps-catalog-server";
import {
  getCustomAppsServer,
  removeCustomAppServer,
  requestDiscordPublishServer,
  upsertCustomAppServer,
} from "@/lib/custom-apps-store";
import {
  getHiddenAppIdsServer,
  hideAppServer,
  restoreAppServer,
} from "@/lib/hidden-apps-store";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

async function catalogAdminPayload() {
  const [apps, hiddenIds] = await Promise.all([
    getCustomAppsServer(),
    getHiddenAppIdsServer(),
  ]);
  return { apps, hiddenIds };
}

export async function GET(request: NextRequest) {
  const customOnly = request.nextUrl.searchParams.get("custom") === "1";
  if (customOnly) {
    const payload = await catalogAdminPayload();
    return NextResponse.json(payload);
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

  const appId = body.appId?.trim() ?? "";

  if (body.action === "upsert") {
    const result = await upsertCustomAppServer(body.app);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    const payload = await catalogAdminPayload();
    return NextResponse.json({ ...result, ...payload });
  }

  if (body.action === "remove" || body.action === "delete") {
    if (!appId) {
      return NextResponse.json({ ok: false, error: "Application introuvable." }, { status: 400 });
    }

    const custom = await getCustomAppsServer();
    const isCustom = custom.some((app) => app.id === appId);

    if (isCustom) {
      const result = await removeCustomAppServer(appId);
      if (!result.ok) return NextResponse.json(result, { status: 400 });

      const hiddenIds = await getHiddenAppIdsServer();
      if (hiddenIds.includes(appId)) {
        await restoreAppServer(appId);
      }

      const payload = await catalogAdminPayload();
      return NextResponse.json({ ok: true, ...payload });
    }

    const app = resolveAppById(appId, custom);
    if (!app) {
      return NextResponse.json({ ok: false, error: "Application introuvable." }, { status: 400 });
    }

    const result = await hideAppServer(appId);
    if (!result.ok) return NextResponse.json(result, { status: 400 });

    const payload = await catalogAdminPayload();
    return NextResponse.json({ ok: true, ...payload });
  }

  if (body.action === "restore") {
    if (!appId) {
      return NextResponse.json({ ok: false, error: "Application introuvable." }, { status: 400 });
    }

    const result = await restoreAppServer(appId);
    if (!result.ok) return NextResponse.json(result, { status: 400 });

    const payload = await catalogAdminPayload();
    return NextResponse.json({ ok: true, ...payload });
  }

  if (body.action === "request-discord") {
    const result = await requestDiscordPublishServer(appId);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    const payload = await catalogAdminPayload();
    return NextResponse.json({ ...result, ...payload });
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
