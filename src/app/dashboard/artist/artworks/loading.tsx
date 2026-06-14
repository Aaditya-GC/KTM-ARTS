export default function ArtworksLoading() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-surface-container-low rounded-sm animate-pulse">
          <div className="w-20 h-20 bg-surface-container-higher rounded-sm shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-surface-container-higher rounded-sm w-1/3" />
            <div className="h-4 bg-surface-container-higher rounded-sm w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
