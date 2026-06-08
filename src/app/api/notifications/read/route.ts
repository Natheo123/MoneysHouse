import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/admin-utils";
import { markNotificationReadServer } from "@/lib/members-notifications-store";

export async function POST(request: NextRequest) {
  let body: { email?: string; notificationId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const notificationId = typeof body.notificationId === "string" ? body.notificationId.trim() : "";
  if (!email.includes("@") || !notificationId) {
    return NextResponse.json({ ok: false, error: "Données invalides." }, { status: 400 });
  }

  const result = await markNotificationReadServer(email, notificationId);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
