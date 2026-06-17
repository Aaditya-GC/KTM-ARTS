"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "./star-rating";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import type { ReviewWithProfile } from "@/lib/review-actions";
import { deleteReview } from "@/lib/review-actions";

interface ReviewsSectionProps {
  artworkId: string;
  initialReviews: ReviewWithProfile[];
  initialAverage: number;
  initialCount: number;
  isAuthenticated: boolean;
  hasReviewed: boolean;
  currentUserId?: string | null;
}

export function ReviewsSection({
  artworkId,
  initialReviews,
  initialAverage,
  initialCount,
  isAuthenticated,
  hasReviewed,
  currentUserId,
}: ReviewsSectionProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Sync state when server components update props
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);
  const average = initialCount > 0 ? initialAverage : 0;
  const count = initialCount;

  const handleDelete = useCallback(async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    if (result.success) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      router.refresh();
    }
  }, [router]);

  return (
    <div>
      <div className="border-t border-outline-variant/20 pt-8">
        <h3 className="text-label-sm uppercase tracking-widest text-primary mb-6">Reviews</h3>
      </div>

      {count > 0 ? (
        <div className="flex items-center gap-4 mb-8">
          <span className="text-headline-md text-on-surface font-medium">{average}</span>
          <StarRating rating={Math.round(average)} size="md" />
          <span className="text-label-sm text-on-surface-variant">from {count} {count === 1 ? "review" : "reviews"}</span>
        </div>
      ) : (
        <p className="text-body-md text-on-surface-variant mb-8">
          No reviews yet. Be the first to share your experience.
        </p>
      )}

      {!hasReviewed && isAuthenticated && (
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-label-sm uppercase tracking-widest text-primary hover:text-accent transition-colors"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
          {showForm && (
            <div className="mt-4">
              <ReviewForm
                artworkId={artworkId}
                isAuthenticated={isAuthenticated}
                hasReviewed={false}
              />
            </div>
          )}
        </div>
      )}

      {!isAuthenticated && (
        <div className="mb-8">
          <ReviewForm
            artworkId={artworkId}
            isAuthenticated={false}
            hasReviewed={false}
          />
        </div>
      )}

      {reviews.length > 0 && (
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwn={currentUserId === review.userId}
              onDelete={handleDelete}
            />
          ))}

          {reviews.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              {showAll ? "Show Less" : `SEE ALL REVIEWS (${reviews.length})`}
            </button>
          )}
        </div>
      )}

      <div className="border-b border-outline-variant/20 pb-8 mt-8" />
    </div>
  );
}
