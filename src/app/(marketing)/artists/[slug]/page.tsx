export const revalidate = 300;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { artists, artworks, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { BadgeVerified } from "@/components/shared/badge-verified";

interface ArtistProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArtistProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await db
    .select()
    .from(artists)
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(artists.slug, slug))
    .limit(1);

  if (result.length === 0) return { title: "Artist Not Found" };

  const { artists: artist, profiles: profile } = result[0];

  return {
    title: `${profile.fullName} — Kathmandu Arts`,
    description: artist.bio?.slice(0, 160) ?? `Discover Thangka artworks by ${profile.fullName}.`,
  };
}

export default async function ArtistProfilePage({ params }: ArtistProfilePageProps) {
  const { slug } = await params;

  const result = await db
    .select()
    .from(artists)
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(artists.slug, slug))
    .limit(1);

  if (result.length === 0) notFound();

  const { artists: artist, profiles: profile } = result[0];

  const artworkList = await db
    .select()
    .from(artworks)
    .where(and(eq(artworks.artistId, artist.id), eq(artworks.status, "available")));

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="aspect-[21/9] bg-surface-container-low mb-16 rounded-sm overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-surface-container-higher">
          <span className="material-symbols-outlined text-8xl text-on-surface-variant/20">brush</span>
        </div>
      </div>

      <div className="max-w-4xl">
        <h1 className="text-headline-lg text-on-background">{profile.fullName}</h1>
        {artist.lineage && (
          <p className="text-body-lg text-on-surface-variant italic mt-2">{artist.lineage}</p>
        )}
        {artist.location && (
          <p className="text-body-md text-on-surface-variant mt-1">{artist.location}</p>
        )}

        {artist.isVerified && (
          <div className="mt-4">
            <BadgeVerified />
          </div>
        )}

        <div className="flex gap-8 mt-8 text-center">
          {artist.experienceYears && (
            <div>
              <p className="text-headline-md text-primary">{artist.experienceYears}+</p>
              <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">Years</p>
            </div>
          )}
          <div>
            <p className="text-headline-md text-primary">{artworkList.length}</p>
            <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">Artworks</p>
          </div>
        </div>

        <p className="text-body-lg text-on-surface-variant mt-8 max-w-3xl leading-relaxed">
          {artist.bio}
        </p>

        {artist.specialization && artist.specialization.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-8">
            {artist.specialization.map((spec) => (
              <span
                key={spec}
                className="px-4 py-2 border border-outline-variant text-label-sm uppercase tracking-widest text-on-surface-variant rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
