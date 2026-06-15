"use client";

import { useState, useCallback } from "react";
import { SearchModal } from "@/components/search/search-modal";

export function SearchButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-on-surface hover:text-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Open search"
      >
        <span className="material-symbols-outlined">search</span>
      </button>
      {open && <SearchModal open={open} onClose={handleClose} />}
    </>
  );
}
