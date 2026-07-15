/**
 * Pure calculation helpers for expense records.
 *
 * Every figure the app shows — daily/weekly/monthly totals, category
 * breakdowns, averages — is derived here from the raw `Expense[]`. Nothing is
 * hardcoded. These functions are intentionally free of React, stores and side
 * effects so they can be unit-tested and reused from any layer.
 *
 * All `now` parameters default to `new Date()` and exist so callers (and tests)
 * can pin "today" deterministically.
 */

import {
  endOfWeek,
  getDaysInMonth,
  isBefore,
  isSameMonth,
  isWithinInterval,
  startOfWeek,
  subDays,
} from 'date-fns';

import { CATEGORY_IDS, isCategoryId } from '@/constants/categories';
import { type CategoryId, type Expense } from '@/types/expense';
import {
  dateKeyToDate,
  getDateKey,
  getMonthKeyOf,
  monthKeyToDate,
  type DateKey,
  type MonthKey,
} from '@/utils/date';

/** Amount of an expense, coerced to 0 when persisted data is non-finite. */
function safeAmount(expense: Expense): number {
  return Number.isFinite(expense.amount) ? expense.amount : 0;
}

/** Descending comparator for sortable strings (ISO dates/timestamps). */
function compareDesc(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? 1 : -1;
}

/** Total of every expense's amount. Returns 0 for an empty list. */
export function sumAmount(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + safeAmount(expense), 0);
}

/** Expenses recorded on an exact calendar day. */
export function filterByDate(expenses: Expense[], date: DateKey): Expense[] {
  return expenses.filter((expense) => expense.date === date);
}

/** Expenses recorded in a given month. */
export function filterByMonth(expenses: Expense[], month: MonthKey): Expense[] {
  return expenses.filter((expense) => getMonthKeyOf(expense.date) === month);
}

/** Total spent on an exact calendar day. */
export function getTotalForDate(expenses: Expense[], date: DateKey): number {
  return sumAmount(filterByDate(expenses, date));
}

/** Total spent in a given month. */
export function getTotalForMonth(expenses: Expense[], month: MonthKey): number {
  return sumAmount(filterByMonth(expenses, month));
}

/** Total spent today. */
export function getTodayTotal(expenses: Expense[], now: Date = new Date()): number {
  return getTotalForDate(expenses, getDateKey(now));
}

/** Total spent yesterday. */
export function getYesterdayTotal(expenses: Expense[], now: Date = new Date()): number {
  return getTotalForDate(expenses, getDateKey(subDays(now, 1)));
}

/** Total spent in the current week (Sunday through Saturday). */
export function getWeekTotal(expenses: Expense[], now: Date = new Date()): number {
  const interval = { start: startOfWeek(now), end: endOfWeek(now) };
  const inWeek = expenses.filter((expense) =>
    isWithinInterval(dateKeyToDate(expense.date), interval),
  );
  return sumAmount(inWeek);
}

/**
 * Total spent per category. Always contains an entry for every id in
 * `CATEGORY_IDS`, defaulting to 0, so consumers can index it safely.
 */
export function getCategoryTotals(expenses: Expense[]): Record<CategoryId, number> {
  const totals = CATEGORY_IDS.reduce(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as Record<CategoryId, number>,
  );

  for (const expense of expenses) {
    // Guards the record's shape against stale/unknown ids in persisted data.
    if (!isCategoryId(expense.category)) continue;
    totals[expense.category] += safeAmount(expense);
  }

  return totals;
}

/**
 * The category with the highest total, or `null` when nothing has been spent.
 * Ties resolve to whichever category comes first in `CATEGORY_IDS`.
 */
export function getHighestCategory(
  expenses: Expense[],
): { category: CategoryId; total: number } | null {
  const totals = getCategoryTotals(expenses);

  let highest: { category: CategoryId; total: number } | null = null;
  for (const id of CATEGORY_IDS) {
    const total = totals[id];
    if (total > 0 && (highest === null || total > highest.total)) {
      highest = { category: id, total };
    }
  }

  return highest;
}

/**
 * Days of a month that have already happened: the day-of-month so far for the
 * current month, the full month length for a past month, and 0 for a future
 * month. Never negative — safe to use as a divisor after a zero check.
 */
export function getElapsedDaysInMonth(month: MonthKey, now: Date = new Date()): number {
  const monthStart = monthKeyToDate(month);
  if (isSameMonth(monthStart, now)) return Math.max(0, now.getDate());
  if (isBefore(monthStart, now)) return getDaysInMonth(monthStart);
  return 0;
}

/**
 * Average spend per elapsed day of a month, rounded to a whole number.
 * Returns 0 before the month has started (no elapsed days to divide by).
 */
export function getDailyAverageForMonth(
  expenses: Expense[],
  month: MonthKey,
  now: Date = new Date(),
): number {
  const elapsedDays = getElapsedDaysInMonth(month, now);
  if (elapsedDays <= 0) return 0;
  return Math.round(getTotalForMonth(expenses, month) / elapsedDays);
}

/**
 * Expenses newest first by calendar date, tie-broken by `createdAt` so entries
 * added later the same day come first. Returns a new array; input is untouched.
 */
export function sortExpensesNewestFirst(expenses: Expense[]): Expense[] {
  return [...expenses].sort(
    (a, b) => compareDesc(a.date, b.date) || compareDesc(a.createdAt, b.createdAt),
  );
}

/** The `limit` most recent expenses, newest first. Defaults to 5. */
export function getRecentExpenses(expenses: Expense[], limit: number = 5): Expense[] {
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.trunc(limit)) : 0;
  return sortExpensesNewestFirst(expenses).slice(0, safeLimit);
}
