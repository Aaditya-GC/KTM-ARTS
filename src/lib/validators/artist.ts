import { z } from "zod";

export const artistProfileSchema = z.object({
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  bio: z.string().min(10).max(2000),
  lineage: z.string().max(500).optional(),
  specialization: z.array(z.string()).min(1).max(5),
  experienceYears: z.number().int().min(0).max(80).optional(),
  location: z.string().max(100).optional(),
  awards: z.array(z.object({ title: z.string(), year: z.number() })).optional(),
});

export type ArtistProfileInput = z.infer<typeof artistProfileSchema>;
