import type { Metadata } from "next";
import { LegalPageClient } from "@/components/legal/LegalPageClient";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Money's House",
  description:
    "Comment Money's House collecte, utilise et protège vos données personnelles.",
};

export default function PrivacyPage() {
  return <LegalPageClient pageId="privacy" />;
}
