import { NextRequest, NextResponse } from "next/server";
import { registerSiteMemberServer } from "@/lib/members-notifications-store";

export async function POST(request: NextRequest) {
  let body: { email?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!email || !name) {
    return NextResponse.json({ ok: false, error: "Données invalides." }, { status: 400 });
  }

  const result = await registerSiteMemberServer(email, name);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
