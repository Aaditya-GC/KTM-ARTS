"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/marketplace?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 text-on-surface-variant hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">west</span>
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="text-on-surface-variant px-2">...</span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={cn(
              "w-10 h-10 rounded-sm text-label-sm font-bold transition-colors",
              page === currentPage
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-accent"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 text-on-surface-variant hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">east</span>
      </button>
    </div>
  );
}
