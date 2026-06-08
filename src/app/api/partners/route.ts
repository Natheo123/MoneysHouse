import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import {
  getPartnersServer,
  removePartnerServer,
  upsertPartnerServer,
} from "@/lib/partners-store";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

export async function GET() {
  const partners = await getPartnersServer();
  return NextResponse.json({ partners });
}

export async function POST(request: NextRequest) {
  let body: {
    action?: string;
    partner?: unknown;
    partnerId?: string;
    requestedBy?: string;
  };
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
    const result = await upsertPartnerServer(body.partner);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "remove") {
    const result = await removePartnerServer(body.partnerId ?? "");
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
