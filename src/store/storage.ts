import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Shared Zustand persistence adapter backed by AsyncStorage. Every persisted
 * store in the app uses this so there is a single, consistent storage layer.
 * Milestone 7 extends this foundation with export/import and migrations.
 */
export const asyncJSONStorage = createJSONStorage(() => AsyncStorage);
