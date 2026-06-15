export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-8 w-48 bg-surface-container-high rounded-sm mb-8" />
      <div className="space-y-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 bg-surface-container-high rounded-sm" />
        ))}
      </div>
    </div>
  );
}
