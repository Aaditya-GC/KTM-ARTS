import type { Artist } from "@/lib/db/schema";
import type { ArtistProfileInput } from "@/lib/validators/artist";

export type ArtistCardData = {
  slug: string;
  fullName: string;
  specialization?: string[];
  imageUrl?: string;
  experienceYears?: number;
};
export type { Artist, ArtistProfileInput };
