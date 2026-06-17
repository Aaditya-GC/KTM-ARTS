"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/shared/price-display";
import { searchArtworks, type SearchResult } from "@/lib/search-actions";
import { Skeleton } from "@/components/ui/skeleton";

const POPULAR_SEARCHES = ["Buddha", "Mandala", "Tara", "Avalokiteshvara", "Green Tara", "Tibetan"];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await searchArtworks(q);
      setResults(res);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(query);
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, handleSearch]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [open, onClose]);

  const handlePopularClick = (term: string) => {
    setQuery(term);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    handleSearch(query);
  };

  return (
    <AnimatePresence>
      {open && (
          <motion.div
            ref={modalRef}
            className="fixed inset-0 z-[100] flex items-start justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search artworks"
          >
            <motion.div
            ref={panelRef}
            className="w-full md:max-w-xl md:mx-auto md:mt-24"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
              <div className="bg-surface border border-outline-variant/20 shadow-xl">
              <div className="px-5 pt-5 pb-4">
                <form onSubmit={handleSubmit} className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-xl pointer-events-none">
                    search
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search artworks, deities, styles..."
                    className="w-full h-10 pl-10 pr-10 bg-surface-dim border border-outline rounded-sm text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-accent transition-colors"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  )}
                </form>

                {!hasSearched && !query.trim() && (
                  <div className="mt-4">
                    <p className="text-label-sm text-on-surface-variant/50 mb-2.5">
                      Popular searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handlePopularClick(term)}
                          className="px-3 py-1.5 bg-surface-dim border border-outline/30 text-label-sm text-accent hover:text-accent hover:border-accent/60 transition-colors rounded-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {loading && (
                <div className="border-t border-outline-variant/10 px-5 py-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 shrink-0 rounded-sm" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-3/5" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && hasSearched && results.length === 0 && (
                <div className="border-t border-outline-variant/10 px-5 py-8 text-center">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant/20 block mb-2">
                    search_off
                  </span>
                  <p className="text-body-md text-on-surface-variant/60">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="border-t border-outline-variant/10 max-h-[40vh] overflow-y-auto custom-scrollbar">
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      href={`/marketplace/${item.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-surface-dim transition-colors group"
                    >
                      <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-sm bg-surface-container-higher">
                        {item.images[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-base text-on-surface-variant/20">
                              image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-md text-on-surface group-hover:text-accent transition-colors truncate leading-snug">
                          {item.title}
                        </p>
                        {item.artistName && (
                          <p className="text-label-sm text-on-surface-variant/50 mt-0.5">
                            {item.artistName}
                          </p>
                        )}
                      </div>
                      <p className="text-label-sm text-primary whitespace-nowrap tabular-nums">
                        <PriceDisplay priceNpr={item.priceNpr} />
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
