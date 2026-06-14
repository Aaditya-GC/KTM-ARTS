import { ArtistCard } from "@/components/artist/artist-card";

interface ArtistGridProps {
  artists: Array<{
    slug: string;
    fullName: string;
    specialization?: string[];
    imageUrl?: string | null;
    experienceYears?: number | null;
  }>;
}

export function ArtistGrid({ artists }: ArtistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
      {artists.map((artist) => (
        <ArtistCard key={artist.slug} artist={artist} />
      ))}
    </div>
  );
}
