import { useMemo } from 'react';
import { format } from 'date-fns';

import { CATEGORY_MAP, DAILY_CATEGORIES } from '@/constants/categories';
import {
  getDailyAverageForMonth,
  getRecentExpenses,
  getTodayTotal,
  getTotalForMonth,
} from '@/features/expenses/calculations';
import { useExpenses } from '@/features/expenses/useExpenses';
import { useCurrentSalary } from '@/features/salary/useSalary';
import { type Expense } from '@/types/expense';
import { formatRelativeDate, getMonthKey } from '@/utils/date';

import { type DashboardData, type RecentExpense } from './types';

const RECENT_LIMIT = 5;

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Map a stored expense to its presentation-ready dashboard form. */
function toRecentExpense(expense: Expense): RecentExpense {
  const meta = CATEGORY_MAP[expense.category];
  return {
    id: expense.id,
    categoryLabel: meta.label,
    icon: meta.icon,
    color: meta.color,
    amount: expense.amount,
    note: expense.note,
    dateLabel: formatRelativeDate(expense.date),
  };
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

      recentExpenses: getRecentExpenses(expenses, RECENT_LIMIT).map(toRecentExpense),
      quickCategories: DAILY_CATEGORIES.map((category) => ({
        key: category.id,
        label: category.label,
        icon: category.icon,
        color: category.color,
      })),
    };
  }, [salaryRecord, expenses]);
}
