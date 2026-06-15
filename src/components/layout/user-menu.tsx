import Link from "next/link";

interface UserMenuProps {
  user: { fullName: string; role: string } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  if (user && user.role !== "client") {
    return (
      <Link
        href="/dashboard"
        className="text-label-sm uppercase tracking-widest text-accent font-bold hover:opacity-80 transition-opacity border border-accent/40 px-3 py-1.5 rounded-sm"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link href={user ? "/dashboard" : "/login"} className="text-on-surface hover:text-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
      <span className="material-symbols-outlined">account_circle</span>
    </Link>
  );
}
