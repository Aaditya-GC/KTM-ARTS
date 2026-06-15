"use client";

import Image from "next/image";
import { removeFromWishlist } from "@/lib/wishlist-actions";
import Link from "next/link";

interface WishlistItem {
  artworkId: string;
  slug: string;
  title: string;
  images: string[];
  priceNpr: number;
  status: string;
  artistName: string;
  artistSlug: string;
}

export function WishlistClient({ items }: { items: WishlistItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.artworkId}
          className="bg-surface-container-low border border-outline-variant rounded-sm overflow-hidden"
        >
          <Link href={`/marketplace/${item.slug}`}>
            <div className="aspect-[4/5] relative bg-surface-container-higher">
              {item.images?.[0] ? (
                <Image src={item.images[0]} alt={item.title} fill className="object-cover" sizes="(max-width: 600px) 100vw, 300px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">image</span>
                </div>
              )}
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/marketplace/${item.slug}`}>
              <p className="text-body-md text-on-surface line-clamp-1 hover:text-accent transition-colors">{item.title}</p>
            </Link>
            <p className="text-label-sm text-on-surface-variant italic mt-1">{item.artistName}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-body-md font-bold text-primary">NPR {item.priceNpr.toLocaleString()}</p>
              <button
                onClick={async () => {
                  await removeFromWishlist(item.artworkId);
                }}
                className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
