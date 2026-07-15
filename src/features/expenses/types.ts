import { type IoniconName } from '@/types/icon';

/**
 * An expense in presentation-ready form, as rendered by `ExpenseRow`.
 *
 * Shared by every expense list in the app (the dashboard's "Recent Expenses"
 * and the History screen) so the row is built once. Produced from an `Expense`
 * record by `toExpenseListItem`.
 */
export type ExpenseListItem = {
  id: string;
  categoryLabel: string;
  /** Category glyph. */
  icon: IoniconName;
  /** Category accent color (hex) from the validated categorical palette. */
  color: string;
  amount: number;
  note?: string;
  /** Human date label, e.g. "Today", "Yesterday", "12 Jul". */
  dateLabel: string;
};
