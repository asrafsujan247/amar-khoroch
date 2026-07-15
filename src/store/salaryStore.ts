import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type SalaryRecord } from '@/types/salary';
import { getPreviousMonthKey, type MonthKey } from '@/utils/date';
import { createId } from '@/utils/id';

import { asyncJSONStorage, storageKey } from './storage';

/** How many months back to look when carrying a salary forward. */
const CARRY_FORWARD_LOOKBACK = 24;

type SalaryState = {
  /** Salary records keyed by month (`yyyy-MM`). */
  salaries: Record<MonthKey, SalaryRecord>;
  /** True once AsyncStorage has rehydrated this store. */
  hasHydrated: boolean;

  /** Create or update the salary for a month (user action → not carried forward). */
  upsertSalary: (month: MonthKey, amount: number) => void;
  /** Remove a month's salary. */
  deleteSalary: (month: MonthKey) => void;
  /** Remove every salary record (used by Settings → Reset App). */
  clearSalaries: () => void;
  /**
   * Ensure a record exists for `month`. If missing, carry forward the amount
   * from the most recent prior month that has one (flagged `carriedForward`).
   * No-op when a record already exists or there is no prior salary.
   */
  ensureMonthRecord: (month: MonthKey) => void;

  setHydrated: () => void;
};

export const useSalaryStore = create<SalaryState>()(
  persist(
    (set, get) => ({
      salaries: {},
      hasHydrated: false,

      upsertSalary: (month, amount) =>
        set((state) => {
          const now = new Date().toISOString();
          const existing = state.salaries[month];
          const record: SalaryRecord = existing
            ? { ...existing, amount, carriedForward: false, updatedAt: now }
            : { id: createId(), month, amount, createdAt: now, updatedAt: now };
          return { salaries: { ...state.salaries, [month]: record } };
        }),

      deleteSalary: (month) =>
        set((state) => {
          const next = { ...state.salaries };
          delete next[month];
          return { salaries: next };
        }),

      ensureMonthRecord: (month) => {
        const { salaries } = get();
        if (salaries[month]) return;

        let cursor = getPreviousMonthKey(month);
        for (let i = 0; i < CARRY_FORWARD_LOOKBACK; i += 1) {
          const prior = salaries[cursor];
          if (prior) {
            const now = new Date().toISOString();
            set((state) => ({
              salaries: {
                ...state.salaries,
                [month]: {
                  id: createId(),
                  month,
                  amount: prior.amount,
                  carriedForward: true,
                  createdAt: now,
                  updatedAt: now,
                },
              },
            }));
            return;
          }
          cursor = getPreviousMonthKey(cursor);
        }
      },

      clearSalaries: () => set({ salaries: {} }),

      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: storageKey('salary'),
      // Bump this whenever the persisted shape of `SalaryRecord` changes and add
      // a `migrate` handler that upgrades old payloads. Without a migrate for a
      // new version, Zustand discards the old data — so never bump without one.
      version: 1,
      storage: asyncJSONStorage,
      // Only the data is persisted; the hydration flag is runtime-only.
      partialize: (state) => ({ salaries: state.salaries }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[salary-store] Could not restore saved salary.', error);
        }
        // Always mark hydration complete — even on failure — so screens gated on
        // hydration never hang forever. A failed restore leaves an empty but
        // fully usable store rather than a stuck loading screen.
        (state ?? useSalaryStore.getState()).setHydrated();
      },
    },
  ),
);
