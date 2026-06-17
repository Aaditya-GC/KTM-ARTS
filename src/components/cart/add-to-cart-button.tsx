"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { GoldButton } from "@/components/shared/gold-button";
import { OutlineButton } from "@/components/shared/outline-button";

interface AddToCartButtonProps {
  artwork: {
    id: string;
    slug: string;
    title: string;
    images: string[];
    priceNpr: number;
    artistName: string;
  };
}

export function AddToCartButton({ artwork }: AddToCartButtonProps) {
  const { addItem, isInCart, removeItem } = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const inCart = hydrated && isInCart(artwork.id);

  function handleToggle() {
    if (inCart) {
      removeItem(artwork.id);
      toast.success("Removed from cart");
    } else {
      addItem({
        artworkId: artwork.id,
        slug: artwork.slug,
        title: artwork.title,
        image: artwork.images[0] ?? "",
        priceNpr: artwork.priceNpr,
        artistName: artwork.artistName,
        addedAt: Date.now(),
      });
      toast.success("Added to cart");
    }
  }

  return (
    <GoldButton onClick={handleToggle} className="w-full">
      {inCart ? "Remove from Cart" : "Add to Cart"}
    </GoldButton>
  );
}
