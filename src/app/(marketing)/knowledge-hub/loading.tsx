export default function KnowledgeHubLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap animate-pulse">
      <div className="text-center mb-16 space-y-4">
        <div className="h-3 bg-surface-container-low rounded w-32 mx-auto" />
        <div className="h-8 bg-surface-container-low rounded w-72 max-w-full mx-auto" />
        <div className="h-4 bg-surface-container-low rounded w-2/3 max-w-xl mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[16/9] bg-surface-container-low rounded-sm" />
            <div className="space-y-2">
              <div className="h-3 bg-surface-container-low rounded w-24" />
              <div className="h-5 bg-surface-container-low rounded w-3/4" />
              <div className="h-3 bg-surface-container-low rounded w-full" />
              <div className="h-3 bg-surface-container-low rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
