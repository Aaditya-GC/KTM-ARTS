"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [value, setValue] = useState(initialQ);
  const userTyped = useRef(false);

  useEffect(() => {
    if (!userTyped.current) return;
    userTyped.current = false;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`/marketplace?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    userTyped.current = true;
    setValue(e.target.value);
  }

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
        <span className="material-symbols-outlined">search</span>
      </span>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Search artworks, deities, artists..."
        className="pl-12 bg-surface-container-low border-outline-variant text-on-surface h-12 rounded-full"
      />
    </div>
  );
}
