import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/admin-utils";
import { getNotificationsForUserServer } from "@/lib/members-notifications-store";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim() ?? "";
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Email requis." }, { status: 400 });
  }

  const notifications = await getNotificationsForUserServer(normalizeEmail(email));
  return NextResponse.json({ ok: true, notifications });
}
