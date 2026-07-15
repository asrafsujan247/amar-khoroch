import { useExpenseStore } from './expenseStore';
import { useSalaryStore } from './salaryStore';
import { useSettingsStore } from './settingsStore';

/**
 * True once every persisted store has finished restoring from AsyncStorage.
 *
 * Screens gate their loading state on this single hook rather than tracking
 * individual stores. When a new persisted store is added (wallets, budgets,
 * settings), include its `hasHydrated` flag here and every screen benefits.
 */
export function useAppHydrated(): boolean {
  const salaryHydrated = useSalaryStore((state) => state.hasHydrated);
  const expensesHydrated = useExpenseStore((state) => state.hasHydrated);
  const settingsHydrated = useSettingsStore((state) => state.hasHydrated);
  return salaryHydrated && expensesHydrated && settingsHydrated;
}
