"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-headline-md text-on-surface">Welcome Back</h2>
        <p className="text-body-md text-on-surface-variant mt-2">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password"
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
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-body-md text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
