import Image from "next/image";
import Link from "next/link";

interface ArtistCardProps {
  artist: {
    slug: string;
    fullName: string;
    specialization?: string[];
    imageUrl?: string | null;
    experienceYears?: number | null;
  };
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <div className="aspect-[3/4] bg-surface-container-low overflow-hidden relative">
        <div className="w-full h-full bg-surface-container-higher flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
          {artist.imageUrl ? (
            <Image
              src={artist.imageUrl}
              alt={artist.fullName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">person</span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
          <span className="text-label-sm uppercase tracking-widest text-primary">
            {artist.specialization?.[0] ?? "Artist"}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-headline-md text-on-surface group-hover:text-primary transition-colors">
          {artist.fullName}
        </h3>
        <p className="text-label-sm uppercase text-on-surface-variant tracking-widest mt-1">
          {artist.experienceYears ? `${artist.experienceYears}+ years` : "Artist"}
        </p>
      </div>
    </Link>
  );
}
