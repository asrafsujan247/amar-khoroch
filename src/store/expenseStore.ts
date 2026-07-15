import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type Expense, type ExpenseInput } from '@/types/expense';
import { createId } from '@/utils/id';

import { asyncJSONStorage } from './storage';

/**
 * Collapse a blank note to `undefined` so empty strings are never persisted.
 * Shared by `addExpense` and `updateExpense` to keep normalization consistent.
 */
function normalizeNote(note?: string): string | undefined {
  const trimmed = note?.trim();
  return trimmed ? trimmed : undefined;
}

type ExpenseState = {
  /** All expenses, unsorted (sorting is the caller's concern). */
  expenses: Expense[];
  /** True once AsyncStorage has rehydrated this store. */
  hasHydrated: boolean;

  /** Create a new expense from user input; generates id + timestamps. */
  addExpense: (input: ExpenseInput) => void;
  /** Replace the user-editable fields of an existing expense; bumps updatedAt. No-op if id not found. */
  updateExpense: (id: string, input: ExpenseInput) => void;
  /** Remove an expense by id. */
  deleteExpense: (id: string) => void;
  /** Remove every expense (used by Settings → Reset App later). */
  clearExpenses: () => void;

  setHydrated: () => void;
};

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      expenses: [],
      hasHydrated: false,

      addExpense: (input) =>
        set((state) => {
          const now = new Date().toISOString();
          const expense: Expense = {
            id: createId(),
            ...input,
            note: normalizeNote(input.note),
            createdAt: now,
            updatedAt: now,
          };
          return { expenses: [...state.expenses, expense] };
        }),

      updateExpense: (id, input) =>
        set((state) => {
          const now = new Date().toISOString();
          return {
            expenses: state.expenses.map((expense) =>
              expense.id === id
                ? {
                    ...expense,
                    ...input,
                    note: normalizeNote(input.note),
                    updatedAt: now,
                  }
                : expense,
            ),
          };
        }),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      clearExpenses: () => set({ expenses: [] }),

      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: 'expense-store',
      storage: asyncJSONStorage,
      // Only the data is persisted; the hydration flag is runtime-only.
      partialize: (state) => ({ expenses: state.expenses }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
