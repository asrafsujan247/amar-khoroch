import { CATEGORY_MAP } from '@/constants/categories';
import { type Expense } from '@/types/expense';
import { formatRelativeDate } from '@/utils/date';

import { type ExpenseListItem } from './types';

/**
 * Map a stored expense to its presentation-ready list form, resolving the
 * category's label/icon/color and a human date label.
 *
 * Shared by the dashboard and history lists so both render identically.
 */
export function toExpenseListItem(expense: Expense): ExpenseListItem {
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
