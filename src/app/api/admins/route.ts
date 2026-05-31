import { NextRequest, NextResponse } from "next/server";
import {
  addExtraAdmin,
  assertCanChangeRoles,
  assertCanManageAdmins,
  assertCanRemoveAdmin,
  getAdminMembers,
  getAllAdminEmails,
  removeExtraAdmin,
  setExtraAdminRole,
} from "@/lib/admin-store";
import { isAdminRole } from "@/lib/admin-shared";
import { normalizeEmail, OWNER_EMAIL } from "@/lib/admin-utils";

export async function GET() {
  const admins = await getAdminMembers();
  const emails = await getAllAdminEmails();
  return NextResponse.json({ emails, admins, ownerEmail: OWNER_EMAIL });
}

export async function POST(request: NextRequest) {
  let body: {
    action?: string;
    email?: string;
    role?: string;
    requestedBy?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const requestedBy = body.requestedBy ? normalizeEmail(body.requestedBy) : "";
  if (!requestedBy) {
    return NextResponse.json({ ok: false, error: "Authentification requise." }, { status: 403 });
  }

  if (body.action === "add") {
    const permission = await assertCanManageAdmins(requestedBy);
    if (!permission.ok) {
      return NextResponse.json(permission, { status: 403 });
    }

    let role = isAdminRole(body.role) ? body.role : "member";
    if (permission.role === "manager") {
      role = "member";
    }

    const result = await addExtraAdmin(body.email ?? "", role);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      emails: await getAllAdminEmails(),
      admins: await getAdminMembers(),
    });
  }

  if (body.action === "remove") {
    const target = normalizeEmail(body.email ?? "");
    const permission = await assertCanRemoveAdmin(requestedBy, target);
    if (!permission.ok) {
      return NextResponse.json(permission, { status: 403 });
    }

    const result = await removeExtraAdmin(target);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      emails: await getAllAdminEmails(),
      admins: await getAdminMembers(),
    });
  }

  if (body.action === "setRole") {
    const permission = await assertCanChangeRoles(requestedBy);
    if (!permission.ok) {
      return NextResponse.json(permission, { status: 403 });
    }

    if (!isAdminRole(body.role)) {
      return NextResponse.json({ ok: false, error: "Rôle invalide." }, { status: 400 });
    }

    const result = await setExtraAdminRole(body.email ?? "", body.role);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      emails: await getAllAdminEmails(),
      admins: await getAdminMembers(),
    });
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
