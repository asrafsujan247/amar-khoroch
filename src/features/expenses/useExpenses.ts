import { useExpenseStore } from '@/store/expenseStore';
import { type Expense } from '@/types/expense';

/** All persisted expenses (unsorted). */
export function useExpenses(): Expense[] {
  return useExpenseStore((state) => state.expenses);
}

/** Whether the persisted expense store has finished rehydrating. */
export function useExpensesHydrated(): boolean {
  return useExpenseStore((state) => state.hasHydrated);
}

/** A single expense by id, or `undefined` if it no longer exists. */
export function useExpenseById(id: string): Expense | undefined {
  return useExpenseStore((state) => state.expenses.find((expense) => expense.id === id));
}
