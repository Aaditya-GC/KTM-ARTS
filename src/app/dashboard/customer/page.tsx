"use client";

import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const { items, removeItem } = useCart();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <section>
        <h1 className="text-headline-md text-on-surface mb-6">My Dashboard</h1>

        <h2 className="text-label-sm uppercase tracking-widest text-primary mb-4">
          Items in Your Cart
          {items.length > 0 && (
            <span className="text-on-surface-variant ml-2">({items.length})</span>
          )}
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low rounded-sm">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">shopping_bag</span>
            <p className="text-body-md text-on-surface-variant mb-3">No items in cart</p>
            <Link
              href="/marketplace"
              className="text-accent text-label-sm uppercase tracking-widest hover:underline inline-block"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.artworkId}
                className="flex items-center gap-4 bg-surface-container-low p-4 rounded-sm"
              >
                <div className="w-16 h-16 shrink-0 bg-surface rounded-sm overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant/30">image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md text-on-surface line-clamp-1">{item.title}</p>
                  <p className="text-body-md text-primary mt-0.5">NPR {item.priceNpr.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/dashboard/customer/checkout"
                    className="text-label-sm uppercase tracking-widest text-primary hover:underline"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={() => removeItem(item.artworkId)}
                    className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-label-sm uppercase tracking-widest text-primary mb-4">Orders</h2>
        <div className="text-center py-12 bg-surface-container-low rounded-sm">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">receipt_long</span>
          <p className="text-body-md text-on-surface-variant">No orders yet</p>
        </div>
      </section>
    </div>
  );
}
