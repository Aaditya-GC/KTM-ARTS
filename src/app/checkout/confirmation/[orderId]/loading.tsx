export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-12 w-64 bg-surface-container-high rounded-sm mx-auto mb-8" />
      <div className="h-6 w-48 bg-surface-container-high rounded-sm mx-auto mb-12" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface-container-low border border-outline-variant rounded-sm" />
        ))}
      </div>
    </div>
  );
}
