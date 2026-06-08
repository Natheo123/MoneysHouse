"use client";

import { useState } from "react";
import { Crown, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { ADMIN_ROLE_LABELS, type AdminRole } from "@/lib/admin-shared";
import { useAdmin, OWNER_EMAIL } from "@/context/AdminContext";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AdminManageSectionProps {
  userEmail: string;
}

export function AdminManageSection({ userEmail }: AdminManageSectionProps) {
  const { t } = useTranslation();
  const {
    adminEmails,
    adminMembers,
    isOwner,
    getRole,
    canManageAdmins,
    canChangeRoles,
    addAdmin,
    removeAdmin,
    setAdminRole,
    setAdminDiscordId,
  } = useAdmin();

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminDiscordId, setNewAdminDiscordId] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>("member");
  const [adminError, setAdminError] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [savingDiscordId, setSavingDiscordId] = useState<string | null>(null);
  const [discordDrafts, setDiscordDrafts] = useState<Record<string, string>>({});

  const userIsOwner = isOwner(userEmail);
  const userCanManage = canManageAdmins(userEmail);

  if (!userCanManage) return null;

  const handleAddAdmin = async () => {
    setAdminError("");
    setAddingAdmin(true);
    const role = userIsOwner ? newAdminRole : "member";
    const result = await addAdmin(
      newAdminEmail,
      userEmail,
      role,
      newAdminDiscordId.trim() || undefined
    );
    setAddingAdmin(false);
    if (result.ok) {
      setNewAdminEmail("");
      setNewAdminDiscordId("");
      setNewAdminRole("member");
    } else {
      setAdminError(result.error ?? "Erreur");
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    const result = await removeAdmin(email, userEmail);
    if (!result.ok) setAdminError(result.error ?? "Erreur");
    else setAdminError("");
  };

  const handleRoleChange = async (email: string, role: AdminRole) => {
    setUpdatingRole(email);
    const result = await setAdminRole(email, role, userEmail);
    setUpdatingRole(null);
    if (!result.ok) setAdminError(result.error ?? "Erreur");
    else setAdminError("");
  };

  const handleSaveDiscordId = async (email: string) => {
    setSavingDiscordId(email);
    const draft = discordDrafts[email] ?? adminMembers.find((m) => m.email === email)?.discordId ?? "";
    const result = await setAdminDiscordId(email, draft.trim(), userEmail);
    setSavingDiscordId(null);
    if (!result.ok) setAdminError(result.error ?? "Erreur");
    else setAdminError("");
  };

  const roleBadge = (email: string) => {
    const role = getRole(email);
    if (role === "owner") {
      return (
        <Badge variant="secondary" className="text-xs gap-1">
          <Crown className="h-3 w-3" /> {t("admin.owner")}
        </Badge>
      );
    }
    if (role === "manager") {
      return (
        <Badge variant="secondary" className="text-xs gap-1">
          <Users className="h-3 w-3" /> {t("admin.manager")}
        </Badge>
      );
    }
    if (role === "member") {
      return (
        <Badge variant="outline" className="text-xs gap-1">
          <ShieldCheck className="h-3 w-3" /> {t("admin.editor")}
        </Badge>
      );
    }
    return null;
  };

  const canRemove = (email: string) => {
    if (isOwner(email)) return false;
    const actorRole = getRole(userEmail);
    const targetRole = getRole(email);
    if (!actorRole || !targetRole || targetRole === "owner") return false;
    if (actorRole === "owner") return true;
    if (actorRole === "manager") return targetRole === "member";
    return false;
  };

  return (
    <section className="mb-12 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5">
      <h2 className="text-xl font-semibold text-phantom-dark mb-2 flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        {t("admin.manageAdminsTitle")}
      </h2>
      <p className="text-sm text-phantom-gray mb-6">
        {t("admin.manageAdminsHint", { owner: OWNER_EMAIL })}
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <Input
          type="email"
          placeholder={t("admin.manageAdminsEmailPlaceholder")}
          value={newAdminEmail}
          onChange={(e) => setNewAdminEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleAddAdmin();
          }}
          className="flex-1"
        />
        <Input
          type="text"
          inputMode="numeric"
          placeholder={t("admin.manageAdminsDiscordPlaceholder")}
          value={newAdminDiscordId}
          onChange={(e) => setNewAdminDiscordId(e.target.value)}
          className="sm:w-52"
        />
        {userIsOwner && (
          <select
            value={newAdminRole}
            onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
            className="rounded-[16px] border border-phantom-dark/10 bg-phantom-bg px-4 py-3 text-phantom-dark focus:outline-none focus:ring-2 focus:ring-phantom-purple sm:w-44"
            aria-label="Rôle du nouvel administrateur"
          >
            <option value="member">{ADMIN_ROLE_LABELS.member}</option>
            <option value="manager">{ADMIN_ROLE_LABELS.manager}</option>
          </select>
        )}
        <Button
          onClick={() => void handleAddAdmin()}
          disabled={!newAdminEmail.trim() || addingAdmin}
          className="shrink-0"
        >
          {addingAdmin ? t("admin.manageAdminsAdding") : t("admin.manageAdminsAdd")}
        </Button>
      </div>
      {!userIsOwner && (
        <p className="text-xs text-phantom-gray mb-4">{t("admin.manageAdminsManagerHint")}</p>
      )}
      {adminError && <p className="text-red-500 text-sm mb-4">{adminError}</p>}

      <ul className="space-y-2">
        {adminEmails.map((email) => {
          const member = adminMembers.find((m) => m.email === email);
          const showRoleSelect =
            canChangeRoles(userEmail) && !isOwner(email) && member;
          const discordValue =
            discordDrafts[email] ?? member?.discordId ?? "";

          return (
            <li
              key={email}
              className="flex flex-col gap-3 p-4 rounded-[20px] bg-phantom-bg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-phantom-dark text-sm break-all">{email}</span>
                <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                  {showRoleSelect ? (
                    <select
                      value={member.role}
                      disabled={updatingRole === email}
                      onChange={(e) =>
                        void handleRoleChange(email, e.target.value as AdminRole)
                      }
                      className="rounded-[12px] border border-phantom-dark/10 bg-phantom-surface px-3 py-1.5 text-sm text-phantom-dark focus:outline-none focus:ring-2 focus:ring-phantom-purple"
                      aria-label={`Rôle de ${email}`}
                    >
                      <option value="member">{ADMIN_ROLE_LABELS.member}</option>
                      <option value="manager">{ADMIN_ROLE_LABELS.manager}</option>
                    </select>
                  ) : (
                    roleBadge(email)
                  )}
                  {canRemove(email) && (
                    <button
                      onClick={() => void handleRemoveAdmin(email)}
                      className="p-2 rounded-full hover:bg-red-100 text-phantom-gray hover:text-red-500 transition-colors"
                      title="Retirer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              {!isOwner(email) && member && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder={t("admin.manageAdminsDiscordPlaceholder")}
                    value={discordValue}
                    onChange={(e) =>
                      setDiscordDrafts((prev) => ({ ...prev, [email]: e.target.value }))
                    }
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={savingDiscordId === email}
                    onClick={() => void handleSaveDiscordId(email)}
                    className="shrink-0"
                  >
                    {savingDiscordId === email
                      ? t("admin.manageAdminsSavingDiscord")
                      : t("admin.manageAdminsSaveDiscord")}
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
