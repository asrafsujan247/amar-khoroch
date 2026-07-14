import { z } from 'zod';

/**
 * Validation for the salary form. The amount arrives from `AmountInput` as
 * `number | null` (null when empty), so we accept that union and require a
 * positive number.
 */
export const salarySchema = z.object({
  amount: z
    .union([z.number(), z.null()])
    .refine((value): value is number => value !== null && value > 0, {
      error: 'Enter a salary greater than 0',
    }),
});

/** Form input type: amount may be null while the field is empty. */
export type SalaryFormInput = z.input<typeof salarySchema>;
/** Validated output type: amount is guaranteed a positive number. */
export type SalaryFormValues = z.output<typeof salarySchema>;
