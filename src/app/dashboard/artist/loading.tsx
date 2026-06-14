export default function ArtistDashboardLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-surface-container-higher rounded-sm w-1/3" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container-low border border-outline-variant p-6 rounded-sm">
            <div className="h-4 bg-surface-container-higher rounded-sm w-1/2 mb-3" />
            <div className="h-10 bg-surface-container-higher rounded-sm w-1/3" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-surface-container-low rounded-sm">
            <div className="w-14 h-14 bg-surface-container-higher rounded-sm" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-container-higher rounded-sm w-1/3" />
              <div className="h-3 bg-surface-container-higher rounded-sm w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
