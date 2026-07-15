import { useExpenseStore } from '@/store/expenseStore';
import { useSalaryStore } from '@/store/salaryStore';

import { type Backup, buildBackup } from './backupFormat';

/**
 * Backup / restore wired to the live persisted stores.
 *
 * This is the thin integration layer; the file format itself lives in
 * `backupFormat.ts` (pure). Settings owns the file I/O (share sheet, document
 * picker), and a future cloud backup can reuse these functions unchanged.
 *
 * When a new persisted store is added, extend `createBackup`/`restoreBackup`
 * and the schema in `backupFormat.ts` together.
 */

export {
  BACKUP_APP_ID,
  BACKUP_VERSION,
  BackupError,
  parseBackup,
  serializeBackup,
  type Backup,
  type BackupData,
} from './backupFormat';

/** Snapshot every persisted store into a backup payload. */
export function createBackup(): Backup {
  return buildBackup({
    salaries: useSalaryStore.getState().salaries,
    expenses: useExpenseStore.getState().expenses,
  });
}

/**
 * Replace ALL local data with a validated backup. Destructive by design —
 * callers must confirm with the user first.
 */
export function restoreBackup(backup: Backup): void {
  useSalaryStore.setState({ salaries: backup.data.salaries });
  useExpenseStore.setState({ expenses: backup.data.expenses });
}

/** Wipe all app data (Settings → Reset App). */
export function resetAllData(): void {
  useSalaryStore.getState().clearSalaries();
  useExpenseStore.getState().clearExpenses();
}
