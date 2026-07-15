import { useMemo } from 'react';
import { format } from 'date-fns';

import { DAILY_CATEGORIES } from '@/constants/categories';
import {
  getDailyAverageForMonth,
  getRecentExpenses,
  getTodayTotal,
  getTotalForMonth,
} from '@/features/expenses/calculations';
import { toExpenseListItem } from '@/features/expenses/toListItem';
import { useExpenses } from '@/features/expenses/useExpenses';
import { useCurrentSalary } from '@/features/salary/useSalary';
import { getMonthKey } from '@/utils/date';

import { type DashboardData } from './types';

const RECENT_LIMIT = 5;

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Dashboard data — fully derived from persisted records as of Milestone 6.
 *
 * Salary comes from the salary store; every expense figure is computed from the
 * expense records by the pure functions in `features/expenses/calculations`.
 * Nothing here is hardcoded.
 */
export function useDashboardData(): DashboardData {
  const salaryRecord = useCurrentSalary();
  const expenses = useExpenses();

  return useMemo(() => {
    const now = new Date();
    const month = getMonthKey(now);

    const salary = salaryRecord?.amount ?? 0;
    const isSalarySet = salaryRecord != null;

    const monthlyExpense = getTotalForMonth(expenses, month);
    const todayExpense = getTodayTotal(expenses, now);
    const dailyAverage = getDailyAverageForMonth(expenses, month, now);
    const remaining = salary - monthlyExpense;
    const monthlyProgress = salary > 0 ? Math.min(1, monthlyExpense / salary) : 0;

    return {
      greeting: greetingForHour(now.getHours()),
      userName: undefined,
      monthLabel: format(now, 'MMMM yyyy'),

      salary,
      isSalarySet,
      monthlyExpense,
      todayExpense,
      remaining,
      dailyAverage,
      monthlyProgress,
      budgetPercentUsed: salary > 0 ? Math.round((monthlyExpense / salary) * 100) : 0,

      recentExpenses: getRecentExpenses(expenses, RECENT_LIMIT).map(toExpenseListItem),
      quickCategories: DAILY_CATEGORIES.map((category) => ({
        key: category.id,
        label: category.label,
        icon: category.icon,
        color: category.color,
      })),
    };
  }, [salaryRecord, expenses]);
}
