import { useEffect } from 'react';

import { useSalaryStore } from '@/store/salaryStore';
import { type SalaryRecord } from '@/types/salary';
import { getCurrentMonthKey, getPreviousMonthKey } from '@/utils/date';

/** The salary record for the current month, or `undefined` if not set. */
export function useCurrentSalary(): SalaryRecord | undefined {
  const month = getCurrentMonthKey();
  return useSalaryStore((state) => state.salaries[month]);
}

/** Whether the persisted salary store has finished rehydrating. */
export function useSalaryHydrated(): boolean {
  return useSalaryStore((state) => state.hasHydrated);
}

/**
 * The amount to prefill the salary form with: the current month's amount if set,
 * otherwise the most recent prior month's amount (carry-forward convenience),
 * otherwise `null`.
 */
export function useSalaryPrefill(): number | null {
  const month = getCurrentMonthKey();
  return useSalaryStore((state) => {
    const current = state.salaries[month];
    if (current) return current.amount;
    const prior = state.salaries[getPreviousMonthKey(month)];
    return prior ? prior.amount : null;
  });
}

/**
 * Auto-create the current month's salary record (carried forward from the last
 * known month) once the store has hydrated. Idempotent — safe to mount anywhere.
 */
export function useEnsureCurrentMonthSalary(): void {
  const hasHydrated = useSalaryStore((state) => state.hasHydrated);
  const ensureMonthRecord = useSalaryStore((state) => state.ensureMonthRecord);

  useEffect(() => {
    if (hasHydrated) {
      ensureMonthRecord(getCurrentMonthKey());
    }
  }, [hasHydrated, ensureMonthRecord]);
}
