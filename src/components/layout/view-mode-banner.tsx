import { getCurrentUser } from "@/lib/auth/roles";
import { getViewMode } from "@/lib/auth/view-mode";
import { disableUserView } from "@/lib/auth/view-mode";
import Link from "next/link";

export async function ViewModeBanner() {
  const user = await getCurrentUser();
  const viewingAsClient = await getViewMode();

  if (!user || !viewingAsClient) return null;
  if (user.role === "client") return null;

  return (
    <div className="bg-primary/95 text-on-primary px-4 py-2 text-center text-label-sm uppercase tracking-widest font-bold flex items-center justify-center gap-4">
      Viewing site as Client
      <form action={disableUserView}>
        <button type="submit" className="underline hover:opacity-80 transition-opacity">
          Switch to Dashboard
        </button>
      </form>
    </div>
  );
}
