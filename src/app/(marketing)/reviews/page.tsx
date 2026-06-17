import { getAllReviews, getOverallRating } from "@/lib/review-actions";
import { ReviewsClient } from "./reviews-client";

export default async function ReviewsPage() {
  const [initialData, overall] = await Promise.all([
    getAllReviews("recent"),
    getOverallRating(),
  ]);

  return (
    <ReviewsClient
      initialReviews={initialData}
      initialOverall={overall}
    />
  );
}
