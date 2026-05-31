import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Blog — Guides et comparatifs revenus passifs",
  description:
    "Articles, guides et comparatifs pour maximiser vos revenus passifs avec les meilleures applications.",
};

export default function BlogPage() {
  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-phantom-gray text-lg">
            Guides, comparatifs et astuces pour maximiser vos revenus
          </p>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group p-8 rounded-[32px] bg-phantom-surface border border-phantom-dark/5 hover:shadow-lg hover:shadow-phantom-purple/10 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="text-5xl shrink-0">{post.image}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-phantom-purple bg-phantom-purple/20 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-phantom-gray">
                        {post.date} · {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold text-phantom-dark group-hover:text-phantom-purple transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-phantom-gray">{post.excerpt}</p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
