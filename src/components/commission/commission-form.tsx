"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GoldButton } from "@/components/shared/gold-button";
import { submitCommission } from "@/lib/commission-actions";

const STYLE_OPTIONS = ["Any", "Karma Gadri", "Newari", "Tibetan", "Thangka"];

export function CommissionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitCommission(formData);

    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setSubmitted(true);
    setPending(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
        <h3 className="text-headline-md text-on-background mt-4">Inquiry Submitted</h3>
        <p className="text-body-lg text-on-surface-variant mt-2 max-w-md mx-auto">
          Thank you. Our curation team will review your request and respond within 48 hours with artist recommendations.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-error/10 border border-error/30 rounded-sm p-3">
          <p className="text-body-md text-error">{error}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1.5">
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full bg-surface-dim border border-outline text-on-surface h-11 px-3 text-body-md rounded-sm focus-visible:border-primary focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1.5">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-surface-dim border border-outline text-on-surface h-11 px-3 text-body-md rounded-sm focus-visible:border-primary focus-visible:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1.5">
          Phone <span className="text-on-surface-variant/50">(for WhatsApp)</span>
        </label>
        <input
          id="phone"
          name="phone"
          className="w-full bg-surface-dim border border-outline text-on-surface h-11 px-3 text-body-md rounded-sm focus-visible:border-primary focus-visible:outline-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="deity" className="text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1.5">
            Preferred Deity / Subject
          </label>
          <input
            id="deity"
            name="deity"
            placeholder='e.g. "Buddha", "Tara", "Mandala"'
            className="w-full bg-surface-dim border border-outline text-on-surface h-11 px-3 text-body-md rounded-sm focus-visible:border-primary focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="style" className="text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1.5">
            Preferred Style
          </label>
          <select
            id="style"
            name="style"
            className="w-full bg-surface-dim border border-outline text-on-surface h-11 px-3 text-body-md rounded-sm focus-visible:border-primary focus-visible:outline-none"
          >
            {STYLE_OPTIONS.map((s) => (
              <option key={s} value={s === "Any" ? "" : s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="sizeDescription" className="text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1.5">
            Approximate Size
          </label>
          <input
            id="sizeDescription"
            name="sizeDescription"
            placeholder='e.g. "90cm x 60cm"'
            className="w-full bg-surface-dim border border-outline text-on-surface h-11 px-3 text-body-md rounded-sm focus-visible:border-primary focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="budgetNpr" className="text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1.5">
            Budget (NPR)
          </label>
          <input
            id="budgetNpr"
            name="budgetNpr"
            type="number"
            min={5000}
            placeholder="Min. 5,000"
            className="w-full bg-surface-dim border border-outline text-on-surface h-11 px-3 text-body-md rounded-sm focus-visible:border-primary focus-visible:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1.5">
          Your Vision *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Describe the deity, composition, colors, intention, and any references you have in mind..."
          className="w-full bg-surface-dim border border-outline text-on-surface px-3 py-2 text-body-md rounded-sm focus-visible:border-primary focus-visible:outline-none resize-y"
        />
      </div>

      <GoldButton type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit Inquiry"}
      </GoldButton>
    </form>
  );
}
