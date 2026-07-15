/**
 * Supported display currencies.
 *
 * This app is single-currency per user: you earn and spend in one currency, so
 * choosing a currency re-labels every amount — it never converts stored values.
 *
 * EXTENSION POINT: adding a currency is a DATA change — append a row here and
 * it appears in Settings automatically. Nothing else needs to change.
 */
export type Currency = {
  /** ISO 4217 code. Persisted, so never change an existing value. */
  code: string;
  /** Display symbol, e.g. "৳". */
  symbol: string;
  /** Full name shown in the picker. */
  name: string;
};

export const CURRENCIES: readonly Currency[] = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
];

export const DEFAULT_CURRENCY_CODE = 'BDT';

export const DEFAULT_CURRENCY: Currency =
  CURRENCIES.find((currency) => currency.code === DEFAULT_CURRENCY_CODE) ?? CURRENCIES[0];

/**
 * Look up a currency by code, falling back to the default so a stale or
 * corrupt persisted code can never break formatting.
 */
export function getCurrency(code: string): Currency {
  return CURRENCIES.find((currency) => currency.code === code) ?? DEFAULT_CURRENCY;
}
