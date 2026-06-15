import type { Artwork, Certificate, CreationStep } from "@/lib/db/schema";
import type { ArtworkInput, CreationStepInput } from "@/lib/validators/artwork";

export type ArtworkStatus = "available" | "sold" | "reserved" | "draft";
export type ArtworkCardData = {
  slug: string;
  title: string;
  images: string[];
  priceNpr: number;
  priceUsd?: number | null;
  status: ArtworkStatus;
  isVerified: boolean;
  artist: { name: string; slug: string };
};
export type { Artwork, Certificate, CreationStep, ArtworkInput, CreationStepInput };
