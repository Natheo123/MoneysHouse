"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/context/LanguageContext";
import { sanitizeNextPath } from "@/lib/auth-routes";

export default function ConnexionPage() {
  const { t } = useTranslation();
  const { login } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(sanitizeNextPath(params.get("next")));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    const params = new URLSearchParams(window.location.search);
    router.push(sanitizeNextPath(params.get("next")));
  };

  return (
    <PageShell maxWidth="md" className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-phantom-dark tracking-tight mb-2">
            {t("auth.loginTitle")}
          </h1>
          <p className="text-phantom-gray text-sm sm:text-base">
            {t("auth.loginSubtitle")}
          </p>
          <p className="text-xs text-phantom-purple mt-2">{t("auth.accountRequired")}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 space-y-4"
        >
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
            {t("auth.submitLogin")}
          </Button>
          <p className="text-center text-sm text-phantom-gray">
            {t("auth.noAccount")}{" "}
            <Link
              href={
                nextPath !== "/"
                  ? `/inscription?next=${encodeURIComponent(nextPath)}`
                  : "/inscription"
              }
              className="text-phantom-purple hover:underline"
            >
              {t("auth.signupLink")}
            </Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
