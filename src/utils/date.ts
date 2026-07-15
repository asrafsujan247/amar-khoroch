import { addMonths, format, isSameYear, isToday, isYesterday, parse } from 'date-fns';

/** A month identifier in `yyyy-MM` form, e.g. `"2026-07"`. */
export type MonthKey = string;

/** A calendar-day identifier in `yyyy-MM-dd` form, e.g. `"2026-07-14"`. */
export type DateKey = string;

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

/** Date key for a given date (defaults to now). */
export function getDateKey(date: Date = new Date()): DateKey {
  return format(date, 'yyyy-MM-dd');
}

/** Date key for today. */
export function getTodayKey(): DateKey {
  return getDateKey(new Date());
}

/** Parse a date key back into a Date at local midnight. */
export function dateKeyToDate(date: DateKey): Date {
  return parse(date, 'yyyy-MM-dd', new Date());
}

/** The month a date key belongs to, e.g. `"2026-07-14"` -> `"2026-07"`. */
export function getMonthKeyOf(date: DateKey): MonthKey {
  return date.slice(0, 7);
}

/**
 * Short, human-friendly label for a date key:
 * `"Today"`, `"Yesterday"`, `"12 Jul"`, or `"12 Jul 2025"` for other years.
 */
export function formatRelativeDate(date: DateKey): string {
  const parsed = dateKeyToDate(date);
  if (isToday(parsed)) return 'Today';
  if (isYesterday(parsed)) return 'Yesterday';
  return format(parsed, isSameYear(parsed, new Date()) ? 'd MMM' : 'd MMM yyyy');
}

/** Full date label, e.g. `"14 July 2026"`. */
export function formatDateLabel(date: DateKey): string {
  return format(dateKeyToDate(date), 'd MMMM yyyy');
}
