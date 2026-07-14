import { addMonths, format, parse } from 'date-fns';

/** A month identifier in `yyyy-MM` form, e.g. `"2026-07"`. */
export type MonthKey = string;

/** Month key for a given date (defaults to now). */
export function getMonthKey(date: Date = new Date()): MonthKey {
  return format(date, 'yyyy-MM');
}

/** Month key for the current month. */
export function getCurrentMonthKey(): MonthKey {
  return getMonthKey(new Date());
}

/** Parse a month key back into a Date (first day of that month). */
export function monthKeyToDate(month: MonthKey): Date {
  return parse(month, 'yyyy-MM', new Date());
}

/** Month key for the month before the given one. */
export function getPreviousMonthKey(month: MonthKey): MonthKey {
  return getMonthKey(addMonths(monthKeyToDate(month), -1));
}

/** Human-readable month label, e.g. `"July 2026"`. */
export function formatMonthLabel(month: MonthKey): string {
  return format(monthKeyToDate(month), 'MMMM yyyy');
}
