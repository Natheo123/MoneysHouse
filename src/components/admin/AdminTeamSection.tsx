"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { TeamMemberPublic, TeamRole } from "@/lib/team-shared";
import { isValidDiscordId } from "@/lib/team-shared";

const ROLES: TeamRole[] = ["founder", "admin", "moderator", "member"];

const roleLabels: Record<TeamRole, string> = {
  founder: "Fondateur",
  admin: "Admin",
  moderator: "Modérateur",
  member: "Membre",
};

interface AdminTeamSectionProps {
  userEmail: string;
}

export function AdminTeamSection({ userEmail }: AdminTeamSectionProps) {
  const [members, setMembers] = useState<TeamMemberPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState("");
  const [newRole, setNewRole] = useState<TeamRole>("member");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { members?: TeamMemberPublic[] };
        setMembers(data.members ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const postAction = async (payload: Record<string, string>) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, requestedBy: userEmail }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; members?: TeamMemberPublic[] };
      if (!data.ok) {
        setError(data.error ?? "Erreur lors de l'enregistrement.");
        return;
      }
      setMembers(data.members ?? []);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    const id = newId.trim();
    if (!isValidDiscordId(id)) {
      setError("ID Discord invalide (17–20 chiffres).");
      return;
    }
    await postAction({ action: "add", discordId: id, role: newRole });
    setNewId("");
  };

  const handleRemove = async (discordId: string) => {
    await postAction({ action: "remove", discordId });
  };

  const handleRoleChange = async (discordId: string, role: TeamRole) => {
    await postAction({ action: "updateRole", discordId, role });
  };

  return (
    <section className="rounded-[32px] border border-phantom-dark/10 bg-phantom-surface p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Users className="h-6 w-6 text-phantom-purple" />
        <h2 className="text-2xl font-semibold text-phantom-dark">Équipe (Discord)</h2>
      </div>
      <p className="text-sm text-phantom-gray mb-6">
        Gérez les membres affichés sur la page{" "}
        <a href="/equipe" className="text-phantom-purple hover:underline">
          Notre équipe
        </a>
        . Ajoutez un ID Discord (clic droit sur profil → Copier l&apos;identifiant).
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="ID Discord (ex. 317358740124991488)"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          className="flex-1 font-mono text-sm"
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as TeamRole)}
          className="h-10 rounded-[16px] border border-phantom-dark/10 bg-phantom-bg px-3 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </select>
        <Button onClick={handleAdd} disabled={saving || !newId.trim()} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-phantom-gray">Chargement…</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-phantom-gray">Aucun membre configuré.</p>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => (
            <li
              key={member.discordId}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-[20px] bg-phantom-bg border border-phantom-dark/5"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={member.profile?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}
                  alt=""
                  className="w-10 h-10 rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-medium text-phantom-dark truncate">
                    {member.profile?.globalName || member.profile?.username || member.discordId}
                  </p>
                  <p className="text-xs text-phantom-gray font-mono truncate">{member.discordId}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 hidden sm:inline-flex">
                  {roleLabels[member.role]}
                </Badge>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.discordId, e.target.value as TeamRole)}
                  disabled={saving}
                  className="h-9 rounded-[12px] border border-phantom-dark/10 bg-white px-2 text-xs"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {roleLabels[r]}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(member.discordId)}
                  disabled={saving}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
