import { getWishlist } from "@/lib/wishlist-actions";
import { WishlistClient } from "./wishlist-client";
import Link from "next/link";

export default async function WishlistPage() {
  const items = await getWishlist();

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-headline-md text-on-surface mb-6">My Wishlist</h1>
        <div className="text-center py-16 bg-surface-container-low border border-outline-variant rounded-sm">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">favorite</span>
          <p className="text-body-lg text-on-surface-variant mt-4">Your wishlist is empty</p>
          <Link
            href="/marketplace"
            className="text-accent text-label-sm uppercase tracking-widest hover:underline mt-2 inline-block"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-headline-md text-on-surface mb-6">My Wishlist</h1>
      <WishlistClient items={items} />
    </div>
  );
}
