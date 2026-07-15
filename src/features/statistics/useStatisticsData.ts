import { useMemo } from 'react';

import { CATEGORIES } from '@/constants/categories';
import {
  filterByMonth,
  getCategoryTotals,
  getDailyAverageForMonth,
  getDailySeriesForMonth,
  getTotalForMonth,
} from '@/features/expenses/calculations';
import { useExpenses } from '@/features/expenses/useExpenses';
import { useSalaryStore } from '@/store/salaryStore';
import { formatMonthLabel, getCurrentMonthKey, type MonthKey } from '@/utils/date';

import { type CategorySlice, type StatisticsData } from './types';

/**
 * Statistics for a single month, derived entirely from persisted records.
 *
 * Salary is read for the requested month (not just the current one) so past
 * months show the budget they actually had.
 */
export function useStatisticsData(month: MonthKey): StatisticsData {
  const expenses = useExpenses();
  const salaryRecord = useSalaryStore((state) => state.salaries[month]);

  return useMemo(() => {
    const now = new Date();

    const monthlyTotal = getTotalForMonth(expenses, month);
    const totals = getCategoryTotals(filterByMonth(expenses, month));

    // Built in fixed CATEGORIES order: a slice's color and neighbours must not
    // move when the amounts change (color follows the entity, never its rank).
    const slices: CategorySlice[] = CATEGORIES.filter((category) => totals[category.id] > 0).map(
      (category) => ({
        id: category.id,
        label: category.label,
        color: category.color,
        icon: category.icon,
        total: totals[category.id],
        percent: monthlyTotal > 0 ? (totals[category.id] / monthlyTotal) * 100 : 0,
      }),
    );

    const highest = slices.reduce<CategorySlice | null>(
      (top, slice) => (top === null || slice.total > top.total ? slice : top),
      null,
    );

    const salary = salaryRecord?.amount ?? 0;

    return {
      monthKey: month,
      monthLabel: formatMonthLabel(month),
      canGoNext: month < getCurrentMonthKey(),

      monthlyTotal,
      salary,
      isSalarySet: salaryRecord != null,
      remaining: salary - monthlyTotal,
      dailyAverage: getDailyAverageForMonth(expenses, month, now),
      monthlyProgress: salary > 0 ? Math.min(1, monthlyTotal / salary) : 0,
      budgetPercentUsed: salary > 0 ? Math.round((monthlyTotal / salary) * 100) : 0,

      highest,
      slices,
      dailySeries: getDailySeriesForMonth(expenses, month, now),
      hasData: monthlyTotal > 0,
    };
  }, [expenses, month, salaryRecord]);
}
