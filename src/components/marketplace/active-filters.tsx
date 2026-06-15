"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: { key: string; value: string; label: string }[] = [];

  searchParams.forEach((value, key) => {
    if (key === "page" || key === "sort") return;
    filters.push({ key, value, label: `${key}: ${value}` });
  });

  function removeFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    current.filter((v) => v !== value).forEach((v) => params.append(key, v));
    router.push(`/marketplace?${params.toString()}`);
  }

  function clearAll() {
    router.push("/marketplace");
  }

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <span
          key={`${filter.key}-${filter.value}`}
          className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container text-label-sm uppercase tracking-widest text-on-surface-variant border border-outline-variant rounded-sm"
        >
          {filter.label}
          <button onClick={() => removeFilter(filter.key, filter.value)} className="hover:text-accent">
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      ))}
      <button
        onClick={clearAll}
        className="text-label-sm uppercase tracking-widest text-primary hover:underline ml-2"
      >
        Clear All
      </button>
    </div>
  );
}
