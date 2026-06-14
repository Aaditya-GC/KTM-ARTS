import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} — Knowledge Hub — Kathmandu Arts`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!article || !article.isPublished) notFound();

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-8"
        >
          <span className="material-symbols-outlined text-sm">trending_flat</span>
          Back to Articles
        </Link>

        <div className="space-y-4">
          {article.category && (
            <span className="text-label-sm uppercase tracking-widest text-primary font-bold">{article.category}</span>
          )}
          <h1 className="text-headline-lg text-on-background">{article.title}</h1>
          <div className="flex items-center gap-4 text-body-md text-on-surface-variant">
            {article.authorName && <span>By {article.authorName}</span>}
            <span>
              {article.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>

        {article.imageUrl && (
          <div className="aspect-[21/9] mt-8 bg-surface-container-low rounded-sm overflow-hidden">
            <div className="w-full h-full bg-surface-container-higher flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">image</span>
            </div>
          </div>
        )}

        <article className="prose prose-invert prose-lg mt-12 max-w-none prose-headings:text-on-surface prose-p:text-on-surface-variant prose-a:text-primary prose-strong:text-on-surface">
          {article.content.split("\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return <h2 key={i} className="text-headline-md text-on-surface mt-12 mb-4">{paragraph.slice(3)}</h2>;
            }
            if (paragraph.startsWith("### ")) {
              return <h3 key={i} className="text-headline-md text-on-surface mt-8 mb-3">{paragraph.slice(4)}</h3>;
            }
            if (paragraph.trim() === "") return <div key={i} className="h-4" />;
            return <p key={i} className="text-body-lg leading-relaxed mb-4">{paragraph}</p>;
          })}
        </article>
      </div>
    </div>
  );
}
