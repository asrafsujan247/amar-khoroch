import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Shared Zustand persistence adapter backed by AsyncStorage.
 *
 * EXTENSION POINT: this is the single place the app touches the storage engine.
 * Swapping to encrypted storage (for PIN/biometric protection) or to a
 * sync-aware engine means changing only this adapter — no store has to change.
 */
export const asyncJSONStorage = createJSONStorage(() => AsyncStorage);

/**
 * Build the persisted key for a store slice.
 *
 * EXTENSION POINT: when user accounts land, prefix the key with the account id
 * here (e.g. `${accountId}:${slice}-store`) and every store is namespaced at
 * once. Today it returns the historical key names so existing data is kept.
 */
export function storageKey(slice: string): string {
  return `${slice}-store`;
}
