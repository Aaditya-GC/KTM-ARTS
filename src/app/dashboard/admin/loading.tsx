export default function Loading() {
  return (
    <div className="animate-pulse p-6 space-y-6">
      <div className="h-8 w-48 bg-surface-container-high rounded-sm" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-surface-container-low border border-outline-variant rounded-sm" />
        ))}
      </div>
    </div>
  );
}
