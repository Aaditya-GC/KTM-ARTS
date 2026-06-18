"use client";

import { toast } from "sonner";
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/wishlist-actions";
import { useState, useEffect } from "react";

export function AddToWishlistButton({
  artworkId,
  size = "md",
  initialInWishlist,
}: {
  artworkId: string;
  size?: "sm" | "md";
  initialInWishlist?: boolean;
}) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist ?? false);
  const [loading, setLoading] = useState(initialInWishlist === undefined);

  useEffect(() => {
    if (initialInWishlist !== undefined) return;
    isInWishlist(artworkId).then(setInWishlist).finally(() => setLoading(false));
  }, [artworkId, initialInWishlist]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      await removeFromWishlist(artworkId);
      setInWishlist(false);
      toast.success("Removed from wishlist");
    } else {
      await addToWishlist(artworkId);
      setInWishlist(true);
      toast.success("Added to wishlist");
    }
  }

  return (
    <span
      onClick={handleClick}
      onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
      draggable={false}
      className="inline-flex cursor-pointer p-1 hover:text-primary transition-colors"
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      role="button"
      tabIndex={0}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: inWishlist ? "'FILL' 1, 'wght' 300" : "'FILL' 0, 'wght' 300" }}
      >
        favorite
      </span>
    </span>
  );
}
