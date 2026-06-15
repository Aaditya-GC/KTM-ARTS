"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-primary text-4xl mb-4">✓</div>
        <h2 className="text-headline-md text-on-surface">Check Your Email</h2>
        <p className="text-body-md text-on-surface-variant">
          We sent a verification link to your email address.
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-headline-md text-on-surface">Create Account</h2>
        <p className="text-body-md text-on-surface-variant mt-2">
          Join the sacred archive
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="fullName"
            placeholder="Full Name"
            className="bg-surface-container-low border-outline-variant text-on-surface"
            required
          />
        </div>
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            className="bg-surface-container-low border-outline-variant text-on-surface"
            required
          />
        </div>
        <div>
          <Input
            name="password"
            type="password"
            placeholder="Password (min 8 characters)"
            className="bg-surface-container-low border-outline-variant text-on-surface"
            required
            minLength={8}
          />
        </div>
        <div>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="bg-surface-container-low border-outline-variant text-on-surface"
            required
          />
        </div>

        {error && (
          <div className="bg-error-container/20 text-error text-label-sm px-4 py-2 rounded-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full gold-leaf-button rounded-full h-12 text-label-sm uppercase font-bold tracking-widest"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-body-md text-on-surface-variant">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
