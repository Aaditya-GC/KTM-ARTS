"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { marketplaceCategories } from "@/components/layout/marketplace-dropdown";

const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/artists", label: "Artists" },
  { href: "/commissions", label: "Commissions" },
  { href: "/knowledge-hub", label: "Knowledge Hub" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);

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
              {navLinks.map((link) =>
                link.href === "/marketplace" ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setMarketplaceOpen(!marketplaceOpen)}
                      className="flex items-center justify-between w-full py-3 text-label-sm uppercase tracking-widest text-on-surface hover:text-accent transition-colors min-h-[44px]"
                    >
                      {link.label}
                      <motion.span
                        animate={{ rotate: marketplaceOpen ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-[10px]"
                      >
                        ▾
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {marketplaceOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pb-2 space-y-0.5">
                            {marketplaceCategories.map((cat) => (
                              <Link
                                key={cat.href}
                                href={cat.href}
                                onClick={() => setOpen(false)}
                                className="block py-2.5 text-sm text-on-surface hover:text-accent transition-colors"
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-label-sm uppercase tracking-widest text-on-surface hover:text-accent transition-colors min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
