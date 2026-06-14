"use server";

import { db } from "@/lib/db";
import { artworks, artworkCategories, creationSteps, certificates, profiles } from "@/lib/db/schema";
import { artworkSchema, creationStepSchema, type ArtworkInput, type CreationStepInput } from "@/lib/validators/artwork";
import { generateSlug } from "@/lib/utils/slug";
import { eq, and, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function verifyOwnership(artworkId: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
  const [artwork] = await db.select().from(artworks).where(eq(artworks.id, artworkId)).limit(1);
  if (!artwork) throw new Error("Artwork not found");
  if (artwork.artistId !== user.id && profile?.role !== "admin") throw new Error("Not authorized");

  return user.id;
}

export async function createArtwork(data: ArtworkInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const parsed = artworkSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existingSlugs = await db
    .select({ slug: artworks.slug })
    .from(artworks);

  const slug = generateSlug(parsed.data.title, existingSlugs.map(s => s.slug));

  const [artwork] = await db.insert(artworks).values({
    artistId: user.id,
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    deity: parsed.data.deity,
    style: parsed.data.style,
    medium: parsed.data.medium,
    materials: parsed.data.materials,
    dimensionsCm: parsed.data.dimensionsCm,
    priceNpr: parsed.data.priceNpr,
    priceUsd: parsed.data.priceUsd,
    yearCreated: parsed.data.yearCreated,
    images: [],
    status: parsed.data.status,
  }).returning();

  if (parsed.data.categories.length > 0) {
    await db.insert(artworkCategories).values(
      parsed.data.categories.map(category => ({
        artworkId: artwork.id,
        category,
      }))
    );
  }

  revalidatePath("/dashboard/artist/artworks");
  return { id: artwork.id, slug: artwork.slug };
}

export async function updateArtwork(id: string, data: Partial<ArtworkInput>) {
  await verifyOwnership(id);

  const parsed = artworkSchema.partial().safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.update(artworks)
    .set(parsed.data)
    .where(eq(artworks.id, id));

  revalidatePath(`/marketplace/${id}`);
  revalidatePath("/dashboard/artist/artworks");
}

export async function uploadArtworkImage(artworkId: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const fileName = `${artworkId}/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("artworks")
    .upload(fileName, file, { upsert: true });

  if (error) return { error: error.message };

  const { data: { publicUrl } } = supabase.storage
    .from("artworks")
    .getPublicUrl(fileName);

  const artwork = await db.select().from(artworks).where(eq(artworks.id, artworkId)).limit(1);
  if (artwork.length === 0) return { error: "Artwork not found" };

  const currentImages = artwork[0].images ?? [];
  await db.update(artworks)
    .set({ images: [...currentImages, publicUrl] })
    .where(eq(artworks.id, artworkId));

  revalidatePath(`/dashboard/artist/artworks/${artworkId}/edit`);
  return { url: publicUrl };
}

export async function addCreationStep(artworkId: string, data: CreationStepInput) {
  await verifyOwnership(artworkId);

  const parsed = creationStepSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.insert(creationSteps).values({
    artworkId,
    ...parsed.data,
  });

  revalidatePath(`/marketplace/${artworkId}`);
}

export async function generateCertificate(artworkId: string) {
  await verifyOwnership(artworkId);

  const year = new Date().getFullYear();

  const count = await db.select({ count: certificates.certificateNo })
    .from(certificates)
    .where(like(certificates.certificateNo, `KA-${year}-%`));

  const seq = String(count.length + 1).padStart(3, "0");
  const certificateNo = `KA-${year}-${seq}`;

  const [certificate] = await db.insert(certificates).values({
    artworkId,
    certificateNo,
    issuedDate: new Date().toISOString().split("T")[0],
  }).returning();

  await db.update(artworks)
    .set({ certificateId: certificate.id })
    .where(eq(artworks.id, artworkId));

  revalidatePath(`/marketplace/${artworkId}`);
  return certificate;
}

export async function publishArtwork(id: string) {
  await verifyOwnership(id);

  await db.update(artworks)
    .set({ status: "available" })
    .where(eq(artworks.id, id));

  revalidatePath("/dashboard/artist/artworks");
}

export async function deleteArtwork(id: string) {
  await verifyOwnership(id);

  await db.update(artworks)
    .set({ status: "draft" })
    .where(eq(artworks.id, id));

  revalidatePath("/dashboard/artist/artworks");
}

export async function saveCreationSteps(artworkId: string, steps: CreationStepInput[]) {
  await verifyOwnership(artworkId);

  await db.delete(creationSteps).where(eq(creationSteps.artworkId, artworkId));

  if (steps.length > 0) {
    await db.insert(creationSteps).values(
      steps.map((step) => ({ artworkId, ...step }))
    );
  }

  revalidatePath(`/dashboard/artist/artworks/${artworkId}/edit`);
  revalidatePath(`/marketplace/${artworkId}`);
}

export async function removeArtworkImage(artworkId: string, imageUrl: string) {
  await verifyOwnership(artworkId);

  const artwork = await db.select().from(artworks).where(eq(artworks.id, artworkId)).limit(1);
  const currentImages = artwork[0].images ?? [];
  await db.update(artworks)
    .set({ images: currentImages.filter((url) => url !== imageUrl) })
    .where(eq(artworks.id, artworkId));

  const supabase = await createClient();
  try {
    const path = imageUrl.split("/").pop();
    if (path) await supabase.storage.from("artworks").remove([path]);
  } catch {}

  revalidatePath(`/dashboard/artist/artworks/${artworkId}/edit`);
}
