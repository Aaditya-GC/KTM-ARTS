export default function ArtworkDetailLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap animate-pulse">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="aspect-[4/5] bg-surface-container-low rounded-sm" />
        <div className="space-y-6">
          <div className="h-4 bg-surface-container-low rounded w-1/4" />
          <div className="h-8 bg-surface-container-low rounded w-3/4" />
          <div className="h-4 bg-surface-container-low rounded w-1/2" />
          <div className="h-10 bg-surface-container-low rounded w-1/3" />
          <div className="space-y-3 pt-4">
            <div className="h-3 bg-surface-container-low rounded w-full" />
            <div className="h-3 bg-surface-container-low rounded w-5/6" />
            <div className="h-3 bg-surface-container-low rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
