import { z } from 'zod';

import { isCategoryId } from '@/constants/categories';

/**
 * The backup FILE FORMAT — pure, with no store or storage dependencies.
 *
 * The payload is a versioned envelope with named data "slices". Adding a future
 * slice (wallets, budgets, custom categories, income) means: add it to
 * `backupSchema.data`, then bump `BACKUP_VERSION` and handle older versions in
 * `parseBackup`. Existing backups keep importing because the file stamps its
 * own version.
 *
 * Kept free of side effects so it can be unit-tested and reused by any
 * transport — a local file today, cloud backup later.
 */

export const BACKUP_APP_ID = 'salary-expense-tracker';
/**
 * v2 added the optional `settings` slice. Because the slice is optional, v1
 * files still validate and import — which is the point of stamping the version.
 */
export const BACKUP_VERSION = 2;

/** Thrown for any invalid/unreadable backup, with a user-presentable message. */
export class BackupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackupError';
  }
}

const expenseSchema = z.object({
  id: z.string().min(1),
  amount: z.number().finite(),
  // Validated against the known set: a corrupt or foreign file is rejected
  // rather than silently poisoning category totals.
  category: z.string().refine(isCategoryId, { error: 'Unknown category' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Invalid date' }),
  note: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const salaryRecordSchema = z.object({
  id: z.string().min(1),
  month: z.string().regex(/^\d{4}-\d{2}$/, { error: 'Invalid month' }),
  amount: z.number().finite(),
  carriedForward: z.boolean().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const settingsSchema = z.object({
  currencyCode: z.string().min(1),
});

const backupDataSchema = z.object({
  salaries: z.record(z.string(), salaryRecordSchema),
  expenses: z.array(expenseSchema),
  /** Added in backup v2 — optional so v1 files still import cleanly. */
  settings: settingsSchema.optional(),
});

const backupSchema = z.object({
  app: z.literal(BACKUP_APP_ID),
  version: z.number().int().positive(),
  exportedAt: z.string().min(1),
  data: backupDataSchema,
});

/** The data slices carried by a backup. */
export type BackupData = z.infer<typeof backupDataSchema>;
/** A complete backup envelope. */
export type Backup = z.infer<typeof backupSchema>;

/** Wrap data slices in a stamped, versioned envelope. */
export function buildBackup(data: BackupData, now: Date = new Date()): Backup {
  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    data,
  };
}

/** Serialize a backup for writing to a file. */
export function serializeBackup(backup: Backup): string {
  return JSON.stringify(backup, null, 2);
}

/**
 * Parse and validate the contents of a backup file.
 * @throws {BackupError} when the file is unreadable, not a backup of this app,
 * corrupt, or produced by a newer app version.
 */
export function parseBackup(json: string): Backup {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new BackupError('This file is not valid JSON.');
  }

  const result = backupSchema.safeParse(raw);
  if (!result.success) {
    throw new BackupError('This does not look like a Salary Expense Tracker backup.');
  }

  if (result.data.version > BACKUP_VERSION) {
    throw new BackupError('This backup was created by a newer version of the app. Please update.');
  }

  return result.data;
}
