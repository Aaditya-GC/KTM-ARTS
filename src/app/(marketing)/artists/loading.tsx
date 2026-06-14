import { ArtistCardSkeleton } from "@/components/shared/art-card-skeleton";

export default function ArtistsLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {Array.from({ length: 4 }).map((_, i) => (
          <ArtistCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
