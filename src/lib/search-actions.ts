"use server";

import { db } from "@/lib/db";
import { artworks, artists, profiles } from "@/lib/db/schema";
import { eq, ilike, or, and } from "drizzle-orm";

// NOTE: For optimal performance, ensure these indexes exist in your Supabase/Drizzle schema:
//   - CREATE INDEX IF NOT EXISTS idx_artworks_title ON artworks USING gin (title gin_trgm_ops);
//   - CREATE INDEX IF NOT EXISTS idx_artworks_deity ON artworks USING gin (deity gin_trgm_ops);
//   - CREATE INDEX IF NOT EXISTS idx_artworks_description ON artworks USING gin (description gin_trgm_ops);
//   - CREATE INDEX IF NOT EXISTS idx_artworks_medium ON artworks USING gin (medium gin_trgm_ops);
//   - CREATE INDEX IF NOT EXISTS idx_artworks_style ON artworks USING gin (style gin_trgm_ops);
// These require the pg_trgm extension: CREATE EXTENSION IF NOT EXISTS pg_trgm;
// Without them, ilike queries will fall back to sequential scans on large datasets.

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  images: string[];
  priceNpr: number;
  artistName: string | null;
  artistSlug: string | null;
}

export async function searchArtworks(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const pattern = `%${query.trim()}%`;

  const results = await db
    .select({
      id: artworks.id,
      slug: artworks.slug,
      title: artworks.title,
      images: artworks.images,
      priceNpr: artworks.priceNpr,
      artistName: profiles.fullName,
      artistSlug: artists.slug,
    })
    .from(artworks)
    .leftJoin(artists, eq(artworks.artistId, artists.id))
    .leftJoin(profiles, eq(artists.id, profiles.id))
    .where(
      and(
        or(
          ilike(artworks.title, pattern),
          ilike(artworks.deity, pattern),
          ilike(artworks.description, pattern),
          ilike(artworks.style, pattern),
          ilike(artworks.medium, pattern),
        ),
        eq(artworks.status, "available"),
      )
    )
    .limit(20);

  return results;
}
