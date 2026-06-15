export const revalidate = 300;

import type { Metadata } from "next";
import { db } from "@/lib/db";
import { artists, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { ArtistGrid } from "@/components/artist/artist-grid";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Artists — Kathmandu Arts",
  description: "Meet the master Thangka artists of the Kathmandu Valley. Each artist carries generations of lineage and tradition.",
  openGraph: {
    title: "Artists — Kathmandu Arts",
    description: "Meet the master Thangka artists of the Kathmandu Valley.",
  },
};

export default async function ArtistsPage() {
  const artistList = await db
    .select()
    .from(artists)
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(and(eq(artists.isVerified, true), eq(profiles.role, "artist")));

  const mappedArtists = artistList.map(({ artists, profiles }) => ({
    slug: artists.slug,
    fullName: profiles.fullName,
    specialization: artists.specialization ?? undefined,
    imageUrl: artists.studioImages?.[0] ?? undefined,
    experienceYears: artists.experienceYears ?? undefined,
  }));

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <SectionHeader
        eyebrow="The Living Lineage"
        title="Master Artists"
        description="Masters whose brushes are guided by meditation and sacred geometry"
      />
      <div className="mt-16">
        <ArtistGrid artists={mappedArtists} />
      </div>
    </div>
  );
}
