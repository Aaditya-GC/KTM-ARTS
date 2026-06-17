"use client";

import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { PriceDisplay } from "@/components/shared/price-display";
import Link from "next/link";

export function CustomerCartSection() {
  const { items, removeItem } = useCart();

  return (
    <section>
      <h2 className="text-label-sm uppercase tracking-widest text-primary mb-4">
        Items in Your Cart
        {items.length > 0 && (
          <span className="text-on-surface-variant ml-2">({items.length})</span>
        )}
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-low border border-outline-variant rounded-sm">
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
              className="flex items-center gap-4 bg-surface-container-low p-4 rounded-sm border border-outline-variant"
            >
              <div className="w-16 h-16 shrink-0 bg-surface-container-higher rounded-sm overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.title} width={64} height={64} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant/30">image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md text-on-surface line-clamp-1">{item.title}</p>
                <p className="text-body-md text-primary mt-0.5"><PriceDisplay priceNpr={item.priceNpr} /></p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/checkout"
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
  );
}
