import { db } from "@/lib/db";
import { artworks, artworkCategories, creationSteps, certificates } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/roles";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { EditArtworkForm } from "./edit-artwork-form";

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const [artwork] = await db
    .select()
    .from(artworks)
    .where(eq(artworks.id, id))
    .limit(1);

  if (!artwork) redirect("/dashboard/artist/artworks");

  const categories = await db
    .select()
    .from(artworkCategories)
    .where(eq(artworkCategories.artworkId, id));

  const steps = await db
    .select()
    .from(creationSteps)
    .where(eq(creationSteps.artworkId, id))
    .orderBy(creationSteps.stepNumber);

  const [certificate] = await db
    .select()
    .from(certificates)
    .where(eq(certificates.artworkId, id))
    .limit(1);

  return (
    <EditArtworkForm
      artwork={artwork}
      categories={categories.map((c) => c.category)}
      steps={steps}
      certificate={certificate ?? null}
    />
  );
}
