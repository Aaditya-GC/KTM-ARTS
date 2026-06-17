"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { PriceDisplay } from "@/components/shared/price-display";

const inputStyle = "bg-surface-dim border-outline text-on-surface h-11 rounded-sm px-3 placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-0";
const labelStyle = "text-[11px] uppercase tracking-widest text-on-surface-variant mb-1.5 block font-medium";

function DiscountCode() {
  const [code, setCode] = useState("");

  return (
    <div className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Discount code"
        className={`${inputStyle} flex-1`}
      />
      <button
        type="button"
        className="px-4 py-2 text-[11px] uppercase tracking-widest text-on-background border border-on-background rounded-sm hover:bg-surface-dim transition-colors duration-150 shrink-0"
      >
        Apply
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalNpr } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("khalti");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("items", JSON.stringify(items.map((i) => ({
      artworkId: i.artworkId,
      title: i.title,
      priceNpr: i.priceNpr,
    }))));
    formData.set("paymentMethod", paymentMethod);
    formData.set("shippingAddress", JSON.stringify({
      street: formData.get("shippingAddress[street]"),
      city: formData.get("shippingAddress[city]"),
      country: formData.get("shippingAddress[country]"),
    }));

    const { initiateOrderPayment } = await import("@/lib/order-actions");
    await initiateOrderPayment(formData, true);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">shopping_bag</span>
        <h1 className="text-headline-md text-on-surface mb-2">Your Cart is Empty</h1>
        <p className="text-body-md text-on-surface-variant mb-6">Add some artworks to get started.</p>
        <Link href="/marketplace" className="text-accent text-label-sm uppercase tracking-widest hover:underline">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const total = totalNpr();

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop lg:px-[96px] py-10 bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] mb-10">
        <span className="text-primary font-medium">Information</span>
        <span className="text-on-surface-variant/50">›</span>
        <span className="text-on-surface-variant/60">Shipping</span>
        <span className="text-on-surface-variant/50">›</span>
        <span className="text-on-surface-variant/60">Payment</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-16">
        {/* Left — Form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="md:col-span-3 space-y-8">
          {/* Contact */}
          <div>
            <h2 className="text-[18px] text-on-surface font-medium mb-5">Contact</h2>
            <label className={labelStyle}>Email</label>
            <Input
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className={inputStyle}
            />
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-[18px] text-on-surface font-medium mb-5">Shipping address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>First name</label>
                  <Input name="shippingName" placeholder="First name" required className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Last name</label>
                  <Input name="shippingLastName" placeholder="Last name" required className={inputStyle} />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Street address</label>
                <Input name="shippingAddress[street]" placeholder="Street address" required className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Apartment, suite, etc. (optional)</label>
                <Input name="shippingAddress[apartment]" placeholder="Apartment, suite, etc." className={inputStyle} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelStyle}>City</label>
                  <Input name="shippingAddress[city]" placeholder="City" required className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>State / Province</label>
                  <Input name="shippingAddress[state]" placeholder="State / Province" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Postal code</label>
                  <Input name="shippingAddress[postalCode]" placeholder="Postal code" className={inputStyle} />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Phone (optional)</label>
                <Input name="shippingPhone" type="tel" placeholder="Phone number" className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Country / Region</label>
                <select
                  name="shippingAddress[country]"
                  defaultValue="NP"
                  required
                  className={`${inputStyle} w-full appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%238C6A4E%22%3E%3Cpath%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.17l3.71-3.94a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200L5.21%208.27a.75.75%200%2001.02-1.06z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat pr-10 cursor-pointer`}
                >
                  <option value="NP">Nepal</option>
                  <option value="IN">India</option>
                  <option value="CN">China</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Order notes (optional)</label>
                <textarea
                  name="notes"
                  placeholder="Special instructions, delivery preferences, etc."
                  className={`${inputStyle} w-full min-h-[100px] resize-y pt-3`}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-[18px] text-on-surface font-medium mb-5">Payment Method</h2>
            <div className="max-w-xs">
              <Select value={paymentMethod} onValueChange={(v: string | null) => v && setPaymentMethod(v)}>
                <SelectTrigger className={`${inputStyle} w-full flex items-center justify-between`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-outline text-on-surface">
                  <SelectItem value="khalti" className="text-on-surface hover:bg-surface-dim cursor-pointer">Khalti (NPR)</SelectItem>
                  <SelectItem value="esewa" className="text-on-surface hover:bg-surface-dim cursor-pointer">eSewa (NPR)</SelectItem>
                  <SelectItem value="stripe" className="text-on-surface hover:bg-surface-dim cursor-pointer">Stripe (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 pb-10">
            <Link
              href="/marketplace"
              className="text-[13px] text-on-surface-variant hover:text-accent transition-colors duration-150"
            >
              Continue shopping
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-on-secondary px-8 py-3 rounded-sm text-[13px] uppercase tracking-widest font-medium hover:opacity-90 transition-all duration-150 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue to Payment  →"}
            </button>
          </div>
        </form>

        {/* Right — Order Summary */}
        <div className="md:col-span-2">
          <div className="sticky top-6 space-y-6">
            <h2 className="text-[18px] text-on-surface font-medium">Order summary</h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.artworkId} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 shrink-0 rounded-sm overflow-hidden bg-surface-dim">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant/30">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-on-surface truncate">{item.title}</p>
                    <p className="text-[12px] text-on-surface-variant truncate">{item.artistName}</p>
                  </div>
                  <span className="text-[14px] text-on-surface shrink-0"><PriceDisplay priceNpr={item.priceNpr} /></span>
                </div>
              ))}
            </div>

            <DiscountCode />

            <div className="border-t border-outline pt-4 space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface"><PriceDisplay priceNpr={total} /></span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-on-surface-variant">Calculated at next step</span>
              </div>
            </div>

            <div className="border-t border-outline pt-4 flex justify-between items-center">
              <span className="text-[14px] text-on-surface font-semibold">Total</span>
              <span className="text-[14px] font-bold text-primary"><PriceDisplay priceNpr={total} /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
