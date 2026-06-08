"use client";

import { useEffect, useState } from "react";
import { Bell, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/context/LanguageContext";

interface AdminNotificationsSectionProps {
  userEmail: string;
}

type SendTarget = "all" | "one";

export function AdminNotificationsSection({ userEmail }: AdminNotificationsSectionProps) {
  const { t } = useTranslation();
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [target, setTarget] = useState<SendTarget>("all");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/notifications")
      .then((res) => res.json())
      .then((data: { count?: number }) => {
        if (typeof data.count === "number") setMemberCount(data.count);
      })
      .catch(() => undefined);
  }, []);

  const handleSend = async () => {
    setError("");
    setSuccess("");
    setSending(true);

    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedBy: userEmail,
          target: target === "all" ? "all" : recipientEmail.trim(),
          message: message.trim(),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; sentCount?: number };
      if (!data.ok) {
        setError(data.error ?? t("admin.notificationsSendError"));
        return;
      }

      setSuccess(
        target === "all"
          ? t("admin.notificationsSentAll", { count: String(data.sentCount ?? memberCount ?? 0) })
          : t("admin.notificationsSentOne")
      );
      setMessage("");
      if (target === "one") setRecipientEmail("");
    } catch {
      setError(t("admin.notificationsSendError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Bell className="h-6 w-6 text-phantom-purple" />
        <h2 className="text-xl font-semibold text-phantom-dark">{t("admin.notificationsTitle")}</h2>
      </div>
      <p className="text-sm text-phantom-gray mb-2">{t("admin.notificationsHint")}</p>
      {memberCount !== null && (
        <p className="text-xs text-phantom-gray mb-6 inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {t("admin.notificationsMemberCount", { count: String(memberCount) })}
        </p>
      )}

      <div className="space-y-4 rounded-[20px] bg-phantom-bg border border-phantom-dark/5 p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => setTarget("all")}
            className={`flex-1 rounded-[16px] px-4 py-3 text-sm font-medium border transition-colors ${
              target === "all"
                ? "border-phantom-purple bg-phantom-purple/10 text-phantom-dark"
                : "border-phantom-dark/10 text-phantom-gray hover:border-phantom-purple/30"
            }`}
          >
            {t("admin.notificationsTargetAll")}
          </button>
          <button
            type="button"
            onClick={() => setTarget("one")}
            className={`flex-1 rounded-[16px] px-4 py-3 text-sm font-medium border transition-colors ${
              target === "one"
                ? "border-phantom-purple bg-phantom-purple/10 text-phantom-dark"
                : "border-phantom-dark/10 text-phantom-gray hover:border-phantom-purple/30"
            }`}
          >
            {t("admin.notificationsTargetOne")}
          </button>
        </div>

        {target === "one" && (
          <Input
            type="email"
            placeholder={t("admin.notificationsEmailPlaceholder")}
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("admin.notificationsMessagePlaceholder")}
          rows={4}
          className="w-full rounded-[16px] border border-phantom-dark/10 bg-phantom-surface px-4 py-3 text-sm text-phantom-dark placeholder:text-phantom-gray/70 focus:outline-none focus:ring-2 focus:ring-phantom-purple/30 resize-y min-h-[6rem]"
        />

        <Button
          type="button"
          onClick={() => void handleSend()}
          disabled={
            sending ||
            !message.trim() ||
            (target === "one" && !recipientEmail.trim().includes("@"))
          }
        >
          <Send className="h-4 w-4 mr-2" />
          {sending ? t("admin.notificationsSending") : t("admin.notificationsSend")}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      {success && <p className="text-sm text-emerald-600 mt-4">{success}</p>}
    </section>
  );
}
