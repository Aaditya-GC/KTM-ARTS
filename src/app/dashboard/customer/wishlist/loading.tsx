export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-surface-container-high rounded-sm mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-container-low border border-outline-variant rounded-sm overflow-hidden">
            <div className="aspect-[4/5] bg-surface-container-high" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-surface-container-high rounded-sm" />
              <div className="h-3 w-1/2 bg-surface-container-high rounded-sm" />
              <div className="h-4 w-1/3 bg-surface-container-high rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
