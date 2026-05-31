import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Money's House",
  description:
    "Comment Money's House collecte, utilise et protège vos données personnelles.",
};

const updatedAt = "31 mai 2026";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      description="Cette page explique quelles données nous collectons et comment nous les utilisons."
      updatedAt={updatedAt}
      sections={[
        {
          title: "Responsable du traitement",
          paragraphs: [
            `Le site ${siteConfig.url} est édité par Money's House. Pour toute question relative à vos données, contactez-nous sur notre serveur Discord : ${siteConfig.links.discord}.`,
          ],
        },
        {
          title: "Données collectées",
          paragraphs: [
            "Données de compte : adresse e-mail et nom lorsque vous créez un compte sur Money's House.",
            "Données d'utilisation : pages consultées, préférences d'applications et interactions avec le site (via cookies techniques et stockage local du navigateur).",
            "Données d'administration : accès réservé aux membres autorisés pour la gestion des parrainages et des preuves.",
          ],
        },
        {
          title: "Finalités",
          paragraphs: [
            "Fournir et améliorer les services du site (compte utilisateur, dashboard, comparateur).",
            "Gérer les liens de parrainage et le contenu éditorial.",
            "Assurer la sécurité du site et prévenir les abus.",
            "Répondre à vos demandes via Discord.",
          ],
        },
        {
          title: "Cookies et stockage local",
          paragraphs: [
            "Nous utilisons le stockage local de votre navigateur pour mémoriser votre session, vos préférences et certaines données du dashboard.",
            "Des cookies techniques peuvent être utilisés pour le bon fonctionnement du site. Aucun cookie publicitaire tiers n'est déposé par Money's House.",
          ],
        },
        {
          title: "Partage des données",
          paragraphs: [
            "Nous ne vendons pas vos données personnelles.",
            "Certaines données peuvent être hébergées par nos prestataires techniques (hébergement, déploiement) dans le cadre strict de l'exploitation du service.",
            "Lorsque vous cliquez sur un lien vers une application tierce, vous quittez Money's House et êtes soumis à la politique de confidentialité de ce service.",
          ],
        },
        {
          title: "Durée de conservation",
          paragraphs: [
            "Les données de compte sont conservées tant que votre compte est actif. Vous pouvez demander leur suppression.",
            "Les journaux techniques sont conservés pour une durée limitée, nécessaire à la sécurité et au diagnostic.",
          ],
        },
        {
          title: "Vos droits",
          paragraphs: [
            "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de limitation du traitement de vos données.",
            `Pour exercer ces droits, contactez-nous sur Discord (${siteConfig.links.discord}). Vous pouvez également introduire une réclamation auprès de la CNIL.`,
          ],
        },
      ]}
    />
  );
}
