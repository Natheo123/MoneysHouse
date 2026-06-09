"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/context/LanguageContext";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logSiteEventAsync } from "@/lib/site-event-log-client";
import { sanitizeNextPath } from "@/lib/auth-routes";

export default function InscriptionPage() {
  const { t } = useTranslation();
  const { register } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(sanitizeNextPath(params.get("next")));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password);
    await logSiteEventAsync({
      type: "signup",
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
    const params = new URLSearchParams(window.location.search);
    router.push(sanitizeNextPath(params.get("next")));
  };

  return (
    <PageShell maxWidth="md" className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-phantom-dark tracking-tight mb-2">
            {t("auth.signupTitle")}
          </h1>
          <p className="text-phantom-gray text-sm sm:text-base">
            {t("auth.signupSubtitle")}
          </p>
          <p className="text-xs text-phantom-purple mt-2">{t("auth.accountRequired")}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-phantom-dark mb-2 block">{t("auth.firstName")}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("auth.firstNamePlaceholder")}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-phantom-dark mb-2 block">{t("auth.email")}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("common.emailPlaceholder")}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-phantom-dark mb-2 block">{t("auth.password")}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {t("auth.signupButton")}
          </Button>
          <p className="text-center text-sm text-phantom-gray">
            {t("auth.hasAccount")}{" "}
            <Link
              href={
                nextPath !== "/"
                  ? `/connexion?next=${encodeURIComponent(nextPath)}`
                  : "/connexion"
              }
              className="text-phantom-purple hover:underline"
            >
              {t("auth.loginLink")}
            </Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
