import { NextRequest, NextResponse } from "next/server";
import { verifyDiscordBotSecret } from "@/lib/discord-app-shared";
import { getDiscordPendingAppsServer } from "@/lib/custom-apps-store";

export async function GET(request: NextRequest) {
  if (!verifyDiscordBotSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  const apps = await getDiscordPendingAppsServer();
  return NextResponse.json({ ok: true, apps });
}
