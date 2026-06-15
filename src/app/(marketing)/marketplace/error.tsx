"use client";

export default function MarketplaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
      <span className="material-symbols-outlined text-6xl text-error/30 mb-4 block">error_outline</span>
      <h2 className="text-headline-md text-on-surface mb-2">Failed to Load Marketplace</h2>
      <p className="text-body-md text-on-surface-variant mb-6">Please try again.</p>
      <button
        onClick={reset}
        className="border border-secondary text-secondary px-8 py-3 rounded-sm text-label-sm uppercase tracking-widest font-bold hover:bg-surface-dim transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
