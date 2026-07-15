import { useCallback } from 'react';

import { type Currency, getCurrency } from '@/constants/currencies';
import { useSettingsStore } from '@/store/settingsStore';
import { formatCurrency, type FormatCurrencyOptions } from '@/utils/currency';

/** The user's selected display currency. */
export function useCurrency(): Currency {
  const code = useSettingsStore((state) => state.currencyCode);
  return getCurrency(code);
}

export type MoneyFormatter = (amount: number, options?: FormatCurrencyOptions) => string;

/**
 * Returns a money formatter bound to the user's selected currency.
 *
 * Every component that displays an amount uses this instead of calling
 * `formatCurrency` directly, so changing the currency in Settings re-labels the
 * whole app immediately. `formatCurrency` itself stays pure and testable; this
 * hook only supplies the symbol. An explicit `symbol` in `options` still wins.
 */
export function useMoney(): MoneyFormatter {
  const currency = useCurrency();

  return useCallback(
    (amount: number, options?: FormatCurrencyOptions) =>
      formatCurrency(amount, { ...options, symbol: options?.symbol ?? currency.symbol }),
    [currency.symbol],
  );
}
