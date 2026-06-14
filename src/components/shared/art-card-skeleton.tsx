export function ArtCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="aspect-[4/5] bg-surface-container-low rounded-sm" />
      <div className="space-y-2">
        <div className="h-4 bg-surface-container-low rounded w-3/4" />
        <div className="h-3 bg-surface-container-low rounded w-1/2" />
        <div className="h-5 bg-surface-container-low rounded w-1/3" />
      </div>
    </div>
  );
}

export function ArtistCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="aspect-[3/4] bg-surface-container-low rounded-sm" />
      <div className="space-y-2 text-center">
        <div className="h-4 bg-surface-container-low rounded w-2/3 mx-auto" />
        <div className="h-3 bg-surface-container-low rounded w-1/3 mx-auto" />
      </div>
    </div>
  );
}
