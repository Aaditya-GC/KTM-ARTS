export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center gap-16 w-full">
          <div className="flex-1 space-y-6">
            <div className="h-3 bg-surface-container-low rounded w-32" />
            <div className="space-y-3">
              <div className="h-16 bg-surface-container-low rounded w-full max-w-2xl" />
              <div className="h-16 bg-surface-container-low rounded w-3/4 max-w-xl" />
            </div>
            <div className="h-4 bg-surface-container-low rounded w-2/3 max-w-md" />
            <div className="flex gap-6 pt-4">
              <div className="h-12 bg-surface-container-low rounded-full w-48" />
              <div className="h-12 bg-surface-container-low rounded-full w-40" />
            </div>
          </div>
          <div className="flex-1 aspect-[4/5] bg-surface-container-low rounded-sm w-full" />
        </div>
      </section>

      {/* Platform cards skeleton */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="grid md:grid-cols-3 gap-gutter">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[500px] bg-surface-container-low rounded-sm" />
          ))}
        </div>
      </section>

      {/* Featured artists skeleton */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="h-8 bg-surface-container-low rounded w-64 mb-4" />
        <div className="h-4 bg-surface-container-low rounded w-96 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] bg-surface-container-low rounded-sm" />
          ))}
        </div>
      </section>
    </div>
  );
}
