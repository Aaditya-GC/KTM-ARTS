import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-lg mx-auto px-margin-mobile">
        <span className="material-symbols-outlined text-8xl text-primary/20 block mb-6">search_insights</span>
        <h1 className="text-display-xl text-on-background mb-4">404</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          The path you seek does not exist in this mandala.
        </p>
        <Link
          href="/"
          className="inline-block border border-secondary text-secondary px-10 py-4 rounded-sm text-label-sm uppercase tracking-widest font-bold hover:bg-surface-dim transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
