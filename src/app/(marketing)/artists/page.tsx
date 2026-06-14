export const revalidate = 300;

import { db } from "@/lib/db";
import { artists, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { ArtistGrid } from "@/components/artist/artist-grid";
import { SectionHeader } from "@/components/shared/section-header";

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
