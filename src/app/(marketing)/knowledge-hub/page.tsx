import Link from "next/link";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SectionHeader } from "@/components/shared/section-header";

export const dynamic = "force-dynamic";

export default async function KnowledgeHubPage() {
  const allArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.isPublished, true))
    .orderBy(articles.createdAt);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <SectionHeader
        eyebrow="Knowledge Hub"
        title="The Sacred Archive"
        description="Essays, interviews, and deep dives into the history, symbolism, and craft of Himalayan Thangka art."
        align="center"
      />
      {allArticles.length === 0 ? (
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="border border-outline-variant/20 bg-surface-container-low p-16 rounded-sm">
            <span className="material-symbols-outlined text-6xl text-primary/30 mb-6 block">history_edu</span>
            <p className="text-body-lg text-on-surface-variant italic">
              Articles and features coming soon.
            </p>
            <p className="text-body-md text-on-surface-variant mt-3">
              We are curating a collection of scholarly articles, artist interviews,
              and cultural deep dives to enrich your understanding of Thangka art.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/knowledge-hub/${article.slug}`}
              className="group block"
            >
              <div className="aspect-[16/9] bg-surface-container-low rounded-sm overflow-hidden">
                <div className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 bg-surface-container-higher flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">history_edu</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {article.category && (
                  <span className="text-label-sm uppercase tracking-widest text-primary font-bold">{article.category}</span>
                )}
                <h3 className="text-headline-md text-on-surface group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-body-md text-on-surface-variant line-clamp-2">
                  {article.excerpt}
                </p>
                <p className="text-label-sm text-on-surface-variant/60">
                  {article.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  {article.authorName ? ` · ${article.authorName}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
