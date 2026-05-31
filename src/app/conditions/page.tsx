import type { Metadata } from "next";
import { LegalPageClient } from "@/components/legal/LegalPageClient";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Money's House",
  description:
    "Conditions générales d'utilisation du site Money's House et de ses services.",
};

export default function TermsPage() {
  return <LegalPageClient pageId="terms" />;
}
