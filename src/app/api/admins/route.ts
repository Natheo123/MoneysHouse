import { NextRequest, NextResponse } from "next/server";
import {
  addExtraAdmin,
  getAllAdminEmails,
  removeExtraAdmin,
} from "@/lib/admin-store";
import { isOwnerEmail, normalizeEmail } from "@/lib/admin-utils";

export async function GET() {
  const emails = await getAllAdminEmails();
  return NextResponse.json({ emails });
}

export async function POST(request: NextRequest) {
  let body: { action?: string; email?: string; requestedBy?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const requestedBy = body.requestedBy ? normalizeEmail(body.requestedBy) : "";
  if (!requestedBy || !isOwnerEmail(requestedBy)) {
    return NextResponse.json(
      { ok: false, error: "Seul le propriétaire peut gérer les administrateurs." },
      { status: 403 }
    );
  }

  if (body.action === "add") {
    const result = await addExtraAdmin(body.email ?? "");
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json({ ok: true, emails: await getAllAdminEmails() });
  }

  if (body.action === "remove") {
    const result = await removeExtraAdmin(body.email ?? "");
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json({ ok: true, emails: await getAllAdminEmails() });
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
