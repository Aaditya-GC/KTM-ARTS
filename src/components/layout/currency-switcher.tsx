"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrencyStore } from "@/stores/currencyStore";
import { CURRENCIES } from "@/lib/currency";
import NPFlag from "country-flag-icons/react/3x2/NP";
import USFlag from "country-flag-icons/react/3x2/US";
import EUFlag from "country-flag-icons/react/3x2/EU";
import GBFlag from "country-flag-icons/react/3x2/GB";
import JPFlag from "country-flag-icons/react/3x2/JP";
import AUFlag from "country-flag-icons/react/3x2/AU";
import CAFlag from "country-flag-icons/react/3x2/CA";
import CNFlag from "country-flag-icons/react/3x2/CN";
import INFlag from "country-flag-icons/react/3x2/IN";
import SGFlag from "country-flag-icons/react/3x2/SG";

const FLAG_COMPONENTS: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  NPR: NPFlag,
  USD: USFlag,
  EUR: EUFlag,
  GBP: GBFlag,
  JPY: JPFlag,
  AUD: AUFlag,
  CAD: CAFlag,
  CNY: CNFlag,
  INR: INFlag,
  SGD: SGFlag,
};

function flagStyle(size: number): React.CSSProperties {
  return {
    width: size,
    height: "auto",
    borderRadius: 2,
    border: "1px solid hsl(var(--border))",
    display: "block",
    flexShrink: 0,
  };
}

export function CurrencySwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const CurrentFlag = FLAG_COMPONENTS[currency.code];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-on-surface hover:text-accent transition-colors px-2 py-1 text-xs"
        aria-label="Switch currency"
      >
        <CurrentFlag style={flagStyle(20)} />
        <span className="hidden sm:inline uppercase tracking-widest font-medium">
          {currency.code}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-64 bg-background border border-outline shadow-lg py-1.5 z-50 max-h-80 overflow-y-auto"
          >
            {CURRENCIES.map((c) => {
              const selected = c.code === currency.code;
              const FlagComponent = FLAG_COMPONENTS[c.code];
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    selected
                      ? "bg-surface-dim text-primary"
                      : "text-on-surface hover:bg-surface-dim"
                  }`}
                >
                  <FlagComponent style={flagStyle(24)} />
                  <span className="text-label-sm uppercase tracking-widest font-semibold w-10">
                    {c.code}
                  </span>
                  <span className="text-body-md text-on-surface-variant flex-1">
                    {c.label}
                  </span>
                  {selected && (
                    <span className="material-symbols-outlined text-primary text-base">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
