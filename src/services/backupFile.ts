import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { BackupError, parseBackup, serializeBackup } from '@/services/backupFormat';
import { createBackup, restoreBackup } from '@/services/backup';
import { getDateKey } from '@/utils/date';

/**
 * Local FILE TRANSPORT for backups — the share sheet and the document picker.
 *
 * This layer only moves bytes: it owns filenames, the on-device write, and the
 * platform pickers. What a backup *contains* is `backupFormat.ts` (pure), and
 * how it meets the stores is `backup.ts`. A future transport (cloud backup,
 * auto-export) can sit beside this file and reuse both of them unchanged.
 *
 * Every failure surfaces as a `BackupError` carrying a message that is safe to
 * show verbatim: the `BackupError`s thrown by `parseBackup` are deliberately
 * passed through untouched, because their wording names the actual problem
 * ("newer version of the app", "not valid JSON") far better than this layer can.
 */

/** Result of an export attempt. */
export type ExportResult = { status: 'shared' } | { status: 'unavailable'; uri: string };

/** Filename for a backup exported on the given day. */
function buildBackupFilename(now: Date = new Date()): string {
  return `salary-expense-tracker-backup-${getDateKey(now)}.json`;
}

/**
 * Write the current data to a JSON file and open the share sheet.
 *
 * The file is written to the cache directory: it exists only to hand to the
 * share sheet, so letting the OS reclaim it later is the point. Re-exporting on
 * the same day overwrites the previous file rather than piling up copies.
 *
 * @returns `{ status: 'shared' }` once the share sheet has been presented, or
 * `{ status: 'unavailable', uri }` when the platform cannot share, so the UI can
 * tell the user where the file landed.
 * @throws {BackupError} with a user-presentable message on failure.
 */
export async function exportBackupToFile(): Promise<ExportResult> {
  let uri: string;

  try {
    const json = serializeBackup(createBackup());
    const file = new File(Paths.cache, buildBackupFilename());
    // `write` creates the file when missing and truncates it when it already
    // exists, so no explicit `create` step is needed (and none that could throw
    // "file already exists" on a second export in the same day).
    file.write(json);
    uri = file.uri;
  } catch (error) {
    if (error instanceof BackupError) throw error;
    throw new BackupError('Could not create the backup file.');
  }

  try {
    if (!(await Sharing.isAvailableAsync())) {
      return { status: 'unavailable', uri };
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'application/json',
      // The iOS counterpart of `mimeType`; without it the sheet offers fewer targets.
      UTI: 'public.json',
      dialogTitle: 'Share your backup',
    });

    return { status: 'shared' };
  } catch (error) {
    if (error instanceof BackupError) throw error;
    throw new BackupError('Could not open the share sheet for your backup.');
  }
}

/**
 * Let the user pick a backup file, validate it, and restore it.
 *
 * Destructive on success — `restoreBackup` replaces all local data, so callers
 * must confirm with the user before calling this.
 *
 * @returns `true` once the backup has been restored, or `false` when the user
 * cancels the picker (a cancel is not an error).
 * @throws {BackupError} with a user-presentable message on invalid files.
 */
export async function importBackupFromFile(): Promise<boolean> {
  let text: string;

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      // Copies the pick into the cache so it is readable through a `file://`
      // URI; without it Android hands back a `content://` URI that `File` cannot open.
      copyToCacheDirectory: true,
    });

    if (result.canceled) return false;

    const asset = result.assets[0];
    if (!asset) throw new BackupError('No file was selected.');

    text = await new File(asset.uri).text();
  } catch (error) {
    if (error instanceof BackupError) throw error;
    throw new BackupError('Could not read that file.');
  }

  // Outside the catch above: `parseBackup` throws `BackupError`s whose messages
  // name the specific problem, and they must reach the user unchanged.
  const backup = parseBackup(text);
  restoreBackup(backup);

  return true;
}
