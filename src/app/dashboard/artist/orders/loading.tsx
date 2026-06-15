export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-surface-container-high rounded-sm" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-surface-container-low border border-outline-variant p-5 rounded-sm">
          <div className="h-5 w-3/4 bg-surface-container-high rounded-sm" />
          <div className="h-4 w-1/3 bg-surface-container-high rounded-sm mt-3" />
          <div className="h-4 w-1/4 bg-surface-container-high rounded-sm mt-1" />
          <div className="h-px bg-outline-variant/30 my-3" />
          <div className="h-4 w-1/2 bg-surface-container-high rounded-sm" />
        </div>
      ))}
    </div>
  );
}
