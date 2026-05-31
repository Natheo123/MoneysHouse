import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import {
  addReviewServer,
  getAllReviewsServer,
  getReviewsForAppServer,
  removeReviewServer,
} from "@/lib/reviews-store";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

export async function GET(request: NextRequest) {
  const appId = request.nextUrl.searchParams.get("appId");

  if (appId) {
    const reviews = await getReviewsForAppServer(appId);
    return NextResponse.json({ reviews });
  }

  const reviews = await getAllReviewsServer();
  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest) {
  let body: {
    action?: string;
    appId?: string;
    userId?: string;
    userName?: string;
    rating?: number;
    comment?: string;
    id?: string;
    requestedBy?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  if (body.action === "add") {
    const userId = body.userId?.trim();
    const userName = body.userName?.trim();
    const appId = body.appId?.trim();
    const comment = body.comment?.trim();

    if (!userId || !userName || !appId || !comment) {
      return NextResponse.json(
        { ok: false, error: "Données d'avis incomplètes." },
        { status: 400 }
      );
    }

    const result = await addReviewServer({
      appId,
      userId,
      userName,
      rating: body.rating ?? 5,
      comment,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  }

  if (body.action === "remove") {
    const requestedBy = body.requestedBy ? normalizeEmail(body.requestedBy) : "";
    if (!requestedBy || !(await isAdminEmail(requestedBy))) {
      return NextResponse.json(
        { ok: false, error: "Seuls les administrateurs peuvent supprimer des avis." },
        { status: 403 }
      );
    }

    const result = await removeReviewServer(body.id ?? "");
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
