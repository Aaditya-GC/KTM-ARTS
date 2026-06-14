"use client";

import { useCart } from "@/hooks/use-cart";
import { CartItemRow } from "@/components/cart/cart-item";
import { GoldButton } from "@/components/shared/gold-button";
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
      <SheetContent side="right" className="w-full sm:max-w-md bg-surface text-on-surface border-outline-variant/20">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-headline-md text-on-surface">
            Your Cart
            {itemCount() > 0 && (
              <span className="text-label-sm text-on-surface-variant">({itemCount()} items)</span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">shopping_bag</span>
              <p className="text-body-md text-on-surface-variant">Your cart is empty</p>
              <Link
                href="/marketplace"
                onClick={onClose}
                className="text-primary text-label-sm uppercase tracking-widest hover:underline"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {items.map((item) => (
                  <CartItemRow key={item.artworkId} item={item} onRemove={removeItem} />
                ))}
              </div>

              <div className="border-t border-outline-variant/20 pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-on-surface">Total</span>
                  <span className="text-headline-md text-primary">NPR {totalNpr().toLocaleString()}</span>
                </div>
                <Link href="/dashboard/customer/checkout" onClick={onClose}>
                  <GoldButton className="w-full">Proceed to Checkout</GoldButton>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
