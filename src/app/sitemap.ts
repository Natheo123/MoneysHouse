import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getAllAppsServer } from "@/lib/apps-catalog";
import { blogPosts } from "@/lib/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticPages = [
    "",
    "/apps",
    "/classement",
    "/comparateur",
    "/blog",
    "/faq",
    "/equipe",
    "/partenaires",
    "/a-propos",
    "/confidentialite",
    "/conditions",
    "/connexion",
    "/inscription",
    "/dashboard",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const apps = await getAllAppsServer();
  const appPages = apps.map((app) => ({
    url: `${baseUrl}/apps/${app.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...appPages, ...blogPages];
}
