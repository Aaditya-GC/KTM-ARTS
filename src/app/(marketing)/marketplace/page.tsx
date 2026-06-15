export const revalidate = 60;

import Link from "next/link";
import { db } from "@/lib/db";
import { artworks, artists, profiles } from "@/lib/db/schema";
import { eq, and, sql, gte, lte, inArray } from "drizzle-orm";
import { Suspense } from "react";
import { ArtGrid } from "@/components/art/art-grid";
import { SearchBar } from "@/components/marketplace/search-bar";
import { SortSelect } from "@/components/marketplace/sort-select";
import { ActiveFilters } from "@/components/marketplace/active-filters";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { Pagination } from "@/components/marketplace/pagination";

interface MarketplacePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const PAGE_SIZE = 12;

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * PAGE_SIZE;

  const query = db
    .select()
    .from(artworks)
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .$dynamic();

  const conditions = [eq(artworks.status, "available")];

  if (params.q) {
    const q = `%${params.q}%`;
    conditions.push(
      sql`(${artworks.title} ILIKE ${q} OR ${artworks.description} ILIKE ${q} OR ${artworks.deity} ILIKE ${q})`
    );
  }

  if (params.deity) {
    const subjects = params.deity.split(",");
    conditions.push(inArray(artworks.deity, subjects));
  }

  if (params.price_min) {
    conditions.push(gte(artworks.priceNpr, Number(params.price_min)));
  }

  if (params.price_max) {
    conditions.push(lte(artworks.priceNpr, Number(params.price_max)));
  }

  const sortKey = params.sort || "newest";
  const orderByClause = sortKey === "price_asc"
    ? sql`${artworks.priceNpr} ASC`
    : sortKey === "price_desc"
    ? sql`${artworks.priceNpr} DESC`
    : sql`${artworks.createdAt} DESC`;

  const result = await query
    .where(and(...conditions))
    .orderBy(orderByClause)
    .limit(PAGE_SIZE)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(artworks)
    .where(and(...conditions));

  const totalCount = Number(countResult[0]?.count ?? 0);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Need to explicitly type the join result
  const mapped: Array<{
    slug: string;
    title: string;
    images: string[];
    priceNpr: number;
    priceUsd?: number | null;
    status: "available" | "reserved" | "sold" | "draft";
    isVerified: boolean;
    artist: { name: string; slug: string };
  }> = result.map(({ artworks, profiles, artists }) => ({
    slug: artworks.slug,
    title: artworks.title,
    images: artworks.images ?? [],
    priceNpr: artworks.priceNpr,
    priceUsd: artworks.priceUsd,
    status: artworks.status,
    isVerified: artworks.isVerified ?? false,
    artist: {
      name: profiles.fullName,
      slug: artists.slug,
    },
  }));

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="mb-12">
        <h1 className="text-headline-lg text-on-background">Archive</h1>
        <p className="text-body-lg text-on-surface-variant italic mt-2">
          Each piece carries centuries of spiritual tradition and artisan mastery
        </p>
      </div>

      <div className="flex gap-8">
        <Suspense fallback={null}>
          <FilterSidebar className="hidden lg:block w-72 shrink-0 sticky top-32 self-start" />
        </Suspense>

        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>

          <Suspense fallback={null}>
            <ActiveFilters />
          </Suspense>

          {mapped.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">search_off</span>
              <p className="text-body-lg text-on-surface-variant mt-4">No artworks match your search criteria</p>
              <Link href="/marketplace" className="text-accent hover:underline mt-2 inline-block text-label-sm uppercase tracking-widest">
                Clear all filters
              </Link>
            </div>
          ) : (
            <ArtGrid artworks={mapped} />
          )}

          <Suspense fallback={null}>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
