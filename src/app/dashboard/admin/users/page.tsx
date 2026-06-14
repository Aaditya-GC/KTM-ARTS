import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { upgradeToArtist } from "@/lib/auth/artist-actions";
import { revalidatePath } from "next/cache";

const roleColors: Record<string, string> = {
  admin: "text-primary border-primary/40",
  artist: "text-secondary border-secondary/40",
  client: "text-on-surface-variant border-outline-variant/40",
};

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(profiles).orderBy(profiles.createdAt);

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">User Management</h1>

      <div className="bg-surface-container-low rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant/20 text-label-sm uppercase tracking-widest text-on-surface-variant">
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">Role</th>
              <th className="p-4 font-normal">Joined</th>
              <th className="p-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="border-b border-outline-variant/10">
                <td className="p-4 text-body-md text-on-surface">{user.fullName}</td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest border rounded-sm ${roleColors[user.role] ?? roleColors.client}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-body-md text-on-surface-variant">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {user.role === "client" && (
                    <form>
                      <button
                        formAction={async () => {
                          "use server";
                          await upgradeToArtist(user.id);
                          revalidatePath("/dashboard/admin/users");
                        }}
                        className="text-label-sm uppercase tracking-widest text-primary hover:underline"
                      >
                        Make Artist
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
