import { NextRequest, NextResponse } from "next/server";
import { verifyDiscordBotSecret } from "@/lib/discord-app-shared";
import { getDiscordStaffPermissionsServer } from "@/lib/discord-staff-store";

export async function GET(request: NextRequest) {
  if (!verifyDiscordBotSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  const permissions = await getDiscordStaffPermissionsServer();
  return NextResponse.json({ ok: true, ...permissions });
}
