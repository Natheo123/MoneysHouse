"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { isPublicAuthPath } from "@/lib/auth-routes";
import { useTranslation } from "@/context/LanguageContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, authReady } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const isPublic = isPublicAuthPath(pathname);

  useEffect(() => {
    if (!authReady) return;

    if (!user && !isPublic) {
      const next = encodeURIComponent(pathname);
      router.replace(`/inscription?next=${next}`);
      return;
    }

    if (user && isPublic) {
      router.replace("/");
    }
  }, [authReady, user, isPublic, pathname, router]);

  if (!authReady) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-6">
        <p className="text-sm text-phantom-gray">{t("auth.loading")}</p>
      </div>
    );
  }

  if ((!user && !isPublic) || (user && isPublic)) {
    return null;
  }

  return <>{children}</>;
}
