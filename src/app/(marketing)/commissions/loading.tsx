export default function CommissionsLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap animate-pulse">
      <div className="text-center mb-16 space-y-4">
        <div className="h-3 bg-surface-container-low rounded w-40 mx-auto" />
        <div className="h-8 bg-surface-container-low rounded w-96 max-w-full mx-auto" />
        <div className="h-4 bg-surface-container-low rounded w-2/3 max-w-xl mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className="h-4 bg-surface-container-low rounded w-32" />
          <div className="h-8 bg-surface-container-low rounded w-3/4" />
          <div className="space-y-3">
            <div className="h-3 bg-surface-container-low rounded w-full" />
            <div className="h-3 bg-surface-container-low rounded w-5/6" />
            <div className="h-3 bg-surface-container-low rounded w-4/6" />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 bg-surface-container-low rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface-container-low rounded w-24" />
                <div className="h-3 bg-surface-container-low rounded w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="aspect-[4/5] bg-surface-container-low rounded-sm" />
      </div>
    </div>
  );
}
