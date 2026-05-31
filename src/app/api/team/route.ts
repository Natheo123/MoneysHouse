import { NextRequest, NextResponse } from "next/server";
import { getAllAdminEmails } from "@/lib/admin-store";
import { normalizeEmail } from "@/lib/admin-utils";
import { enrichTeamWithProfiles } from "@/lib/team-discord";
import {
  addTeamMemberServer,
  getTeamMembersServer,
  removeTeamMemberServer,
  updateTeamMemberRoleServer,
} from "@/lib/team-store";
import { isValidDiscordId, type TeamRole } from "@/lib/team-shared";

async function isAdminEmail(email: string): Promise<boolean> {
  const admins = await getAllAdminEmails();
  return admins.includes(normalizeEmail(email));
}

export async function GET() {
  const members = await getTeamMembersServer();
  const enriched = await enrichTeamWithProfiles(members);
  return NextResponse.json({ members: enriched });
}

export async function POST(request: NextRequest) {
  let body: {
    action?: string;
    discordId?: string;
    role?: TeamRole;
    requestedBy?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const requestedBy = body.requestedBy ? normalizeEmail(body.requestedBy) : "";
  if (!requestedBy || !(await isAdminEmail(requestedBy))) {
    return NextResponse.json(
      { ok: false, error: "Seuls les administrateurs peuvent modifier l'équipe." },
      { status: 403 }
    );
  }

  const discordId = body.discordId?.trim() ?? "";
  if (body.action !== "remove" && !isValidDiscordId(discordId)) {
    return NextResponse.json({ ok: false, error: "ID Discord invalide." }, { status: 400 });
  }

  if (body.action === "add") {
    const role = body.role ?? "member";
    const result = await addTeamMemberServer(discordId, role);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    const enriched = await enrichTeamWithProfiles(result.members ?? []);
    return NextResponse.json({ ok: true, members: enriched });
  }

  if (body.action === "remove") {
    const result = await removeTeamMemberServer(discordId);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    const enriched = await enrichTeamWithProfiles(result.members ?? []);
    return NextResponse.json({ ok: true, members: enriched });
  }

  if (body.action === "updateRole") {
    const role = body.role ?? "member";
    const result = await updateTeamMemberRoleServer(discordId, role);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    const enriched = await enrichTeamWithProfiles(result.members ?? []);
    return NextResponse.json({ ok: true, members: enriched });
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
