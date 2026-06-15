"use client";

export default function CheckoutErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <span className="material-symbols-outlined text-6xl text-error/40">error_outline</span>
        <h2 className="text-headline-md text-on-background mt-4">Checkout Error</h2>
        <p className="text-body-md text-on-surface-variant mt-2">
          {error.message || "Something went wrong during checkout"}
        </p>
        <button
          onClick={reset}
          className="mt-6 px-8 py-3 bg-secondary text-on-secondary text-label-sm uppercase tracking-widest rounded-full hover:bg-accent transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
