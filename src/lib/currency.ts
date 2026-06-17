export type CurrencyCode =
  | "NPR"
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD"
  | "CNY"
  | "INR"
  | "SGD";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  decimals: number;
}

export const CURRENCIES: Currency[] = [
  { code: "NPR", symbol: "₨",  label: "Nepalese Rupee",    flag: "🇳🇵", decimals: 0 },
  { code: "USD", symbol: "$",   label: "US Dollar",         flag: "🇺🇸", decimals: 2 },
  { code: "EUR", symbol: "€",   label: "Euro",              flag: "🇪🇺", decimals: 2 },
  { code: "GBP", symbol: "£",   label: "British Pound",     flag: "🇬🇧", decimals: 2 },
  { code: "JPY", symbol: "¥",   label: "Japanese Yen",      flag: "🇯🇵", decimals: 0 },
  { code: "AUD", symbol: "A$",  label: "Australian Dollar", flag: "🇦🇺", decimals: 2 },
  { code: "CAD", symbol: "C$",  label: "Canadian Dollar",   flag: "🇨🇦", decimals: 2 },
  { code: "CNY", symbol: "¥",   label: "Chinese Yuan",      flag: "🇨🇳", decimals: 2 },
  { code: "INR", symbol: "₹",   label: "Indian Rupee",      flag: "🇮🇳", decimals: 2 },
  { code: "SGD", symbol: "S$",  label: "Singapore Dollar",  flag: "🇸🇬", decimals: 2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATIC EXCHANGE RATES — base currency: NPR
// Last updated: June 2026
// TODO: replace with a live rates API (e.g. Open Exchange Rates, Fixer.io)
//       by fetching into a Server Action and caching with next: { revalidate: 3600 }
// ─────────────────────────────────────────────────────────────────────────────
export const NPR_TO: Record<CurrencyCode, number> = {
  NPR: 1,
  USD: 0.0075,   // 1 NPR ≈ 0.0075 USD
  EUR: 0.0069,   // 1 NPR ≈ 0.0069 EUR
  GBP: 0.0059,   // 1 NPR ≈ 0.0059 GBP
  JPY: 1.12,     // 1 NPR ≈ 1.12 JPY
  AUD: 0.0116,   // 1 NPR ≈ 0.0116 AUD
  CAD: 0.0103,   // 1 NPR ≈ 0.0103 CAD
  CNY: 0.054,    // 1 NPR ≈ 0.054 CNY
  INR: 0.63,     // 1 NPR ≈ 0.63 INR
  SGD: 0.010,    // 1 NPR ≈ 0.010 SGD
};

/**
 * Converts a NPR base price to the target currency and returns
 * a formatted string with the correct symbol and decimal places.
 *
 * All prices in the database are stored in NPR.
 * This is display-only — payment processing ignores this value.
 *
 * @example
 *   formatPrice(15000, "USD")  →  "$112.50"
 *   formatPrice(15000, "JPY")  →  "¥16,800"
 *   formatPrice(15000, "NPR")  →  "₨15,000"
 */
export function formatPrice(
  amountInNPR: number,
  currencyCode: CurrencyCode
): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  if (!currency) return `₨${amountInNPR.toLocaleString()}`;

  const rate = NPR_TO[currencyCode];
  const converted = amountInNPR * rate;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(converted);

  return `${currency.symbol}${formatted}`;
}
