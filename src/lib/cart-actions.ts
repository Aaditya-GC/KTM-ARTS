"use server";

import { db } from "@/lib/db";
import { cartItems, artworks, artists, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function syncCartToDb(items: Array<{ artworkId: string }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const existing = await db
    .select({ artworkId: cartItems.artworkId })
    .from(cartItems)
    .where(eq(cartItems.userId, user.id));

  const existingIds = new Set(existing.map(e => e.artworkId));
  const newIds = new Set(items.map(i => i.artworkId));

  for (const id of existingIds) {
    if (!newIds.has(id)) {
      await db
        .delete(cartItems)
        .where(and(
          eq(cartItems.userId, user.id),
          eq(cartItems.artworkId, id)
        ));
    }
  }

  for (const item of items) {
    if (!existingIds.has(item.artworkId)) {
      await db
        .insert(cartItems)
        .values({ userId: user.id, artworkId: item.artworkId })
        .onConflictDoNothing();
    }
  }
}

export async function getCartFromDb() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return db
    .select({
      artworkId: artworks.id,
      slug: artworks.slug,
      title: artworks.title,
      images: artworks.images,
      priceNpr: artworks.priceNpr,
      artistName: profiles.fullName,
      artistSlug: artists.slug,
    })
    .from(cartItems)
    .innerJoin(artworks, eq(cartItems.artworkId, artworks.id))
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(cartItems.userId, user.id));
}

export async function clearCartFromDb() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await db.delete(cartItems).where(eq(cartItems.userId, user.id));
}
