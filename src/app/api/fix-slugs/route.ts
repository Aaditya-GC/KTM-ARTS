import { db } from "@/lib/db";
import { artworks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db
    .select({ id: artworks.id, title: artworks.title, slug: artworks.slug })
    .from(artworks);

  const updates: { id: string; oldSlug: string; newSlug: string }[] = [];

  for (const artwork of all) {
    const expected = generateSlug(artwork.title, []);
    if (artwork.slug !== expected) {
      let newSlug = generateSlug(artwork.title, all.map(a => a.slug));
      await db.update(artworks).set({ slug: newSlug }).where(eq(artworks.id, artwork.id));
      updates.push({ id: artwork.id, oldSlug: artwork.slug, newSlug });
    }
  }

  return NextResponse.json({ fixed: updates.length, updates });
}
