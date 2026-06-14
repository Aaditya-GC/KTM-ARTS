import Image from "next/image";
import Link from "next/link";
import { BadgeVerified } from "@/components/shared/badge-verified";

interface ArtCardProps {
  artwork: {
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
}

const statusColors = {
  available: "text-primary",
  reserved: "text-secondary",
  sold: "text-on-surface-variant",
  draft: "text-on-surface-variant",
};

const statusLabels = {
  available: "Available",
  reserved: "Reserve Only",
  sold: "Sold",
  draft: "Draft",
};

export function ArtCard({ artwork }: ArtCardProps) {
  return (
    <Link href={`/marketplace/${artwork.slug}`} className="group block art-card-reveal">
      <div className="bg-surface-container-low p-4">
        <div className="relative overflow-hidden aspect-[4/5]">
          {artwork.images[0] ? (
            <Image
              src={artwork.images[0]}
              alt={artwork.title}
              fill
              className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-higher flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">image</span>
            </div>
          )}
          <span className={`absolute top-3 left-3 bg-background/90 px-3 py-1 text-label-sm uppercase tracking-widest ${statusColors[artwork.status]}`}>
            {statusLabels[artwork.status]}
          </span>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
      <div className="flex justify-between items-start mt-4 px-1">
        <div className="space-y-1">
          <h3 className="text-headline-md text-on-surface group-hover:text-primary transition-colors">
            {artwork.title}
          </h3>
          <p className="text-body-md text-on-surface-variant italic">{artwork.artist.name}</p>
          {artwork.isVerified && <BadgeVerified />}
        </div>
        <p className="text-headline-md text-primary whitespace-nowrap">
          NPR {artwork.priceNpr.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
