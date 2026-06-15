export default function Loading() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl">
      <div className="h-8 w-48 bg-surface-container-high rounded-sm" />
      <div className="h-6 w-64 bg-surface-container-high rounded-sm" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface-container-low border border-outline-variant rounded-sm" />
        ))}
      </div>
    </div>
  );
}
