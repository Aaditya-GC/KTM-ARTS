"use server";

import { db } from "@/lib/db";
import { artists, profiles } from "@/lib/db/schema";
import { artistProfileSchema, type ArtistProfileInput } from "@/lib/validators/artist";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils/slug";

export async function createArtistProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
  const slug = generateSlug(profile?.fullName ?? "artist");

  const parsed = artistProfileSchema.safeParse({
    slug,
    bio: formData.get("bio") || "",
    lineage: formData.get("lineage"),
    specialization: (() => { try { const raw = formData.get("specialization") as string; return raw ? JSON.parse(raw) : []; } catch { return []; } })(),
    experienceYears: formData.get("experienceYears") ? Number(formData.get("experienceYears")) : undefined,
    location: formData.get("location"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.insert(artists).values({
    id: user.id,
    ...parsed.data,
  });

  revalidatePath("/artists");
  redirect("/dashboard/artist");
}

export async function updateArtistProfile(artistId: string, data: ArtistProfileInput) {
  const parsed = artistProfileSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.update(artists)
    .set(parsed.data)
    .where(eq(artists.id, artistId));

  revalidatePath(`/artists/${parsed.data.slug}`);
  revalidatePath("/dashboard/artist/profile");
}

export async function upgradeToArtist(userId: string) {
  const existing = await db.select().from(artists).where(eq(artists.id, userId)).limit(1);

  if (existing.length === 0) {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    const slug = generateSlug(profile.fullName);

    await db.insert(artists).values({
      id: userId,
      slug,
      bio: "",
      specialization: [],
      isVerified: false,
    });
  }

  await db.update(profiles)
    .set({ role: "artist" })
    .where(eq(profiles.id, userId));

  revalidatePath("/dashboard/admin/users");
}

export async function uploadArtistImage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("artists")
    .upload(fileName, file, { upsert: true });

  if (error) return { error: error.message };

  const { data: { publicUrl } } = supabase.storage
    .from("artists")
    .getPublicUrl(fileName);

  const artist = await db.select().from(artists).where(eq(artists.id, user.id)).limit(1);
  const currentImages = artist[0]?.studioImages ?? [];
  await db.update(artists)
    .set({ studioImages: [...currentImages, publicUrl] })
    .where(eq(artists.id, user.id));

  revalidatePath("/dashboard/artist/profile");
  return { url: publicUrl };
}
