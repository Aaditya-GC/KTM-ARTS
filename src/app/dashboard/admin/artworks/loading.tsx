export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-surface-container-high rounded-sm" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-surface-container-low border border-outline-variant rounded-sm" />
      ))}
    </div>
  );
}
