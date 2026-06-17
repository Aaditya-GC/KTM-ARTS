"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const marketplaceCategories = [
  { label: "Entire Collection", href: "/marketplace", category: undefined, description: "Browse all available artworks" },
  { label: "Thangka Paintings", href: "/marketplace?category=thangka", category: "thangka", description: "Traditional sacred paintings" },
  { label: "Mandalas", href: "/marketplace?category=mandala", category: "mandala", description: "Sacred geometric compositions" },
  { label: "Malas & Prayer Beads", href: "/marketplace?category=malas", category: "malas", description: "Handcrafted meditation beads" },
  { label: "Singing Bowls", href: "/marketplace?category=singing-bowls", category: "singing-bowls", description: "Himalayan singing bowls" },
  { label: "Statues & Crafts", href: "/marketplace?category=statues", category: "statues", description: "Hand-carved statues and crafts" },
];

export function MarketplaceDropdown() {
  return (
    <Suspense
      fallback={
        <button className="flex items-center gap-1.5 text-label-sm uppercase tracking-widest text-on-surface hover:text-accent transition-colors">
          Marketplace
          <span className="text-[10px] leading-none">▾</span>
        </button>
      }
    >
      <MarketplaceDropdownContent />
    </Suspense>
  );
}

function MarketplaceDropdownContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentCategory = searchParams.get("category");
  const isMarketplace = pathname === "/marketplace";

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 100);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1.5 text-label-sm uppercase tracking-widest text-on-surface hover:text-accent transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        Marketplace
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-[10px] leading-none"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-56 bg-background border border-outline shadow-lg py-1.5 z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {marketplaceCategories.map((cat) => {
              const isActive = isMarketplace && (
                cat.category === undefined
                  ? !currentCategory
                  : currentCategory === cat.category
              );
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2 border-l-2 transition-all ${
                    isActive
                      ? "border-l-2 border-primary bg-surface-dim"
                      : "border-l-2 border-transparent hover:border-primary hover:bg-surface-dim"
                  }`}
                >
                  <p className={`text-xs font-medium tracking-wide ${isActive ? "text-primary" : "text-on-surface"}`}>
                    {cat.label}
                  </p>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
