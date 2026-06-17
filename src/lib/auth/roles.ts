import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/db/schema";

function mapProfile(raw: Record<string, unknown>): Profile {
  return {
    id: raw.id as string,
    role: raw.role as Profile["role"],
    fullName: (raw.full_name as string) ?? "",
    avatarUrl: raw.avatar_url as string | null,
    phone: raw.phone as string | null,
    country: raw.country as string | null,
    createdAt: raw.created_at ? new Date(raw.created_at as string) : new Date(),
  };
}

export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ? mapProfile(profile) : null;
});

export async function requireRole(role: "client" | "artist" | "admin") {
  const profile = await getCurrentUser();
  if (!profile) throw new Error("Not authenticated");
  if (profile.role !== role && profile.role !== "admin") {
    throw new Error("Insufficient permissions");
  }
  return profile;
}

export function isAdmin(profile: Profile) { return profile.role === "admin"; }
export function isArtist(profile: Profile) { return profile.role === "artist" || profile.role === "admin"; }
