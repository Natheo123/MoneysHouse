import { NextRequest, NextResponse } from "next/server";
import { verifyDiscordBotSecret } from "@/lib/discord-app-shared";
import { completeDiscordPublishServer } from "@/lib/discord-app-publish-store";

export async function POST(request: NextRequest) {
  if (!verifyDiscordBotSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  let body: {
    appId?: string;
    ok?: boolean;
    frChannelId?: string;
    enChannelId?: string;
    error?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const appId = body.appId?.trim();
  if (!appId) {
    return NextResponse.json({ ok: false, error: "appId requis." }, { status: 400 });
  }

  const result = await completeDiscordPublishServer(appId, {
    ok: Boolean(body.ok),
    frChannelId: body.frChannelId,
    enChannelId: body.enChannelId,
    error: body.error,
  });

  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
