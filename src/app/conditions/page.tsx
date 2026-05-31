import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Money's House",
  description:
    "Conditions générales d'utilisation du site Money's House et de ses services.",
};

const updatedAt = "31 mai 2026";

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Conditions d'utilisation"
      description="En utilisant Money's House, vous acceptez les conditions décrites ci-dessous."
      updatedAt={updatedAt}
      sections={[
        {
          title: "Objet",
          paragraphs: [
            `${siteConfig.name} est un site d'information et de comparaison d'applications de revenus passifs. Nous fournissons des contenus éditoriaux, des liens de parrainage et des outils d'aide à la décision.`,
            "Money's House n'est pas une application de gains en soi : les paiements et conditions des récompenses dépendent exclusivement des services tiers que vous choisissez d'utiliser.",
          ],
        },
        {
          title: "Accès au service",
          paragraphs: [
            "L'accès au site est gratuit. Certaines fonctionnalités (dashboard, favoris) nécessitent la création d'un compte.",
            "Vous vous engagez à fournir des informations exactes et à ne pas usurper l'identité d'un tiers.",
            "Nous nous réservons le droit de suspendre un compte en cas d'usage frauduleux ou contraire à ces conditions.",
          ],
        },
        {
          title: "Liens et parrainages",
          paragraphs: [
            "Les liens vers des applications tierces peuvent inclure des codes de parrainage. Money's House peut percevoir une commission sans surcoût pour vous.",
            "Nous nous efforçons de maintenir des liens à jour, mais nous ne garantissons pas la disponibilité permanente d'une offre ou d'un bonus.",
            "Toute inscription sur une application tierce est soumise aux conditions de ce service.",
          ],
        },
        {
          title: "Contenu et propriété intellectuelle",
          paragraphs: [
            "Les textes, visuels et la structure du site sont protégés. Toute reproduction non autorisée est interdite.",
            "Les marques et logos des applications mentionnées appartiennent à leurs propriétaires respectifs.",
          ],
        },
        {
          title: "Limitation de responsabilité",
          paragraphs: [
            "Les informations publiées le sont à titre indicatif. Les revenus mentionnés sont des estimations et peuvent varier selon votre pays, votre appareil et votre utilisation.",
            "Money's House ne peut être tenu responsable des pertes, indisponibilités ou changements de politique des applications tierces.",
            "Le site est fourni « en l'état ». Nous ne garantissons pas une disponibilité ininterrompue du service.",
          ],
        },
        {
          title: "Modifications",
          paragraphs: [
            "Nous pouvons mettre à jour ces conditions à tout moment. La date de dernière mise à jour est indiquée en haut de cette page.",
            "La poursuite de l'utilisation du site après modification vaut acceptation des nouvelles conditions.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            `Pour toute question relative à ces conditions, contactez-nous à ${siteConfig.ownerEmail} ou via notre serveur Discord.`,
          ],
        },
      ]}
    >
      <p className="text-sm text-phantom-gray">
        Consultez aussi notre{" "}
        <Link href="/confidentialite" className="text-phantom-purple hover:underline">
          politique de confidentialité
        </Link>
        .
      </p>
    </LegalPageLayout>
  );
}
