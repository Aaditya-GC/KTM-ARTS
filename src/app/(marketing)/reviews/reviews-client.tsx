"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAllReviews, getOverallRating } from "@/lib/review-actions";
import type { getAllReviews as GetAllReviewsType } from "@/lib/review-actions";

type Review = Awaited<ReturnType<typeof GetAllReviewsType>>[number];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(date: Date | string) {
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function StarDisplay({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "text-sm" : "text-lg";
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined"
          style={{
            color: star <= rating ? "#7A5C00" : "#DDD0BC",
            fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0",
            fontSize: "inherit",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

interface ReviewsClientProps {
  initialReviews: Review[];
  initialOverall: { average: number; count: number };
}

export function ReviewsClient({ initialReviews, initialOverall }: ReviewsClientProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [overall, setOverall] = useState(initialOverall);
  const [sort, setSort] = useState<"recent" | "highest" | "lowest">("recent");
  const [loading, setLoading] = useState(false);

  const loadReviews = useCallback(async (sortBy: typeof sort) => {
    setLoading(true);
    const [data, rating] = await Promise.all([
      getAllReviews(sortBy),
      getOverallRating(),
    ]);
    setReviews(data);
    setOverall(rating);
    setLoading(false);
  }, []);

  function handleSortChange(newSort: typeof sort) {
    setSort(newSort);
    loadReviews(newSort);
  }

  // Supabase Realtime — synchronize with external DB inserts
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("reviews")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        () => {
          loadReviews(sort);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sort, loadReviews]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs" style={{ color: "#8C6A4E" }}>
          Home / Customer Reviews
        </p>

        <div className="text-center mt-4">
          <h1 className="text-2xl font-medium" style={{ color: "#1C1008" }}>
            Customer Reviews
          </h1>

          {overall.count > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <StarDisplay rating={Math.round(overall.average)} />
              <span className="text-sm" style={{ color: "#1C1008" }}>
                {overall.average} out of 5
              </span>
              <span className="text-sm" style={{ color: "#8C6A4E" }}>
                Based on {overall.count} {overall.count === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>

        <div style={{ height: 1, backgroundColor: "#DDD0BC", margin: "32px 0" }} />

        {/* Sort */}
        <div className="flex items-center gap-2 mb-8">
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as typeof sort)}
            className="text-sm px-4 py-2 border outline-none appearance-none cursor-pointer"
            style={{
              backgroundColor: "#EDE5D8",
              borderColor: "#DDD0BC",
              color: "#1C1008",
              borderRadius: 0,
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-sm" style={{ color: "#8C6A4E" }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm" style={{ color: "#8C6A4E" }}>No reviews yet.</p>
        ) : (
          <div className="space-y-0">
            {reviews.map((review) => (
              <div key={review.id}>
                <div className="py-6">
                  <Link
                    href={`/marketplace/${review.artworkSlug}`}
                    className="text-xs block mb-2 hover:opacity-80 transition-opacity"
                    style={{ color: "#8C6A4E" }}
                  >
                    about {review.artworkTitle}
                  </Link>

                  <div className="flex items-center gap-2 mb-2">
                    <StarDisplay rating={review.rating} size="sm" />
                    <span
                      className="text-xs px-2 py-0.5 border flex items-center gap-1"
                      style={{
                        backgroundColor: "#EDE5D8",
                        color: "#7A5C00",
                        borderColor: "#DDD0BC",
                      }}
                    >
                      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: "#1C1008" }}>
                      {review.reviewerName}
                    </span>
                    <span className="text-xs" style={{ color: "#8C6A4E" }}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {review.title && (
                    <p className="font-medium text-sm mb-1" style={{ color: "#1C1008" }}>
                      {review.title}
                    </p>
                  )}

                  <p className="text-sm leading-relaxed" style={{ color: "#1C1008" }}>
                    {review.body}
                  </p>
                </div>
                <div style={{ height: 1, backgroundColor: "#DDD0BC" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
