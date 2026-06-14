import { getCurrentUser } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <Sidebar user={{ fullName: user.fullName, role: user.role }} />
      <main className="flex-1 p-8 min-w-0">{children}</main>
    </div>
  );
}
