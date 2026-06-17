"use client";

import { useCurrency } from "@/hooks/useCurrency";

interface PriceDisplayProps {
  priceNpr: number;
  className?: string;
}

export function PriceDisplay({ priceNpr, className }: PriceDisplayProps) {
  const { format } = useCurrency();
  return <span className={className}>{format(priceNpr)}</span>;
}
