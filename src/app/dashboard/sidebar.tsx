"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { enableUserView } from "@/lib/auth/view-mode";
import { signOut } from "@/lib/auth/actions";

const sidebarLinks = [
  { href: "/dashboard/admin/users", label: "Users", role: "admin" },
  { href: "/dashboard/admin/artists", label: "Artists", role: "admin" },
  { href: "/dashboard/admin/artworks", label: "Artworks", role: "admin" },
  { href: "/dashboard/artist", label: "Overview", role: "artist" },
  { href: "/dashboard/artist/artworks", label: "My Artworks", role: "artist" },
  { href: "/dashboard/artist/profile", label: "Profile", role: "artist" },
  { href: "/dashboard/artist/orders", label: "Orders", role: "artist" },
  { href: "/dashboard/customer", label: "Overview", role: "client" },
  { href: "/dashboard/customer/orders", label: "Orders", role: "client" },
  { href: "/dashboard/customer/wishlist", label: "Wishlist", role: "client" },
  { href: "/dashboard/customer/settings", label: "Settings", role: "client" },
];

const roleLabels = { admin: "Admin", artist: "Artist", client: "Client" } as const;

interface SidebarProps {
  user: { fullName: string; role: "admin" | "artist" | "client" };
}

function ActiveLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      prefetch={false}
      className={`block text-label-sm uppercase tracking-widest py-2 px-3 rounded-sm transition-colors ${
        isActive
          ? "text-accent bg-accent/10 border-l-2 border-accent"
          : "text-on-surface-variant hover:text-accent hover:bg-surface-container-low"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Sidebar({ user }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const allowedLinks = sidebarLinks.filter(
    (link) => link.role === user.role || user.role === "admin"
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden min-w-[44px] min-h-[44px] bg-surface border border-outline rounded-sm flex items-center justify-center shadow-sm"
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
      </button>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    <aside
      className={`w-64 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col shrink-0 ${
        mobileOpen ? "fixed inset-y-0 left-0 z-40" : "hidden md:flex"
      }`}
    >
      <div className="p-6 border-b border-outline-variant/20">
        <Link href="/" prefetch={false} className="font-headline-md text-primary tracking-widest uppercase block mb-1">
          KA
        </Link>
        <p className="text-body-md text-on-surface truncate">{user.fullName}</p>
        <span className="inline-block mt-1 text-label-sm uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-sm">
          {roleLabels[user.role]}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {allowedLinks.map((link) => (
          <ActiveLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant/20 space-y-2">
        {user.role !== "client" && (
          <form action={enableUserView}>
            <button
              type="submit"
              className="w-full text-left text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-accent transition-colors flex items-center gap-2 py-2 px-3"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              View as Client
            </button>
          </form>
        )}
        <Link
          href="/"
          prefetch={false}
          className="block text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-accent transition-colors py-2 px-3"
        >
          Back to Site
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full text-left text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors flex items-center gap-2 py-2 px-3"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
    </>
  );
}
