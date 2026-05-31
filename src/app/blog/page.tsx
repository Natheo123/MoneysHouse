import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blog";
import { BlogIcon } from "@/components/icons/UiIcons";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Blog — Guides et comparatifs revenus passifs",
  description:
    "Articles, guides et comparatifs pour maximiser vos revenus passifs avec les meilleures applications.",
};

export default function BlogPage() {
  return (
    <PageShell maxWidth="4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-phantom-gray text-base sm:text-lg">
            Guides, comparatifs et astuces pour maximiser vos revenus
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 hover:shadow-lg hover:shadow-phantom-purple/10 hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <BlogIcon id={post.iconId} size={36} className="shrink-0" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-xs font-medium text-phantom-purple bg-phantom-purple/20 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-phantom-gray">
                        {post.date} · {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-phantom-dark group-hover:text-phantom-purple transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-phantom-gray text-sm sm:text-base">{post.excerpt}</p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
    </PageShell>
  );
}
