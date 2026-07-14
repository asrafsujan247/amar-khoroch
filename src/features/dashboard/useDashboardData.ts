import { useMemo } from 'react';
import { format, getDate } from 'date-fns';

import { useCurrentSalary } from '@/features/salary/useSalary';

import { type DashboardData } from './types';

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Dashboard data.
 *
 * As of Milestone 5, `salary` is REAL — read from the persisted salary store.
 * Expenses are still mock and become real in Milestones 6–7. The return type
 * (`DashboardData`) is stable, so the cards never change as data becomes real.
 */
export function useDashboardData(): DashboardData {
  const salaryRecord = useCurrentSalary();

  return useMemo(() => {
    const now = new Date();

    const salary = salaryRecord?.amount ?? 0;
    const isSalarySet = salaryRecord != null;
    const monthlyExpense = 28500; // mock until Milestone 6
    const todayExpense = 850; // mock until Milestone 6
    const remaining = salary - monthlyExpense;
    const dayOfMonth = getDate(now);
    const dailyAverage = Math.round(monthlyExpense / Math.max(1, dayOfMonth));
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

      recentExpenses: [
        {
          id: '1',
          categoryLabel: 'Lunch',
          icon: 'restaurant-outline',
          color: '#00B89A',
          amount: 320,
          note: 'Office canteen',
          dateLabel: 'Today',
        },
        {
          id: '2',
          categoryLabel: 'Travel',
          icon: 'car-outline',
          color: '#3B82F6',
          amount: 120,
          dateLabel: 'Today',
        },
        {
          id: '3',
          categoryLabel: 'Bazar',
          icon: 'basket-outline',
          color: '#F97316',
          amount: 1500,
          note: 'Weekly groceries',
          dateLabel: 'Yesterday',
        },
        {
          id: '4',
          categoryLabel: 'Dinner',
          icon: 'pizza-outline',
          color: '#8B5CF6',
          amount: 450,
          dateLabel: 'Yesterday',
        },
        {
          id: '5',
          categoryLabel: 'Extra',
          icon: 'pricetag-outline',
          color: '#EC4899',
          amount: 200,
          note: 'Mobile recharge',
          dateLabel: '12 Jul',
        },
      ],

      quickCategories: [
        { key: 'breakfast', label: 'Breakfast', icon: 'cafe-outline', color: '#F59E0B' },
        { key: 'lunch', label: 'Lunch', icon: 'restaurant-outline', color: '#00B89A' },
        { key: 'dinner', label: 'Dinner', icon: 'pizza-outline', color: '#8B5CF6' },
        { key: 'travel', label: 'Travel', icon: 'car-outline', color: '#3B82F6' },
        { key: 'extra', label: 'Extra', icon: 'pricetag-outline', color: '#EC4899' },
      ],
    };
  }, [salaryRecord]);
}
