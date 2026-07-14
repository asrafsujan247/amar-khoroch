/**
 * Currency helpers for Bangladeshi Taka (BDT).
 *
 * A manual formatter is used instead of `Intl.NumberFormat` because Hermes'
 * Intl support is inconsistent across platforms; this keeps output
 * deterministic. The symbol is a constant here but is designed to be
 * overridable so Settings can switch it (e.g. "৳" vs "Tk") later.
 */

export const CURRENCY_SYMBOL = '৳';
export const CURRENCY_CODE = 'BDT';

export type FormatCurrencyOptions = {
  /** Fixed decimal places. Defaults to 0 for whole numbers, else 2. */
  decimals?: number;
  /** Show the currency symbol. Default true. */
  showSymbol?: boolean;
  /** Override the symbol (e.g. 'Tk'). Defaults to CURRENCY_SYMBOL. */
  symbol?: string;
  /** Compact large values using K / L (lakh) / Cr (crore). Default false. */
  compact?: boolean;
  /** Put a thin space between the symbol and the number. Default false (tight). */
  spaced?: boolean;
};

/** Insert thousands separators into an integer string ("12500" -> "12,500"). */
function groupThousands(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function trimTrailingZeros(value: string): string {
  return value.includes('.') ? value.replace(/\.?0+$/, '') : value;
}

function compactFormat(abs: number, decimals?: number): string {
  if (abs >= 1e7) return `${trimTrailingZeros((abs / 1e7).toFixed(decimals ?? 2))}Cr`;
  if (abs >= 1e5) return `${trimTrailingZeros((abs / 1e5).toFixed(decimals ?? 2))}L`;
  if (abs >= 1e3) return `${trimTrailingZeros((abs / 1e3).toFixed(decimals ?? 1))}K`;
  return String(Math.round(abs));
}

/**
 * Format a numeric amount as Taka, e.g. `12500` -> `"৳12,500"`.
 * Non-finite input is treated as 0.
 */
export function formatCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  const { showSymbol = true, symbol = CURRENCY_SYMBOL, compact = false, spaced = false } = options;

  const safe = Number.isFinite(amount) ? amount : 0;
  const sign = safe < 0 ? '-' : '';
  const abs = Math.abs(safe);

  let body: string;
  if (compact) {
    body = compactFormat(abs, options.decimals);
  } else {
    const decimals = options.decimals ?? (Number.isInteger(abs) ? 0 : 2);
    const fixed = abs.toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');
    body = groupThousands(intPart) + (decPart ? `.${decPart}` : '');
  }

  const prefix = showSymbol ? `${symbol}${spaced ? ' ' : ''}` : '';
  return `${sign}${prefix}${body}`;
}

/**
 * Parse a user-entered amount string into a number.
 * Strips the currency symbol, spaces and thousands separators.
 * Returns `null` for empty or invalid input.
 */
export function parseAmount(input: string): number | null {
  if (input == null) return null;
  const cleaned = input
    .replace(CURRENCY_SYMBOL, '')
    .replace(/[,\s]/g, '')
    .replace(/[^0-9.]/g, '')
    .trim();
  if (cleaned === '' || cleaned === '.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}
