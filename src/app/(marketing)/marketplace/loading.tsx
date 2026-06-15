import { ArtCardSkeleton } from "@/components/shared/art-card-skeleton";

export default function MarketplaceLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-stretch">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <ArtCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
