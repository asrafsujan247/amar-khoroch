import { type DateKey } from '@/utils/date';

/** Stable category identifiers. Persisted, so never rename these values. */
export type CategoryId =
  'breakfast' | 'lunch' | 'dinner' | 'travel' | 'extra' | 'room-rent' | 'bazar';

/** Categories are grouped into recurring daily spend vs. monthly commitments. */
export type CategoryGroup = 'daily' | 'monthly';

/** A single expense record. */
export type Expense = {
  id: string;
  amount: number;
  category: CategoryId;
  /** Calendar date the expense happened, `yyyy-MM-dd`. */
  date: DateKey;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

/** The user-supplied fields needed to create or update an expense. */
export type ExpenseInput = {
  amount: number;
  category: CategoryId;
  date: DateKey;
  note?: string;
};
