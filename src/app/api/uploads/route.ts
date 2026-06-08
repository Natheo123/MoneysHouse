import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import { uploadImageServer } from "@/lib/uploads-store";
import type { UploadKind } from "@/lib/uploads-shared";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
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
    return NextResponse.json({ ok: false, error: "Accès admin requis." }, { status: 403 });
  }

  const kind = String(formData.get("kind") ?? "").trim() as UploadKind;
  if (kind !== "partner" && kind !== "app") {
    return NextResponse.json({ ok: false, error: "Type d'upload invalide." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Image requise." }, { status: 400 });
  }

  const nameHint = String(formData.get("nameHint") ?? "").trim();
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadImageServer(kind, buffer, file.name, file.type, nameHint);

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
