import { ArtCardSkeleton } from "@/components/shared/art-card-skeleton";

export default function MarketplaceLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArtCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
