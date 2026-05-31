import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { apps } from "@/lib/data/apps";
import { blogPosts } from "@/lib/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticPages = [
    "",
    "/apps",
    "/classement",
    "/comparateur",
    "/blog",
    "/faq",
    "/equipe",
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
