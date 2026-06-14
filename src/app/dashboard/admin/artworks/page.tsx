import { db } from "@/lib/db";
import { artworks, artists, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const statusColors: Record<string, string> = {
  available: "text-primary border-primary/40",
  sold: "text-error border-error/40",
  reserved: "text-secondary border-secondary/40",
  draft: "text-on-surface-variant border-outline-variant/40",
};

export default async function AdminArtworksPage() {
  const artworkList = await db
    .select()
    .from(artworks)
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .orderBy(artworks.createdAt);

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">Artwork Moderation</h1>

      <div className="bg-surface-container-low rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant/20 text-label-sm uppercase tracking-widest text-on-surface-variant">
              <th className="p-4 font-normal">Artwork</th>
              <th className="p-4 font-normal">Artist</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Verified</th>
              <th className="p-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworkList.map(({ artworks: artwork, profiles: profile }) => (
              <tr key={artwork.id} className="border-b border-outline-variant/10">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface rounded-sm overflow-hidden shrink-0">
                      {artwork.images[0] ? (
                        <img src={artwork.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant/30">image</span>
                        </div>
                      )}
                    </div>
                    <span className="text-body-md text-on-surface">{artwork.title}</span>
                  </div>
                </td>
                <td className="p-4 text-body-md text-on-surface-variant">{profile.fullName}</td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest border rounded-sm ${statusColors[artwork.status] ?? ""}`}>
                    {artwork.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`material-symbols-outlined ${artwork.isVerified ? "text-primary" : "text-on-surface-variant/30"}`}>
                    {artwork.isVerified ? "verified" : "radio_button_unchecked"}
                  </span>
                </td>
                <td className="p-4 space-x-4">
                  {!artwork.isVerified && (
                    <form className="inline">
                      <button
                        formAction={async () => {
                          "use server";
                          await db.update(artworks).set({ isVerified: true }).where(eq(artworks.id, artwork.id));
                          revalidatePath("/dashboard/admin/artworks");
                        }}
                        className="text-label-sm uppercase tracking-widest text-primary hover:underline"
                      >
                        Verify
                      </button>
                    </form>
                  )}
                  <form className="inline">
                    <button
                      formAction={async () => {
                        "use server";
                        await db.update(artworks).set({ status: "draft" }).where(eq(artworks.id, artwork.id));
                        revalidatePath("/dashboard/admin/artworks");
                      }}
                      className="text-label-sm uppercase tracking-widest text-error hover:underline"
                    >
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
