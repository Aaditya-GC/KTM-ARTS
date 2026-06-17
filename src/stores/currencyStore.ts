"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRENCIES } from "@/lib/currency";
import type { Currency } from "@/lib/currency";

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: CURRENCIES[0],
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "ka-currency",
    }
  )
);
