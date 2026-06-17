"use client";

import Image from "next/image";
import { StarRating } from "./star-rating";
import type { ReviewWithProfile } from "@/lib/review-actions";

interface ReviewCardProps {
  review: ReviewWithProfile;
  isOwn?: boolean;
  onDelete?: (id: string) => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(date: Date | string) {
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ReviewCard({ review, isOwn, onDelete }: ReviewCardProps) {
  return (
    <div className="relative bg-surface-dim border border-outline p-4 rounded-sm">
      {isOwn && onDelete && (
        <button
          onClick={() => onDelete(review.id)}
          className="absolute top-3 right-3 text-on-surface-variant/50 hover:text-error transition-colors"
          aria-label="Delete review"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      )}

      <div className="flex items-center gap-3 mb-3">
        {review.reviewerAvatar ? (
          <Image
            src={review.reviewerAvatar}
            alt={review.reviewerName}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-label-sm font-semibold text-primary">
            {getInitials(review.reviewerName)}
          </div>
        )}
        <div>
          <p className="text-body-md text-on-surface font-medium">{review.reviewerName}</p>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-label-sm text-on-surface-variant">{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>

      {review.title && (
        <h4 className="text-body-md text-on-surface font-semibold mb-1">{review.title}</h4>
      )}
      <p className="text-body-md text-on-surface-variant leading-relaxed">{review.body}</p>
    </div>
  );
}
