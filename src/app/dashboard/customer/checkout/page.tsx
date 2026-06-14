"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { GoldButton } from "@/components/shared/gold-button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalNpr, clearCart } = useCart();
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
    await initiateOrderPayment(formData);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">shopping_bag</span>
        <h1 className="text-headline-md text-on-surface mb-2">Your Cart is Empty</h1>
        <p className="text-body-md text-on-surface-variant mb-6">Add some artworks to get started.</p>
        <Link href="/marketplace" className="text-primary text-label-sm uppercase tracking-widest hover:underline">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-headline-md text-on-surface mb-8">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <form id="checkout-form" onSubmit={handleSubmit} className="md:col-span-3 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-sm space-y-4">
            <h2 className="text-label-sm uppercase tracking-widest text-primary">Shipping Details</h2>
            <Input
              name="shippingName"
              placeholder="Full Name"
              required
              className="bg-surface border-outline-variant text-on-surface"
            />
            <Input
              name="shippingPhone"
              placeholder="Phone Number"
              required
              className="bg-surface border-outline-variant text-on-surface"
            />
            <Input
              name="shippingAddress[street]"
              placeholder="Street Address"
              required
              className="bg-surface border-outline-variant text-on-surface"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="shippingAddress[city]"
                placeholder="City"
                required
                className="bg-surface border-outline-variant text-on-surface"
              />
              <Input
                name="shippingAddress[country]"
                placeholder="Country"
                required
                className="bg-surface border-outline-variant text-on-surface"
              />
            </div>
            <Input
              name="notes"
              placeholder="Order Notes (optional)"
              className="bg-surface border-outline-variant text-on-surface"
            />
          </div>

          <div className="bg-surface-container-low p-6 rounded-sm space-y-4">
            <h2 className="text-label-sm uppercase tracking-widest text-primary">Payment Method</h2>
            <Select value={paymentMethod} onValueChange={(v: string | null) => v && setPaymentMethod(v)}>
              <SelectTrigger className="bg-surface border-outline-variant text-on-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-container border-outline-variant">
                <SelectItem value="khalti" className="text-on-surface">Khalti (NPR)</SelectItem>
                <SelectItem value="esewa" className="text-on-surface">eSewa (NPR)</SelectItem>
                <SelectItem value="stripe" className="text-on-surface">Stripe (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="md:col-span-2">
          <div className="bg-surface-container-low p-6 rounded-sm space-y-4 sticky top-32">
            <h2 className="text-label-sm uppercase tracking-widest text-primary">Order Summary</h2>
            {items.map((item) => (
              <div key={item.artworkId} className="flex justify-between text-body-md">
                <span className="text-on-surface truncate mr-4">{item.title}</span>
                <span className="text-on-surface-variant shrink-0">NPR {item.priceNpr.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-outline-variant/20 pt-4 flex justify-between">
              <span className="text-body-md text-on-surface font-semibold">Total</span>
              <span className="text-headline-md text-primary">NPR {totalNpr().toLocaleString()}</span>
            </div>
            <GoldButton type="submit" form="checkout-form" className="w-full" disabled={loading}>
              {loading ? "Processing..." : `Place Order`}
            </GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
}
