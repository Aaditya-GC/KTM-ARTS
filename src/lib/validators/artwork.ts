import { z } from "zod";

export const artworkSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(20).max(5000),
  deity: z.string().max(100).optional(),
  style: z.string().max(100).optional(),
  medium: z.string().max(200).optional(),
  materials: z.array(z.string()).optional(),
  dimensionsCm: z.object({ height: z.number(), width: z.number() }).optional(),
  priceNpr: z.number().int().min(1000),
  priceUsd: z.number().int().optional(),
  yearCreated: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  categories: z.array(z.string()).min(1),
  status: z.enum(["available", "draft"]).default("draft"),
});

export const creationStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  durationDays: z.number().int().min(1).optional(),
});

export type ArtworkInput = z.infer<typeof artworkSchema>;
export type CreationStepInput = z.infer<typeof creationStepSchema>;
