export function ArtCardSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="bg-surface-container-low p-2">
        <div className="aspect-[4/5]" />
      </div>
      <div className="flex flex-col flex-1 pt-3 px-1 pb-1 space-y-1.5">
        <div className="h-4 bg-surface-container-low rounded w-3/4 min-h-[3rem]" />
        <div className="h-3 bg-surface-container-low rounded w-1/2" />
        <div className="h-4 bg-surface-container-low rounded w-1/4 mt-auto" />
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
