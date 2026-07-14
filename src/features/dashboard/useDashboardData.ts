import { useMemo } from 'react';
import { format, getDate } from 'date-fns';

import { type DashboardData } from './types';

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * MOCK dashboard data (Milestone 4).
 *
 * Returns realistic Bangladeshi-Taka figures so the Dashboard UI can be built
 * and reviewed before the real data layer exists. In Milestones 5–7 the body of
 * this hook is replaced with Zustand selectors + calculations; its return type
 * (`DashboardData`) stays identical, so no card component needs to change.
 */
export function useDashboardData(): DashboardData {
  return useMemo(() => {
    const now = new Date();

    const salary = 45000;
    const monthlyExpense = 28500;
    const todayExpense = 850;
    const remaining = salary - monthlyExpense;
    const dayOfMonth = getDate(now);
    const dailyAverage = Math.round(monthlyExpense / Math.max(1, dayOfMonth));
    const monthlyProgress = salary > 0 ? Math.min(1, monthlyExpense / salary) : 0;

    return {
      greeting: greetingForHour(now.getHours()),
      userName: undefined,
      monthLabel: format(now, 'MMMM yyyy'),

      salary,
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
  }, []);
}
