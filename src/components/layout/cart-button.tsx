"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function CartButton() {
  const [open, setOpen] = useState(false);
  const itemCount = useCart((s) => s.items.length);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-on-surface-variant hover:text-primary transition-colors relative">
        <span className="material-symbols-outlined">shopping_bag</span>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
