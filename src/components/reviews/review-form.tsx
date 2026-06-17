"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/lib/review-actions";
import Link from "next/link";
import { clsx } from "clsx";

interface ReviewFormProps {
  artworkId: string;
  isAuthenticated: boolean;
  hasReviewed: boolean;
}

export function ReviewForm({ artworkId, isAuthenticated, hasReviewed }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="bg-surface-dim border border-outline p-6 rounded-sm text-center">
        <p className="text-body-md text-on-surface-variant mb-3">Sign in to leave a review</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2 bg-secondary text-on-secondary text-label-sm uppercase tracking-widest rounded-sm hover:bg-accent transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="bg-surface-dim border border-outline p-6 rounded-sm text-center">
        <p className="text-body-md text-on-surface-variant">You have already reviewed this artwork</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-surface-dim border border-outline p-6 rounded-sm text-center">
        <span className="material-symbols-outlined text-3xl text-primary">check_circle</span>
        <p className="text-body-md text-on-surface font-medium mt-2">Review posted successfully!</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (body.length < 10) {
      setError("Review must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    const result = await submitReview(artworkId, rating, title, body);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setRating(0);
      setTitle("");
      setBody("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Your Rating</p>
        <div className="flex items-center gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <span
                className={clsx(
                  "material-symbols-outlined",
                  star <= (hoverRating || rating) ? "text-primary" : "text-outline"
                )}
                style={{
                  fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                star
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full bg-surface-dim border border-outline rounded-sm px-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts about this artwork..."
          rows={4}
          className="w-full bg-surface-dim border border-outline rounded-sm px-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="text-label-sm text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 bg-secondary text-on-secondary text-label-sm uppercase tracking-widest rounded-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
}
