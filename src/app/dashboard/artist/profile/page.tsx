import { db } from "@/lib/db";
import { artists } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/roles";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "./profile-edit-form";

export default async function ArtistProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.id, user.id))
    .limit(1);

  if (!artist) redirect("/dashboard");

  return <ProfileEditForm artist={artist} />;
}
