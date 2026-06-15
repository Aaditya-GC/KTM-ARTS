"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-lg mx-auto px-margin-mobile">
        <span className="material-symbols-outlined text-8xl text-error/30 block mb-6">error_outline</span>
        <h1 className="text-headline-lg text-on-background mb-4">Something Went Wrong</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="border border-secondary text-secondary px-10 py-4 rounded-sm text-label-sm uppercase tracking-widest font-bold hover:bg-surface-dim transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
