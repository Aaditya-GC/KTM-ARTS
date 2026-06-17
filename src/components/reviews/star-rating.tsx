import { clsx } from "clsx";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
}

export function StarRating({ rating, size = "md", showCount, count }: StarRatingProps) {
  const sizeClass = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className={clsx("flex items-center gap-0.5", sizeClass)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={clsx(
              "material-symbols-outlined",
              star <= rating ? "text-primary" : "text-outline"
            )}
            style={{
              fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0",
              fontSize: "inherit",
            }}
          >
            star
          </span>
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-label-sm text-on-surface-variant">({count})</span>
      )}
    </div>
  );
}
