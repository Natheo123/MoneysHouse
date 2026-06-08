import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import {
  getSiteMembersServer,
  sendAdminNotificationServer,
} from "@/lib/members-notifications-store";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

export async function GET() {
  const members = await getSiteMembersServer();
  return NextResponse.json({
    ok: true,
    members: members.map((m) => ({ email: m.email, name: m.name, registeredAt: m.registeredAt })),
    count: members.length,
  });
}

export async function POST(request: NextRequest) {
  let body: {
    requestedBy?: string;
    target?: string;
    message?: string;
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

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const targetRaw = typeof body.target === "string" ? body.target.trim() : "";
  if (!message) {
    return NextResponse.json({ ok: false, error: "Le message est obligatoire." }, { status: 400 });
  }

  const target = targetRaw.toLowerCase() === "all" ? "all" : normalizeEmail(targetRaw);
  if (target !== "all" && !target.includes("@")) {
    return NextResponse.json({ ok: false, error: "Cible invalide." }, { status: 400 });
  }

  const result = await sendAdminNotificationServer({ target, message });
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
