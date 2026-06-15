"use server";

import { db } from "@/lib/db";
import { wishlistItems, artworks, artists, profiles } from "@/lib/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addToWishlist(artworkId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  try {
    await db.insert(wishlistItems).values({
      userId: user.id,
      artworkId,
    });
  } catch (err: unknown) {
    const pgError = err as { code?: string };
    if (pgError.code === "23505") return;
    throw err;
  }

  revalidatePath("/dashboard/customer/wishlist");
}

export async function removeFromWishlist(artworkId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await db
    .delete(wishlistItems)
    .where(and(
      eq(wishlistItems.userId, user.id),
      eq(wishlistItems.artworkId, artworkId)
    ));

  revalidatePath("/dashboard/customer/wishlist");
}

export async function getWishlistIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const rows = await db
    .select({ artworkId: wishlistItems.artworkId })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, user.id));

  return rows.map((r) => r.artworkId);
}

export async function getWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const items = await db
    .select({
      artworkId: artworks.id,
      slug: artworks.slug,
      title: artworks.title,
      images: artworks.images,
      priceNpr: artworks.priceNpr,
      status: artworks.status,
      artistName: profiles.fullName,
      artistSlug: artists.slug,
      addedAt: wishlistItems.addedAt,
    })
    .from(wishlistItems)
    .innerJoin(artworks, eq(wishlistItems.artworkId, artworks.id))
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(wishlistItems.userId, user.id))
    .orderBy(desc(wishlistItems.addedAt));

  return items;
}

export async function isInWishlist(artworkId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const [item] = await db
    .select()
    .from(wishlistItems)
    .where(and(
      eq(wishlistItems.userId, user.id),
      eq(wishlistItems.artworkId, artworkId)
    ))
    .limit(1);

  return !!item;
}
