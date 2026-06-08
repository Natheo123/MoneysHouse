import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/admin-utils";
import { getMemberProfileServer } from "@/lib/members-notifications-store";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim() ?? "";
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Email requis." }, { status: 400 });
  }

  const profile = await getMemberProfileServer(normalizeEmail(email));
  if (!profile) {
    return NextResponse.json({ ok: true, profile: null });
  }

  return NextResponse.json({
    ok: true,
    profile: { email: profile.email, name: profile.name, registeredAt: profile.registeredAt },
  });
}
