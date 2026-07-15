import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_CURRENCY_CODE } from '@/constants/currencies';

import { asyncJSONStorage, storageKey } from './storage';

type SettingsState = {
  /** ISO code of the display currency. */
  currencyCode: string;
  /** True once AsyncStorage has rehydrated this store. */
  hasHydrated: boolean;

  setCurrencyCode: (code: string) => void;
  /** Restore defaults (used by Settings → Reset App). */
  resetSettings: () => void;

  setHydrated: () => void;
};

/**
 * User preferences.
 *
 * EXTENSION POINT: future preferences (theme, language, notification times,
 * biometric lock) are added as fields here and picked up by the backup's
 * settings slice automatically.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currencyCode: DEFAULT_CURRENCY_CODE,
      hasHydrated: false,

      setCurrencyCode: (code) => set({ currencyCode: code }),
      resetSettings: () => set({ currencyCode: DEFAULT_CURRENCY_CODE }),

      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: storageKey('settings'),
      // Bump when the persisted shape changes and add a `migrate` handler.
      version: 1,
      storage: asyncJSONStorage,
      // Only the data is persisted; the hydration flag is runtime-only.
      partialize: (state) => ({ currencyCode: state.currencyCode }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[settings-store] Could not restore saved settings.', error);
        }
        // Always mark hydration complete — even on failure — so screens gated on
        // hydration never hang forever.
        (state ?? useSettingsStore.getState()).setHydrated();
      },
    },
  ),
);
