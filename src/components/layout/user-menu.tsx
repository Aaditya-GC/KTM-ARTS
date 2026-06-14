import Link from "next/link";

interface UserMenuProps {
  user: { fullName: string; role: string } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  if (user && user.role !== "client") {
    return (
      <Link
        href="/dashboard"
        className="text-label-sm uppercase tracking-widest text-primary font-bold hover:opacity-80 transition-opacity border border-primary/40 px-3 py-1.5 rounded-full"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link href={user ? "/dashboard" : "/login"} className="text-on-surface-variant hover:text-primary transition-colors">
      <span className="material-symbols-outlined">account_circle</span>
    </Link>
  );
}
