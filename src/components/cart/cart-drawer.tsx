"use client";

import { useCart } from "@/hooks/use-cart";
import { CartItemRow } from "@/components/cart/cart-item";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, totalNpr, itemCount } = useCart();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-surface text-on-surface border-outline-variant/20 px-0">
        <SheetHeader className="px-6">
          <SheetTitle className="flex items-center gap-2 text-headline-md text-on-surface">
            Your Cart
            {itemCount() > 0 && (
              <span className="text-label-sm text-on-surface-variant">({itemCount()} items)</span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-6">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">shopping_bag</span>
              <p className="text-body-md text-on-surface-variant">Your cart is empty</p>
              <Link
                href="/marketplace"
                onClick={onClose}
                className="text-accent text-label-sm uppercase tracking-widest hover:underline"
              >
                Browse Artworks
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6">
                {items.map((item) => (
                  <CartItemRow key={item.artworkId} item={item} onRemove={removeItem} />
                ))}
              </div>

              <div className="border-t border-outline-variant/20 px-6 pt-4 pb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-on-surface-variant">Total</span>
                  <span className="text-xl font-semibold text-on-surface">NPR {totalNpr().toLocaleString()}</span>
                </div>
                <Link href="/dashboard/customer/checkout" onClick={onClose}>
                  <button className="w-full bg-secondary text-on-secondary font-medium py-2.5 rounded-sm text-sm hover:bg-accent transition-colors">
                    Proceed to Checkout
                  </button>
                </Link>
                <Link
                  href="/marketplace"
                  onClick={onClose}
                  className="block w-full border border-secondary text-secondary font-medium py-2.5 rounded-sm text-sm text-center hover:bg-surface-dim transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
