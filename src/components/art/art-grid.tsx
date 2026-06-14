import { ArtCard } from "@/components/art/art-card";

interface ArtGridProps {
  artworks: Array<{
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
}

export function ArtGrid({ artworks }: ArtGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-20">
      {artworks.map((artwork) => (
        <ArtCard key={artwork.slug} artwork={artwork} />
      ))}
    </div>
  );
}
