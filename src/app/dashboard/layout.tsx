import { getCurrentUser } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex md:pt-0">
      <Sidebar user={{ fullName: user.fullName, role: user.role }} />
      <main className="flex-1 p-4 md:p-8 min-w-0 pt-16 md:pt-8">{children}</main>
    </div>
  );
}
