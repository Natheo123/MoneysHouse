import { promises as fs } from "fs";
import path from "path";
import {
  defaultTeamMembers,
  parseStoredTeam,
  type TeamMemberStored,
  type TeamRole,
} from "@/lib/team-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredTeamFromGitHub,
  writeStoredTeamToGitHub,
  type StoredTeam,
} from "@/lib/team-github";

const TEAM_PATH = path.join(process.cwd(), "data", "team.json");

async function readFileTeam(): Promise<TeamMemberStored[]> {
  try {
    const content = await fs.readFile(TEAM_PATH, "utf-8");
    const parsed = parseStoredTeam(JSON.parse(content) as unknown);
    return parsed.length > 0 ? parsed : defaultTeamMembers();
  } catch {
    return defaultTeamMembers();
  }
}

async function writeFileTeam(members: TeamMemberStored[]): Promise<void> {
  await fs.mkdir(path.dirname(TEAM_PATH), { recursive: true });
  await fs.writeFile(TEAM_PATH, `${JSON.stringify(members, null, 2)}\n`, "utf-8");
}

async function readStoredTeam(): Promise<StoredTeam> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredTeamFromGitHub();
      if (github) {
        return {
          ...github,
          members: github.members.length > 0 ? github.members : defaultTeamMembers(),
        };
      }
    } catch {
      // fallback fichier
    }
  }

  return {
    members: await readFileTeam(),
    source: "file",
  };
}

async function writeStoredTeam(stored: StoredTeam, members: TeamMemberStored[]): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredTeamToGitHub(members, stored.sha);
    return;
  }
  await writeFileTeam(members);
}

export async function getTeamMembersServer(): Promise<TeamMemberStored[]> {
  const stored = await readStoredTeam();
  return stored.members;
}

async function mutateTeam(
  mutator: (current: TeamMemberStored[]) => { members: TeamMemberStored[]; error?: string }
): Promise<{ ok: boolean; error?: string; members?: TeamMemberStored[] }> {
  try {
    const stored = await readStoredTeam();
    const { members: next, error } = mutator(stored.members);
    if (error) return { ok: false, error };
    await writeStoredTeam(stored, next);
    return { ok: true, members: next };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

export async function addTeamMemberServer(
  discordId: string,
  role: TeamRole
): Promise<{ ok: boolean; error?: string; members?: TeamMemberStored[] }> {
  const id = discordId.trim();
  return mutateTeam((current) => {
    if (current.some((m) => m.discordId === id)) {
      return { members: current, error: "Cet ID Discord est déjà dans l'équipe." };
    }
    const order = current.length > 0 ? Math.max(...current.map((m) => m.order)) + 1 : 0;
    return { members: [...current, { discordId: id, role, order }] };
  });
}

export async function removeTeamMemberServer(
  discordId: string
): Promise<{ ok: boolean; error?: string; members?: TeamMemberStored[] }> {
  const id = discordId.trim();
  return mutateTeam((current) => {
    if (!current.some((m) => m.discordId === id)) {
      return { members: current, error: "Membre introuvable." };
    }
    return { members: current.filter((m) => m.discordId !== id) };
  });
}

export async function updateTeamMemberRoleServer(
  discordId: string,
  role: TeamRole
): Promise<{ ok: boolean; error?: string; members?: TeamMemberStored[] }> {
  const id = discordId.trim();
  return mutateTeam((current) => {
    if (!current.some((m) => m.discordId === id)) {
      return { members: current, error: "Membre introuvable." };
    }
    return {
      members: current.map((m) => (m.discordId === id ? { ...m, role } : m)),
    };
  });
}
