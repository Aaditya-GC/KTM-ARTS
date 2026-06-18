"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { signOut } from "@/lib/auth/actions";

interface UserMenuProps {
  user: { fullName: string; role: string } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link href="/login" className="text-on-surface hover:text-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
        <span className="material-symbols-outlined">account_circle</span>
      </Link>
    );
  }

  const displayName = user.fullName.split(" ")[0].slice(0, 12);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-on-surface hover:text-accent transition-colors min-w-[44px] min-h-[44px] flex items-center gap-1.5 px-2"
      >
        <span className="material-symbols-outlined">account_circle</span>
        <span className="text-label-sm hidden sm:inline">{displayName}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-high border border-outline-variant/20 rounded-sm shadow-lg z-50 py-1">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-on-surface-variant hover:text-accent hover:bg-surface-container-low transition-colors"
          >
            Dashboard
          </Link>
          <form
            action={async () => {
              setOpen(false);
              await signOut();
            }}
          >
            <button
              type="submit"
              className="w-full text-left px-4 py-2 text-sm text-on-surface-variant hover:text-error hover:bg-surface-container-low transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
