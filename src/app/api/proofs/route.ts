import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import {
  addProofServer,
  getAllProofsServer,
  getProofsForAppServer,
  removeProofServer,
} from "@/lib/proofs-store";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

export async function GET(request: NextRequest) {
  const appId = request.nextUrl.searchParams.get("appId");

  if (appId) {
    const proofs = await getProofsForAppServer(appId);
    return NextResponse.json({ proofs });
  }

  const proofs = await getAllProofsServer();
  return NextResponse.json({ proofs });
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const requestedBy = normalizeEmail(String(formData.get("requestedBy") ?? ""));
  if (!requestedBy || !(await isAdminEmail(requestedBy))) {
    return NextResponse.json(
      { ok: false, error: "Seuls les administrateurs peuvent ajouter des preuves." },
      { status: 403 }
    );
  }

  const appId = String(formData.get("appId") ?? "").trim();
  const caption = String(formData.get("caption") ?? "");
  const file = formData.get("file");

  if (!appId) {
    return NextResponse.json({ ok: false, error: "Application requise." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Image requise." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await addProofServer(appId, buffer, file.type || "image/jpeg", caption);

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest) {
  let body: { appId?: string; proofId?: string; requestedBy?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const requestedBy = body.requestedBy ? normalizeEmail(body.requestedBy) : "";
  if (!requestedBy || !(await isAdminEmail(requestedBy))) {
    return NextResponse.json(
      { ok: false, error: "Seuls les administrateurs peuvent supprimer des preuves." },
      { status: 403 }
    );
  }

  const appId = body.appId ?? "";
  const proofId = body.proofId ?? "";

  if (!appId || !proofId) {
    return NextResponse.json({ ok: false, error: "Paramètres manquants." }, { status: 400 });
  }

  const result = await removeProofServer(appId, proofId);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
