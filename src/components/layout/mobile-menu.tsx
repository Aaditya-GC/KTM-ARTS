"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/artists", label: "Artists" },
  { href: "/commissions", label: "Commissions" },
  { href: "/knowledge-hub", label: "Knowledge Hub" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-on-surface min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed left-0 right-0 top-[calc(36px+var(--navbar-height,64px))] z-40 bg-background border-b border-outline md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-margin-mobile py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-label-sm uppercase tracking-widest text-on-surface hover:text-accent transition-colors min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
