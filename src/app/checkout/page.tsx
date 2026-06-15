"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { GoldButton } from "@/components/shared/gold-button";
import { useRouter } from "next/navigation";
import Image from "next/image";

function formatNpr(amount: number) {
  return `NPR ${amount.toLocaleString()}`;
}

export default function CheckoutCartPage() {
  const router = useRouter();
  const { items, removeItem, totalNpr } = useCart();

  function handleProceed() {
    if (items.length === 0) return;
    router.push("/checkout/shipping");
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">shopping_bag</span>
        <h1 className="text-headline-md text-on-surface mb-2">Your Cart is Empty</h1>
        <p className="text-body-md text-on-surface-variant mb-6">Add some artworks to get started.</p>
        <Link href="/marketplace" className="text-accent text-label-sm uppercase tracking-widest hover:underline">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-headline-md text-on-surface mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-1">
          {items.map((item) => (
            <div key={item.artworkId} className="flex items-center gap-4 py-4 border-b border-outline-variant/10">
              <div className="relative w-20 h-20 shrink-0 rounded-sm overflow-hidden bg-surface-container">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant/30">image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md text-on-surface truncate">{item.title}</p>
                <p className="text-label-sm text-on-surface-variant mt-0.5">{item.artistName}</p>
                <p className="text-body-md text-primary mt-1">{formatNpr(item.priceNpr)}</p>
              </div>
              <button
                onClick={() => removeItem(item.artworkId)}
                className="text-on-surface-variant hover:text-error transition-colors shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-surface-container-low p-6 rounded-sm space-y-4 sticky top-8">
            <h2 className="text-label-sm uppercase tracking-widest text-primary">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.artworkId} className="flex justify-between text-body-md">
                  <span className="text-on-surface truncate mr-2">{item.title}</span>
                  <span className="text-on-surface-variant shrink-0">{formatNpr(item.priceNpr)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
              <span className="text-body-md text-on-surface font-semibold">Total</span>
              <span className="text-headline-md text-primary">{formatNpr(totalNpr())}</span>
            </div>
            <GoldButton onClick={handleProceed} className="w-full">
              Proceed to Shipping
            </GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
}
