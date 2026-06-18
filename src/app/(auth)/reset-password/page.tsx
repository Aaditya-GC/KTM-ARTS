"use client";

import { useState } from "react";
import { updatePassword } from "@/lib/auth/reset-password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
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

    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-headline-md text-on-surface">Set New Password</h2>
        <p className="text-body-md text-on-surface-variant mt-2">
          Choose a strong password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="password"
            type="password"
            placeholder="New password (min 8 characters)"
            className="bg-surface-container-low border-outline-variant text-on-surface"
            required
            minLength={8}
          />
        </div>
        <div>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
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
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>

      <p className="text-center text-body-md text-on-surface-variant">
        <Link href="/login" className="text-accent hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
