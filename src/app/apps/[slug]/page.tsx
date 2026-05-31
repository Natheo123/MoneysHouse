import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apps, getAppBySlug } from "@/lib/data/apps";
import { AppDetailView } from "@/components/apps/AppDetailView";
import { siteConfig } from "@/lib/config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return { title: "Application introuvable" };

  return {
    title: `${app.name} — Revenus, avis et tutoriel`,
    description: app.description,
    openGraph: {
      title: `${app.name} | ${siteConfig.name}`,
      description: app.shortDescription,
    },
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  return <AppDetailView app={app} />;
}
