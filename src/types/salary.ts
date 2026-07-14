import { type MonthKey } from '@/utils/date';

/**
 * A salary entry for a single month. The user sets salary once per month; when
 * a new month begins the previous amount is carried forward automatically (see
 * the salary store) and flagged so the UI can prompt for confirmation.
 */
export type SalaryRecord = {
  id: string;
  /** Month this salary applies to, `yyyy-MM`. */
  month: MonthKey;
  amount: number;
  /** True when this record was auto-created by carrying forward a prior month. */
  carriedForward?: boolean;
  createdAt: string;
  updatedAt: string;
};
