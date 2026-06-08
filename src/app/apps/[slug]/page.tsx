import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllAppsServer, getAppBySlugServer } from "@/lib/apps-catalog";
import { AppDetailView } from "@/components/apps/AppDetailView";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const apps = await getAllAppsServer();
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppBySlugServer(slug);
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
  const app = await getAppBySlugServer(slug);
  if (!app) notFound();

  return <AppDetailView app={app} />;
}
