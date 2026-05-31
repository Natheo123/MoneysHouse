import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { siteConfig } from "@/lib/config";
import { apps } from "@/lib/data/apps";

export const metadata: Metadata = {
  title: "À propos — Money's House",
  description:
    "Découvrez la mission de Money's House : comparer, tester et recommander les meilleures applications de revenus passifs.",
};

const updatedAt = "31 mai 2026";

export default function AboutPage() {
  return (
    <LegalPageLayout
      title="À propos"
      description={`${siteConfig.name} est une plateforme indépendante qui aide les utilisateurs à découvrir des applications de revenus passifs fiables.`}
      updatedAt={updatedAt}
      sections={[
        {
          title: "Notre mission",
          paragraphs: [
            "Money's House a été créé pour simplifier le choix des applications qui permettent de générer des revenus passifs en ligne. Nous testons, comparons et présentons uniquement des services que nous jugeons utiles et transparents.",
            "Notre objectif est de vous faire gagner du temps : au lieu de parcourir des dizaines d'applications, vous trouvez ici des fiches détaillées, des comparatifs et des liens de parrainage vérifiés.",
          ],
        },
        {
          title: "Ce que nous proposons",
          paragraphs: [
            `Un catalogue de ${apps.length} applications testées avec fiches détaillées, classements, comparateur et articles de blog pour vous guider.`,
            "Des codes de parrainage mis à jour par notre équipe lorsqu'ils sont disponibles.",
            "Un espace utilisateur pour suivre vos applications favorites et recevoir des rappels.",
          ],
        },
        {
          title: "Notre indépendance",
          paragraphs: [
            "Money's House peut percevoir une rémunération lorsque vous vous inscrivez via certains liens de parrainage. Cela ne change pas le prix pour vous et nous n'influons pas nos classements en fonction de ces partenariats.",
            "Nous indiquons clairement les avantages et limites de chaque application pour que vous puissiez faire un choix éclairé.",
          ],
        },
        {
          title: "Nous contacter",
          paragraphs: [
            "Une question, une suggestion ou un signalement ? Rejoignez notre communauté Discord.",
          ],
        },
      ]}
    >
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href={siteConfig.links.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-phantom-purple px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Rejoindre Discord
        </a>
        <Link
          href="/apps"
          className="inline-flex items-center justify-center rounded-full border border-phantom-dark/10 px-6 py-3 text-sm font-medium text-phantom-dark hover:bg-phantom-lavender/50 transition-colors"
        >
          Voir les applications
        </Link>
      </div>
    </LegalPageLayout>
  );
}
