"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  className?: string;
}

const subjects = ["Mandala", "Deities", "Life of Buddha", "Landscape", "Abstract"];
const sizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "Grand", value: "grand" },
];

export function FilterSidebar({ className }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMin = Number(searchParams.get("price_min")) || 0;
  const initialMax = Number(searchParams.get("price_max")) || 500000;
  const [priceRange, setPriceRange] = useState([initialMin, initialMax]);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);

    if (current.includes(value)) {
      params.delete(key);
      current.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }
    params.set("page", "1");
    router.push(`/marketplace?${params.toString()}`);
  }

  function applyPriceFilter(value: number | readonly number[]) {
    const values = Array.isArray(value) ? value : [value, value];
    const params = new URLSearchParams(searchParams.toString());
    if (values[0] > 0) params.set("price_min", String(values[0]));
    else params.delete("price_min");
    if (values[1] < 500000) params.set("price_max", String(values[1]));
    else params.delete("price_max");
    params.set("page", "1");
    router.push(`/marketplace?${params.toString()}`);
  }

  const selectedSubjects = searchParams.getAll("deity");

  return (
    <aside className={className}>
      <h3 className="text-label-sm uppercase tracking-widest text-primary font-bold mb-6">Filters</h3>

      <div className="space-y-8">
        <div>
          <h4 className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-4">Subject</h4>
          <div className="space-y-3">
            {subjects.map((subject) => (
              <div key={subject} className="flex items-center gap-3">
                <Checkbox
                  id={`subject-${subject}`}
                  checked={selectedSubjects.includes(subject.toLowerCase())}
                  onCheckedChange={() => updateFilter("deity", subject.toLowerCase())}
                  className="border-outline-variant accent-primary"
                />
                <Label htmlFor={`subject-${subject}`} className="text-body-md text-on-surface-variant">
                  {subject}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-4">Size</h4>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <button
                key={size.value}
                onClick={() => updateFilter("size", size.value)}
                className="px-3 py-2 border border-outline-variant text-label-sm uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-accent transition-colors rounded-sm"
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-4">Price Range (NPR)</h4>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as number[])}
            onValueCommitted={applyPriceFilter}
            max={500000}
            step={10000}
            className="accent-primary"
          />
          <div className="flex items-center gap-2 mt-3">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange([val, priceRange[1]]);
              }}
              onBlur={() => applyPriceFilter(priceRange)}
              className="w-24 bg-surface border border-outline-variant text-on-surface text-label-sm p-1.5 rounded-sm"
            />
            <span className="text-on-surface-variant">—</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange([priceRange[0], val]);
              }}
              onBlur={() => applyPriceFilter(priceRange)}
              className="w-24 bg-surface border border-outline-variant text-on-surface text-label-sm p-1.5 rounded-sm"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
