"use client";

import Link from "next/link";
import { BlogIcon } from "@/components/icons/UiIcons";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import { getLocalizedBlogPost, convertCurrencyInText } from "@/lib/i18n";
import type { BlogPost } from "@/types";

export function BlogPostClient({ post }: { post: BlogPost }) {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const meta = getLocalizedBlogPost(post.slug, locale) ?? {
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
  };

  return (
    <article className="w-full">
      <div className="mb-6 sm:mb-8">
        <Link href="/blog" className="text-phantom-purple hover:underline text-sm">
          {t("blog.backToBlog")}
        </Link>
      </div>
      <BlogIcon id={post.iconId} size={48} className="mb-6" />
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        <span className="text-xs font-medium text-phantom-purple bg-phantom-purple/20 px-3 py-1 rounded-full">
          {meta.category}
        </span>
        <span className="text-sm text-phantom-gray">
          {post.date} · {post.readTime}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-phantom-dark tracking-tight mb-6 sm:mb-8">
        {meta.title}
      </h1>
      {locale === "en" && (
        <p className="text-sm text-phantom-gray mb-6 rounded-[16px] bg-phantom-bg px-4 py-3 border border-phantom-dark/5">
          {t("blog.contentFrOnly")}
        </p>
      )}
      <div className="text-phantom-gray text-base sm:text-lg leading-relaxed whitespace-pre-line">
        {locale === "en"
          ? convertCurrencyInText(post.content.trim(), "en")
          : post.content.trim()}
      </div>
    </article>
  );
}
