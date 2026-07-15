import { type DailyPoint } from '@/features/expenses/calculations';
import { type CategoryId } from '@/types/expense';
import { type IoniconName } from '@/types/icon';
import { type MonthKey } from '@/utils/date';

export type { DailyPoint };

/** One category's share of a month's spending, presentation-ready. */
export type CategorySlice = {
  id: CategoryId;
  label: string;
  /** Fixed per-category color from the validated categorical palette. */
  color: string;
  icon: IoniconName;
  total: number;
  /** Share of the month's total, 0–100. */
  percent: number;
};

/**
 * Everything the Statistics screen renders for a single month.
 *
 * Produced by `useStatisticsData` from the pure calculation engine — nothing is
 * hardcoded. The shape is stable so charts never change as data does.
 */
export type StatisticsData = {
  monthKey: MonthKey;
  monthLabel: string;
  /** False when already viewing the current month (can't step into the future). */
  canGoNext: boolean;

  monthlyTotal: number;
  salary: number;
  isSalarySet: boolean;
  remaining: number;
  dailyAverage: number;
  /** Spend / salary clamped 0–1, for the budget bar. */
  monthlyProgress: number;
  budgetPercentUsed: number;

  /** The single highest-spending category, or null when nothing was spent. */
  highest: CategorySlice | null;
  /**
   * Categories with spending in this month.
   *
   * IMPORTANT: ordered by the fixed `CATEGORIES` slot order, NOT by amount, so
   * a slice's color and neighbours never change with the data. The breakdown
   * list sorts a copy by amount for ranking.
   */
  slices: CategorySlice[];
  dailySeries: DailyPoint[];
  hasData: boolean;
};
