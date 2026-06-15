import type { Profile } from "@/lib/db/schema";

export type UserRole = "client" | "artist" | "admin";
export type SafeUser = Pick<Profile, "id" | "role" | "fullName" | "avatarUrl">;
export type { Profile };
