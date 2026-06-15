import { ArtCard } from "@/components/art/art-card";

interface ArtGridProps {
  artworks: Array<{
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
  }>;
  wishlistIds?: Set<string>;
}

export function ArtGrid({ artworks, wishlistIds }: ArtGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-stretch">
      {artworks.map((artwork) => (
        <div key={artwork.slug} className="flex flex-col">
          <ArtCard
            artwork={artwork}
            inWishlist={artwork.id ? wishlistIds?.has(artwork.id) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
