import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/**
 * A no-op storage used only where no persistence backend exists — specifically
 * web static / server-side rendering, where AsyncStorage falls back to
 * `window.localStorage` and `window` is undefined in the Node render pass.
 * Without this, the persisted stores throw "window is not defined" at import
 * time and the web bundle crashes.
 */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

/**
 * Choose the storage backend for the current environment.
 *
 * Native (Android/iOS) ALWAYS uses AsyncStorage — device persistence is
 * unaffected. Web uses AsyncStorage in the browser (backed by localStorage) but
 * falls back to `noopStorage` during SSR, when there is no `window`.
 */
function getStorageBackend(): StateStorage {
  if (Platform.OS !== 'web') {
    return AsyncStorage as unknown as StateStorage;
  }
  if (typeof window === 'undefined') {
    return noopStorage;
  }
  return AsyncStorage as unknown as StateStorage;
}

/**
 * Shared Zustand persistence adapter.
 *
 * EXTENSION POINT: this is the single place the app touches the storage engine.
 * Swapping to encrypted storage (for PIN/biometric protection) or to a
 * sync-aware engine means changing only this adapter — no store has to change.
 */
export const asyncJSONStorage = createJSONStorage(getStorageBackend);

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
