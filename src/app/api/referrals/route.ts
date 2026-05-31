import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import {
  addReferralCodeServer,
  addReferralLinkServer,
  getAllReferralDataServer,
  importReferralsServer,
  removeReferralCodeServer,
  removeReferralLinkServer,
  setReferralBonusServer,
} from "@/lib/referrals-store";
import { normalizeAppReferrals, parseStoredEntry } from "@/lib/referrals-shared";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

export async function GET() {
  const referrals = await getAllReferralDataServer();
  return NextResponse.json({ referrals });
}

export async function POST(request: NextRequest) {
  let body: {
    action?: string;
    appId?: string;
    value?: string;
    code?: string;
    link?: string;
    bonusTitle?: string;
    bonusDescription?: string;
    requestedBy?: string;
    data?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const requestedBy = body.requestedBy ? normalizeEmail(body.requestedBy) : "";
  if (!requestedBy || !(await isAdminEmail(requestedBy))) {
    return NextResponse.json(
      { ok: false, error: "Seuls les administrateurs peuvent modifier les parrainages." },
      { status: 403 }
    );
  }

  const appId = body.appId ?? "";

  if (body.action === "addCode") {
    const result = await addReferralCodeServer(appId, body.value ?? body.code ?? "");
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "removeCode") {
    const result = await removeReferralCodeServer(appId, body.value ?? body.code ?? "");
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "addLink") {
    const result = await addReferralLinkServer(appId, body.value ?? body.link ?? "");
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "removeLink") {
    const result = await removeReferralLinkServer(appId, body.value ?? body.link ?? "");
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "setBonus") {
    const result = await setReferralBonusServer(appId, {
      title: body.bonusTitle ?? "",
      description: body.bonusDescription ?? "",
    });
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "import" && body.data) {
    const imported: Record<string, ReturnType<typeof normalizeAppReferrals>> = {};
    for (const [id, raw] of Object.entries(body.data)) {
      imported[id] = normalizeAppReferrals(parseStoredEntry(raw));
    }
    const result = await importReferralsServer(imported);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
