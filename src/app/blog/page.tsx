"use client";

import Link from "next/link";
import { blogPosts } from "@/lib/data/blog";
import { BlogIcon } from "@/components/icons/UiIcons";
import { PageShell } from "@/components/layout/PageShell";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import { getLocalizedBlogPost } from "@/lib/i18n/blog-i18n";

export default function BlogPage() {
  const { t } = useTranslation();
  const { locale } = useLanguage();

  return (
    <PageShell maxWidth="4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
            {t("blog.title")}
          </h1>
          <p className="text-phantom-gray text-base sm:text-lg">
            {t("blog.subtitle")}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {blogPosts.map((post) => {
            const localized = getLocalizedBlogPost(post.slug, locale);
            const title = localized?.title ?? post.title;
            const excerpt = localized?.excerpt ?? post.excerpt;
            const category = localized?.category ?? post.category;

            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="group p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 hover:shadow-lg hover:shadow-phantom-purple/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <BlogIcon id={post.iconId} size={36} className="shrink-0" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <span className="text-xs font-medium text-phantom-purple bg-phantom-purple/20 px-3 py-1 rounded-full">
                          {category}
                        </span>
                        <span className="text-xs text-phantom-gray">
                          {post.date} · {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-phantom-dark group-hover:text-phantom-purple transition-colors mb-2">
                        {title}
                      </h2>
                      <p className="text-phantom-gray text-sm sm:text-base">{excerpt}</p>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
    </PageShell>
  );
}
