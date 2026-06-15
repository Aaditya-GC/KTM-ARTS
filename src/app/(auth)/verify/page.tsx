import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="text-center space-y-4">
      <div className="text-primary text-4xl mb-4">✉</div>
      <h2 className="text-headline-md text-on-surface">Check Your Email</h2>
      <p className="text-body-md text-on-surface-variant">
        We sent a verification link to your email address.
        <br />
        Please verify your account before signing in.
      </p>
      <Link
        href="/login"
        className="text-accent text-label-sm uppercase tracking-widest hover:underline inline-block mt-4"
      >
        Go to Sign In
      </Link>
    </div>
  );
}
