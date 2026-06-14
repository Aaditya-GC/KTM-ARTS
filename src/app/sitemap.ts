import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { artists, artworks, articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kathmanduarts.com";

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/artists`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/commissions`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/knowledge-hub`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const [artistRows, artworkRows, articleRows] = await Promise.all([
      db.select({ slug: artists.slug, updatedAt: artists.createdAt }).from(artists),
      db.select({ slug: artworks.slug, updatedAt: artworks.createdAt }).from(artworks).where(eq(artworks.status, "available")),
      db.select({ slug: articles.slug, updatedAt: articles.createdAt }).from(articles).where(eq(articles.isPublished, true)),
    ]);

    for (const a of artistRows) {
      entries.push({ url: `${baseUrl}/artists/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly", priority: 0.7 });
    }
    for (const a of artworkRows) {
      entries.push({ url: `${baseUrl}/marketplace/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly", priority: 0.8 });
    }
    for (const a of articleRows) {
      entries.push({ url: `${baseUrl}/knowledge-hub/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly", priority: 0.6 });
    }
  } catch {
    // DB unavailable during build — return static pages only
  }

  return entries;
}
