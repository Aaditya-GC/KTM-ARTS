"use client";

import { useCurrencyStore } from "@/stores/currencyStore";
import { formatPrice } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/currency";

/**
 * Primary hook for all price display in the app.
 *
 * Usage:
 *   const { currency, setCurrency, format } = useCurrency()
 *   <span>{format(artwork.priceNPR)}</span>
 */
export function useCurrency() {
  const { currency, setCurrency } = useCurrencyStore();

  return {
    currency,
    setCurrency,
    format: (amountInNPR: number) =>
      formatPrice(amountInNPR, currency.code as CurrencyCode),
  };
}
