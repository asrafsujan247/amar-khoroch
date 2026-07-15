import { useMemo } from 'react';

import {
  filterByRange,
  searchExpenses,
  sortExpensesNewestFirst,
  sumAmount,
  type DateRangeFilter,
} from '@/features/expenses/calculations';
import { toExpenseListItem } from '@/features/expenses/toListItem';
import { type ExpenseListItem } from '@/features/expenses/types';
import { useExpenses } from '@/features/expenses/useExpenses';

export type HistoryData = {
  /** Filtered + searched expenses, newest first, presentation-ready. */
  items: ExpenseListItem[];
  /** Sum of the visible items. */
  total: number;
  /** True when the user has no expenses at all (vs. none matching the query). */
  isEmpty: boolean;
  /** True when filters/search hid everything, but expenses do exist. */
  hasNoMatches: boolean;
};

/**
 * The History list for a given range filter and search query.
 *
 * Composes the pure calculation engine: range filter -> search -> newest-first
 * sort -> presentation mapping. Distinguishes "no expenses yet" from "nothing
 * matched" so the screen can show the right empty state.
 */
export function useHistoryData(filter: DateRangeFilter, query: string): HistoryData {
  const expenses = useExpenses();

  return useMemo(() => {
    const matched = searchExpenses(filterByRange(expenses, filter), query);
    const ordered = sortExpensesNewestFirst(matched);

    return {
      items: ordered.map(toExpenseListItem),
      total: sumAmount(matched),
      isEmpty: expenses.length === 0,
      hasNoMatches: expenses.length > 0 && matched.length === 0,
    };
  }, [expenses, filter, query]);
}
