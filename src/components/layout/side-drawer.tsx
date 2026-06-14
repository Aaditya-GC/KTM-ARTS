"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/artists", label: "Artists" },
  { href: "/commissions", label: "Commissions" },
  { href: "/knowledge-hub", label: "Knowledge Hub" },
  { href: "/login", label: "Account" },
];

export function SideDrawer({ open, onClose }: SideDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full md:w-96 bg-[#F5F1E8] transform transition-transform duration-500 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-end p-6">
          <button onClick={onClose} className="text-[#2A2018]">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <nav className="px-12 space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block font-headline-lg text-[#2A2018] text-3xl hover:italic transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-[#2A2018]/60 text-label-sm uppercase tracking-widest">
            Inquiries
          </p>
          <a
            href="mailto:hello@kathmanduarts.com"
            className="text-[#2A2018] text-body-md mt-1 block"
          >
            hello@kathmanduarts.com
          </a>
        </div>
      </div>
    </>
  );
}
