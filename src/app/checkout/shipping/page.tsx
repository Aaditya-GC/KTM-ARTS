"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/lib/checkout-store";
import { useCart } from "@/hooks/use-cart";
import { GoldButton } from "@/components/shared/gold-button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

interface FormErrors {
  [key: string]: string;
}

export default function ShippingPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const shipping = useCheckoutStore((s) => s.shipping);
  const setShipping = useCheckoutStore((s) => s.setShipping);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/checkout");
      return;
    }
    async function prefetchProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !shipping.fullName) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();
        if (profile) {
          setShipping({
            ...shipping,
            fullName: shipping.fullName || profile.full_name || "",
            email: shipping.email || "",
          });
        }
      }
    }
    prefetchProfile();
  }, [items.length, shipping, setShipping, router]);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!shipping.fullName.trim()) errs.fullName = "Full name is required";
    if (!shipping.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) errs.email = "Invalid email format";
    if (!shipping.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\+?[\d\s-]{7,15}$/.test(shipping.phone)) errs.phone = "Invalid phone number";
    if (!shipping.addressLine1.trim()) errs.addressLine1 = "Address is required";
    if (!shipping.city.trim()) errs.city = "City is required";
    if (!shipping.country.trim()) errs.country = "Country is required";
    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    router.push("/checkout/payment");
  }

  function update(field: keyof typeof shipping, value: string) {
    setShipping({ ...shipping, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <div>
      <h1 className="text-headline-md text-on-surface mb-8">Shipping Address</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">Full Name</label>
              <Input value={shipping.fullName} onChange={(e) => update("fullName", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
              {errors.fullName && <p className="text-label-sm text-error mt-1">{errors.fullName}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">Email</label>
              <Input type="email" value={shipping.email} onChange={(e) => update("email", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
              {errors.email && <p className="text-label-sm text-error mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">Phone</label>
            <Input value={shipping.phone} onChange={(e) => update("phone", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
            {errors.phone && <p className="text-label-sm text-error mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">Address Line 1</label>
            <Input value={shipping.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
            {errors.addressLine1 && <p className="text-label-sm text-error mt-1">{errors.addressLine1}</p>}
          </div>

          <div>
            <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">Address Line 2 <span className="text-on-surface-variant/40">(optional)</span></label>
            <Input value={shipping.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">City</label>
              <Input value={shipping.city} onChange={(e) => update("city", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
              {errors.city && <p className="text-label-sm text-error mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">State</label>
              <Input value={shipping.state} onChange={(e) => update("state", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
            </div>
            <div>
              <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">Postal Code</label>
              <Input value={shipping.postalCode} onChange={(e) => update("postalCode", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
            </div>
            <div>
              <label className="text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-1.5 block">Country</label>
              <Input value={shipping.country} onChange={(e) => update("country", e.target.value)} className="bg-surface-container-low border-outline-variant/30 text-on-surface" />
              {errors.country && <p className="text-label-sm text-error mt-1">{errors.country}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link href="/checkout" className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-accent transition-colors">
              Back to Cart
            </Link>
            <GoldButton type="submit">Continue to Payment</GoldButton>
          </div>
        </form>

        <div className="md:col-span-1">
          <div className="bg-surface-container-low p-6 rounded-sm space-y-4 sticky top-8">
            <h2 className="text-label-sm uppercase tracking-widest text-primary">Order Summary</h2>
            {items.map((item) => (
              <div key={item.artworkId} className="flex justify-between text-body-md">
                <span className="text-on-surface truncate mr-2">{item.title}</span>
                <span className="text-on-surface-variant shrink-0">NPR {item.priceNpr.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
              <span className="text-body-md text-on-surface font-semibold">Total</span>
              <span className="text-headline-md text-primary">NPR {items.reduce((s, i) => s + i.priceNpr, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
