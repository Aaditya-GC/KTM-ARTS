"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sortOptions = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";
  const currentLabel = sortOptions.find((o) => o.value === current)?.label ?? "Newest";

  function handleChange(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`/marketplace?${params.toString()}`);
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] bg-surface-container-low border-outline-variant text-on-surface">
        <SelectValue placeholder="Sort by">{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-surface-container border-outline-variant">
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-on-surface">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
