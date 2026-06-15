export default function Loading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 w-48 bg-surface-container-high rounded-sm" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-surface-container-low border border-outline-variant rounded-sm" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-5 w-32 bg-surface-container-high rounded-sm" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-20 bg-surface-container-low border border-outline-variant rounded-sm" />
        ))}
      </div>
    </div>
  );
}
