import { db } from "@/lib/db";
import { artworks } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/roles";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ArtworkListClient } from "./artwork-list-client";

export default async function ArtistArtworksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const artistArtworks = await db
    .select()
    .from(artworks)
    .where(eq(artworks.artistId, user.id))
    .orderBy(desc(artworks.createdAt));

  return <ArtworkListClient artworks={artistArtworks} />;
}
