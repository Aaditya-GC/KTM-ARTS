import { db } from "@/lib/db";
import { artworks, orderItems, orders, artists } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/roles";
import { eq, and, desc, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoldButton } from "@/components/shared/gold-button";

export default async function ArtistDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.id, user.id))
    .limit(1);

  if (!artist) redirect("/dashboard");

  const artistArtworks = await db
    .select()
    .from(artworks)
    .where(eq(artworks.artistId, user.id))
    .orderBy(desc(artworks.createdAt));

  const totalArtworks = artistArtworks.length;
  const published = artistArtworks.filter((a) => a.status === "available").length;
  const drafts = artistArtworks.filter((a) => a.status === "draft").length;

  const [revenueResult] = await db
    .select({ total: sql<number>`COALESCE(SUM(${orderItems.priceNpr}), 0)` })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(artworks, eq(orderItems.artworkId, artworks.id))
    .where(and(
      eq(artworks.artistId, user.id),
      eq(orders.status, "paid")
    ));

  const totalRevenue = Number(revenueResult?.total ?? 0);

  return (
    <div>
      <h1 className="text-headline-md text-on-surface mb-8">
        Welcome{artist.bio ? `, ${user.fullName}` : ""}
      </h1>

      {totalArtworks === 0 ? (
        <div className="text-center py-20 bg-surface-container-low border border-outline-variant rounded-sm">
          <span className="material-symbols-outlined text-6xl text-primary/30">palette</span>
          <h2 className="text-headline-md text-on-surface mt-4">Welcome to Your Studio</h2>
          <p className="text-body-lg text-on-surface-variant mt-2 max-w-md mx-auto">
            Start sharing your art with the world. Upload your first artwork to appear in the marketplace.
          </p>
          <Link href="/dashboard/artist/artworks/new">
            <GoldButton className="mt-6">Create Your First Artwork</GoldButton>
          </Link>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-sm">
              <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">Total Artworks</p>
              <p className="text-headline-lg text-on-surface mt-1">{totalArtworks}</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-sm">
              <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">Published</p>
              <p className="text-headline-lg text-primary mt-1">{published}</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-sm">
              <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">Drafts</p>
              <p className="text-headline-lg text-on-surface mt-1">{drafts}</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-sm">
              <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">Revenue</p>
              <p className="text-headline-lg text-primary mt-1">NPR {totalRevenue.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-4 mb-10">
            <Link href="/dashboard/artist/artworks/new">
              <GoldButton>Add New Artwork</GoldButton>
            </Link>
            <Link href="/dashboard/artist/profile">
              <button className="px-6 py-3 border border-primary/40 text-primary text-label-sm uppercase tracking-widest rounded-full hover:bg-primary/10 transition-colors">
                Edit Profile
              </button>
            </Link>
            <Link href={`/artists/${artist.slug}`}>
              <button className="px-6 py-3 border border-outline-variant text-on-surface-variant text-label-sm uppercase tracking-widest rounded-full hover:border-primary hover:text-accent transition-colors">
                View Public Profile
              </button>
            </Link>
          </div>

          {/* Recent artworks */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Recent Artworks</h2>
              <Link href="/dashboard/artist/artworks" className="text-label-sm text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {artistArtworks.slice(0, 5).map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/dashboard/artist/artworks/${artwork.id}/edit`}
                  className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-sm hover:bg-surface-container transition-colors"
                >
                  <div className="w-14 h-14 shrink-0 bg-surface-container-higher rounded-sm overflow-hidden">
                    {artwork.images && artwork.images[0] ? (
                      <img src={artwork.images[0]} alt={artwork.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                        <span className="material-symbols-outlined text-xl">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md text-on-surface truncate">{artwork.title}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      {artwork.status === "available" ? "Published" : "Draft"} &middot; NPR {artwork.priceNpr.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
