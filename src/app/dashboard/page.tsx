export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  switch (user.role) {
    case "admin":
      redirect("/dashboard/admin/users");
    case "artist":
      redirect("/dashboard/artist");
    default:
      redirect("/dashboard/customer");
  }
}
