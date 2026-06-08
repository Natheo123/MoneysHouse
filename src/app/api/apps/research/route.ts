import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import { researchAppFromUrl } from "@/lib/app-research";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

export async function POST(request: NextRequest) {
  let body: { url?: string; name?: string; requestedBy?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const requestedBy = body.requestedBy ? normalizeEmail(body.requestedBy) : "";
  if (!requestedBy || !(await isAdminEmail(requestedBy))) {
    return NextResponse.json({ ok: false, error: "Accès admin requis." }, { status: 403 });
  }

  const result = await researchAppFromUrl(body.url ?? "", body.name);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
