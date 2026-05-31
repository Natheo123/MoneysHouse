"use client";

import { ExternalLink } from "lucide-react";
import type { TeamMemberPublic } from "@/lib/team-shared";
import { useTranslation } from "@/context/LanguageContext";

const roleColors: Record<string, string> = {
  founder: "#ab9ff2",
  admin: "#5865f2",
  moderator: "#3ba55d",
  member: "#949ba4",
};

export function TeamMemberCard({ member }: { member: TeamMemberPublic }) {
  const { t } = useTranslation();
  const profile = member.profile;
  const displayName = profile?.globalName || profile?.username || `User ${member.discordId.slice(-4)}`;
  const username = profile?.username ? `@${profile.username}` : `@user_${member.discordId.slice(-4)}`;
  const banner = profile?.bannerUrl;
  const accent = profile?.accentColor
    ? `#${profile.accentColor.toString(16).padStart(6, "0")}`
    : "#5865F2";
  const roleColor = roleColors[member.role] ?? roleColors.member;

  return (
    <article className="w-full max-w-[300px] mx-auto rounded-2xl overflow-hidden bg-[#232428] shadow-[0_8px_24px_rgba(0,0,0,0.25)] border border-[#1e1f22]">
      {/* Bannière Discord */}
      <div
        className="h-[60px] w-full bg-cover bg-center"
        style={{
          background: banner
            ? `url(${banner}) center/cover no-repeat`
            : `linear-gradient(135deg, ${accent} 0%, #232428 100%)`,
        }}
      />

      {/* Corps profil */}
      <div className="px-4 pb-4">
        {/* Avatar centré — style popout Discord */}
        <div className="flex flex-col items-center -mt-[42px]">
          <div className="relative shrink-0">
            <img
              src={profile?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}
              alt={displayName}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border-[6px] border-[#232428] bg-[#1e1f22]"
            />
            <span
              className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] border-[#232428] bg-[#23a559]"
              aria-hidden
            />
          </div>

          <h3 className="mt-2 text-lg font-bold text-[#f2f3f5] text-center leading-tight px-2">
            {displayName}
          </h3>
          <p className="text-sm text-[#b5bac1] text-center">{username}</p>
        </div>

        {/* Séparateur + rôle */}
        <div className="mt-4 pt-4 border-t border-[#3f4147]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#949ba4] mb-2 text-center">
            {t("team.roleSection")}
          </p>
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-white"
              style={{ backgroundColor: `${roleColor}33`, color: roleColor }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: roleColor }} />
              {t(`team.roles.${member.role}`)}
            </span>
          </div>
        </div>

        {/* Bouton profil Discord */}
        {profile?.profileUrl && (
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#5865F2] hover:bg-[#4752c4] px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            {t("team.viewDiscord")}
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        )}
      </div>
    </article>
  );
}
