import { z } from 'zod';

import { isCategoryId } from '@/constants/categories';
import { type CategoryId } from '@/types/expense';

/**
 * Validation for the add/edit expense form.
 *
 * `amount` and `category` arrive as nullable (empty) while the user fills the
 * form, so the schema accepts the nullable input and narrows to non-null,
 * valid values on output. `date` always has a value (defaults to today).
 */
export const expenseSchema = z.object({
  amount: z
    .union([z.number(), z.null()])
    .refine((value): value is number => value !== null && value > 0, {
      error: 'Enter an amount greater than 0',
    }),
  category: z
    .union([
      z.custom<CategoryId>((value) => typeof value === 'string' && isCategoryId(value)),
      z.null(),
    ])
    .refine((value): value is CategoryId => value !== null, {
      error: 'Choose a category',
    }),
  date: z.string().min(1, { error: 'Choose a date' }),
  note: z.string().optional(),
});

/** Form input type: amount/category may be null while the form is incomplete. */
export type ExpenseFormInput = z.input<typeof expenseSchema>;
/** Validated output: amount is positive, category is a real CategoryId. */
export type ExpenseFormValues = z.output<typeof expenseSchema>;
