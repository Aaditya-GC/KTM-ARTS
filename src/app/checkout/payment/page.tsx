"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCheckoutStore } from "@/lib/checkout-store";
import { useCart } from "@/hooks/use-cart";
import { createPaymentIntent } from "@/lib/stripe-actions";
import { createCheckoutOrder } from "@/lib/checkout-actions";
import { createClient } from "@/lib/supabase/client";
import { GoldButton } from "@/components/shared/gold-button";
import { Skeleton } from "@/components/ui/skeleton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function formatNpr(amount: number) {
  return `NPR ${amount.toLocaleString()}`;
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const shipping = useCheckoutStore((s) => s.shipping);
  const clientSecret = useCheckoutStore((s) => s.clientSecret);
  const paymentIntentId = useCheckoutStore((s) => s.paymentIntentId);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const order = await createCheckoutOrder({
      customerId: user?.id,
      shippingName: shipping.fullName,
      shippingAddress: {
        addressLine1: shipping.addressLine1,
        addressLine2: shipping.addressLine2,
        city: shipping.city,
        state: shipping.state,
        postalCode: shipping.postalCode,
        country: shipping.country,
      },
      shippingPhone: shipping.phone,
      notes: "",
      stripePaymentIntentId: paymentIntentId ?? "",
      items: items.map((i) => ({ artworkId: i.artworkId, priceNpr: i.priceNpr })),
    });

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret!,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment confirmation failed");
      setLoading(false);
      return;
    }

    clearCart();
    useCheckoutStore.getState().reset();
    router.push(`/checkout/confirmation/${order.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="bg-error-container/20 border border-error/30 rounded-sm p-4">
          <p className="text-body-md text-error">{error}</p>
        </div>
      )}
      <GoldButton type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay ${formatNpr(items.reduce((s, i) => s + i.priceNpr, 0))}`}
      </GoldButton>
    </form>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const totalNpr = items.reduce((s, i) => s + i.priceNpr, 0);
  const shipping = useCheckoutStore((s) => s.shipping);
  const clientSecret = useCheckoutStore((s) => s.clientSecret);
  const setPaymentIntent = useCheckoutStore((s) => s.setPaymentIntent);
  const [ready, setReady] = useState(!!clientSecret);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/checkout");
      return;
    }
    if (!shipping.fullName) {
      router.replace("/checkout/shipping");
      return;
    }
    if (!clientSecret) {
      createPaymentIntent(totalNpr).then((result) => {
        setPaymentIntent(result.clientSecret, result.paymentIntentId);
        setReady(true);
      });
    }
  }, [items.length, shipping.fullName, clientSecret, totalNpr, router, setPaymentIntent]);

  if (!ready) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-headline-md text-on-surface mb-8">Payment</h1>
        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret! }}>
          <PaymentForm />
        </Elements>
      </div>

      <div className="md:col-span-1">
        <div className="bg-surface-container-low p-6 rounded-sm space-y-4 sticky top-8">
          <h2 className="text-label-sm uppercase tracking-widest text-primary">Order Summary</h2>
          {items.map((item) => (
            <div key={item.artworkId} className="flex justify-between text-body-md">
              <span className="text-on-surface truncate mr-2">{item.title}</span>
              <span className="text-on-surface-variant shrink-0">{formatNpr(item.priceNpr)}</span>
            </div>
          ))}
          <div className="border-t border-outline-variant/20 pt-4 space-y-2">
            <div className="flex justify-between text-body-md">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="text-on-surface">{formatNpr(totalNpr)}</span>
            </div>
            <div className="flex justify-between text-body-md">
              <span className="text-on-surface-variant">Shipping</span>
              <span className="text-on-surface">Free</span>
            </div>
          </div>
          <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
            <span className="text-body-md text-on-surface font-semibold">Total</span>
            <span className="text-headline-md text-primary">{formatNpr(totalNpr)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
