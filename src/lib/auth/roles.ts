import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/db/schema";

export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ?? null;
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
