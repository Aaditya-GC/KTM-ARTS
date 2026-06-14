import { db } from "@/lib/db";
import { artists, profiles } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function AdminArtistsPage() {
  const artistList = await db
    .select()
    .from(artists)
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .orderBy(artists.createdAt);

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">Artist Approvals</h1>

      <div className="bg-surface-container-low rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant/20 text-label-sm uppercase tracking-widest text-on-surface-variant">
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">Specialization</th>
              <th className="p-4 font-normal">Experience</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artistList.map(({ artists: artist, profiles: profile }) => (
              <tr key={artist.id} className="border-b border-outline-variant/10">
                <td className="p-4 text-body-md text-on-surface">{profile.fullName}</td>
                <td className="p-4 text-body-md text-on-surface-variant">
                  {artist.specialization?.join(", ") ?? "—"}
                </td>
                <td className="p-4 text-body-md text-on-surface-variant">
                  {artist.experienceYears ? `${artist.experienceYears}y` : "—"}
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest border rounded-sm ${
                    artist.isFeatured ? "text-primary border-primary/40" :
                    artist.isVerified ? "text-secondary border-secondary/40" :
                    "text-on-surface-variant border-outline-variant/40"
                  }`}>
                    {artist.isFeatured ? "Featured" : artist.isVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="p-4 space-x-4">
                  {!artist.isVerified && (
                    <form className="inline">
                      <button
                        formAction={async () => {
                          "use server";
                          await db.update(artists).set({ isVerified: true }).where(eq(artists.id, artist.id));
                          revalidatePath("/dashboard/admin/artists");
                        }}
                        className="text-label-sm uppercase tracking-widest text-primary hover:underline"
                      >
                        Verify
                      </button>
                    </form>
                  )}
                  {!artist.isFeatured && (
                    <form className="inline">
                      <button
                        formAction={async () => {
                          "use server";
                          await db.update(artists).set({ isFeatured: true }).where(eq(artists.id, artist.id));
                          revalidatePath("/dashboard/admin/artists");
                        }}
                        className="text-label-sm uppercase tracking-widest text-secondary hover:underline"
                      >
                        Feature
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
