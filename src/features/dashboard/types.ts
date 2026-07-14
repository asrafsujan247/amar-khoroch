import { type ComponentProps } from 'react';
import { type Ionicons } from '@expo/vector-icons';

/** Type-safe Ionicons glyph name, shared by all dashboard cards. */
export type IoniconName = ComponentProps<typeof Ionicons>['name'];

/** A single expense as shown in the "Recent Expenses" list (presentation-ready). */
export type RecentExpense = {
  id: string;
  categoryLabel: string;
  /** Category glyph. */
  icon: IoniconName;
  /** Category accent color (hex). */
  color: string;
  amount: number;
  note?: string;
  /** Human date label, e.g. "Today", "Yesterday", "12 Jul". */
  dateLabel: string;
};

/** A quick-add category shortcut on the dashboard. */
export type QuickCategory = {
  key: string;
  label: string;
  icon: IoniconName;
  color: string;
};

/**
 * Everything the Dashboard screen renders, in presentation-ready form.
 *
 * In Milestone 4 this is produced by a mock hook. In Milestones 5–7 the same
 * shape is produced from the real Zustand store + calculations, so the UI does
 * not change when data becomes real.
 */
export type DashboardData = {
  /** Time-based greeting, e.g. "Good evening". */
  greeting: string;
  /** Optional user name to personalize the greeting. */
  userName?: string;
  /** Current month label, e.g. "July 2026". */
  monthLabel: string;

  salary: number;
  /** Whether a salary has been set for the current month. */
  isSalarySet: boolean;
  monthlyExpense: number;
  todayExpense: number;
  /** Salary minus monthly expense (can be negative if overspent). */
  remaining: number;
  /** Average spend per elapsed day this month. */
  dailyAverage: number;

  /** Spend / salary, clamped 0–1, for progress bars. */
  monthlyProgress: number;
  /** Rounded percentage of salary spent (0–100+). */
  budgetPercentUsed: number;

  recentExpenses: RecentExpense[];
  quickCategories: QuickCategory[];
};
