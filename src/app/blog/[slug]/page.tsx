import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPost } from "@/lib/data/blog";
import { BlogIcon } from "@/components/icons/UiIcons";
import { PageShell } from "@/components/layout/PageShell";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <PageShell maxWidth="3xl">
      <article className="w-full">
        <div className="mb-6 sm:mb-8">
          <Link href="/blog" className="text-phantom-purple hover:underline text-sm">
            ← Retour au blog
          </Link>
        </div>
        <BlogIcon id={post.iconId} size={48} className="mb-6" />
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <span className="text-xs font-medium text-phantom-purple bg-phantom-purple/20 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-phantom-gray">
            {post.date} · {post.readTime}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-phantom-dark tracking-tight mb-6 sm:mb-8">
          {post.title}
        </h1>
        <div className="text-phantom-gray text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {post.content.trim()}
        </div>
      </article>
    </PageShell>
  );
}
