import Image from "next/image";
import Link from "next/link";
import { BadgeVerified } from "@/components/shared/badge-verified";
import { AddToWishlistButton } from "@/components/cart/add-to-wishlist-button";

interface ArtCardProps {
  artwork: {
    id?: string;
    slug: string;
    title: string;
    images: string[];
    priceNpr: number;
    priceUsd?: number | null;
    status: "available" | "reserved" | "sold" | "draft";
    isVerified: boolean;
    artist: {
      name: string;
      slug: string;
    };
  };
  inWishlist?: boolean;
}

const statusColors = {
  available: "bg-accent text-accent-foreground",
  reserved: "bg-secondary text-on-secondary",
  sold: "bg-surface-variant text-on-surface-variant",
  draft: "bg-surface-variant text-on-surface-variant",
};

const statusLabels = {
  available: "Available",
  reserved: "Reserve Only",
  sold: "Sold",
  draft: "Draft",
};

export function ArtCard({ artwork, inWishlist }: ArtCardProps) {
  return (
    <Link href={`/marketplace/${artwork.slug}`} className="group flex flex-col h-full art-card-reveal hover:-translate-y-0.5 transition-transform duration-300">
      <div className="bg-surface-container-low p-2">
        <div className="relative overflow-hidden aspect-[4/5]">
          {artwork.images[0] ? (
            <Image
              src={artwork.images[0]}
              alt={artwork.title}
              fill
              className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-higher flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">image</span>
            </div>
          )}
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-label-sm uppercase tracking-widest ${statusColors[artwork.status]}`}>
            {statusLabels[artwork.status]}
          </span>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
      <div className="flex flex-col flex-1 pt-3 px-1 pb-1">
        <h3 className="text-body-lg text-on-surface group-hover:text-accent transition-colors line-clamp-2 min-h-[3rem] leading-snug">
          {artwork.title}
        </h3>
        <p className="text-label-sm text-on-surface-variant italic mt-1 line-clamp-1">{artwork.artist.name}</p>
        <div className="flex items-center justify-between mt-2">
          {artwork.isVerified && <BadgeVerified />}
          {artwork.id && <AddToWishlistButton artworkId={artwork.id} size="sm" initialInWishlist={inWishlist} />}
        </div>
        <p className="text-body-md font-bold text-primary mt-auto pt-3">
          NPR {artwork.priceNpr.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
