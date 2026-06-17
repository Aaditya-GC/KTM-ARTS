"use server";

import { db } from "@/lib/db";
import { reviews, profiles, artworks } from "@/lib/db/schema";
import { eq, desc, and, asc, avg, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getReviewsForArtwork(artworkId: string) {
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      userId: reviews.userId,
      reviewerName: profiles.fullName,
      reviewerAvatar: profiles.avatarUrl,
    })
    .from(reviews)
    .innerJoin(profiles, eq(reviews.userId, profiles.id))
    .where(eq(reviews.artworkId, artworkId))
    .orderBy(desc(reviews.createdAt));
}

export type ReviewWithProfile = Awaited<ReturnType<typeof getReviewsForArtwork>>[number];

export async function getAverageRating(artworkId: string) {
  const [result] = await db
    .select({
      average: avg(reviews.rating),
      total: count(),
    })
    .from(reviews)
    .where(eq(reviews.artworkId, artworkId));

  return {
    average: Math.round(Number(result?.average ?? 0) * 10) / 10,
    count: Number(result?.total ?? 0),
  };
}

export async function getHasUserReviewed(artworkId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.artworkId, artworkId), eq(reviews.userId, user.id)))
    .limit(1);

  return !!existing;
}

export async function submitReview(
  artworkId: string,
  rating: number,
  title: string,
  body: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to leave a review." };
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }

  if (body.length < 10) {
    return { error: "Review must be at least 10 characters." };
  }

  try {
    const [existing] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.artworkId, artworkId), eq(reviews.userId, user.id)))
      .limit(1);

    if (existing) {
      return { error: "You have already reviewed this artwork." };
    }

    await db.insert(reviews).values({
      artworkId,
      userId: user.id,
      rating,
      title: title || null,
      body,
    });

    revalidatePath(`/marketplace/[slug]`);
    return { success: true };
  } catch (err) {
    console.error("Error submitting review:", err);
    return { error: "Failed to submit review. Please try again later." };
  }
}

export async function getAllReviews(sort: "recent" | "highest" | "lowest" = "recent") {
  const orderBy = {
    recent: desc(reviews.createdAt),
    highest: desc(reviews.rating),
    lowest: asc(reviews.rating),
  }[sort];

  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      userId: reviews.userId,
      reviewerName: profiles.fullName,
      reviewerAvatar: profiles.avatarUrl,
      artworkId: reviews.artworkId,
      artworkTitle: artworks.title,
      artworkSlug: artworks.slug,
    })
    .from(reviews)
    .innerJoin(profiles, eq(reviews.userId, profiles.id))
    .innerJoin(artworks, eq(reviews.artworkId, artworks.id))
    .orderBy(orderBy);
}

export async function getOverallRating() {
  const [result] = await db
    .select({
      average: avg(reviews.rating),
      total: count(),
    })
    .from(reviews);

  return {
    average: Math.round(Number(result?.average ?? 0) * 10) / 10,
    count: Number(result?.total ?? 0),
  };
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to delete a review." };
  }

  try {
    const [review] = await db
      .select({ id: reviews.id, userId: reviews.userId })
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!review) {
      return { error: "Review not found." };
    }

    if (review.userId !== user.id) {
      return { error: "You can only delete your own review." };
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    revalidatePath(`/marketplace/[slug]`);
    return { success: true };
  } catch (err) {
    console.error("Error deleting review:", err);
    return { error: "Failed to delete review. Please try again later." };
  }
}
