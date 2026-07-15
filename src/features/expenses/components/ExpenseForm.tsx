import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { AmountInput, Button, Input } from '@/components/ui';
import { CategoryPicker } from '@/features/expenses/components/CategoryPicker';
import { DateField } from '@/features/expenses/components/DateField';
import {
  expenseSchema,
  type ExpenseFormInput,
  type ExpenseFormValues,
} from '@/features/expenses/expenseSchema';
import { spacing } from '@/theme';
import { getTodayKey } from '@/utils/date';

export type ExpenseFormProps = {
  /** Prefilled values — used when editing, or to preselect a quick-add category. */
  defaultValues?: Partial<ExpenseFormInput>;
  /** Label for the primary submit button. */
  submitLabel: string;
  /** Called with validated values. */
  onSubmit: (values: ExpenseFormValues) => void;
  /** When provided, a destructive delete action is rendered (edit mode). */
  onDelete?: () => void;
};

/**
 * The single add/edit expense form. Both the Add Expense modal and the Edit
 * Expense modal render this, so validation and layout stay identical.
 * Validated with zod via React Hook Form.
 */
export function ExpenseForm({ defaultValues, submitLabel, onSubmit, onDelete }: ExpenseFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormInput, unknown, ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: null,
      category: null,
      date: getTodayKey(),
      note: '',
      ...defaultValues,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
          gap: spacing.xl,
        }}
      >
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <AmountInput
              label="Amount"
              value={field.value ?? null}
              onChangeValue={field.onChange}
              error={errors.amount?.message}
              autoFocus
            />
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <CategoryPicker
              value={field.value ?? null}
              onChange={field.onChange}
              error={errors.category?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DateField
              value={field.value ?? getTodayKey()}
              onChange={field.onChange}
              error={errors.date?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <Input
              label="Note (optional)"
              placeholder="What was this for?"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              leftIcon="create-outline"
            />
          )}
        />
      </ScrollView>

      <View style={{ gap: spacing.sm }}>
        <Button title={submitLabel} onPress={handleSubmit(onSubmit)} fullWidth />
        {onDelete ? (
          <Button
            title="Delete expense"
            variant="ghost"
            leftIcon="trash-outline"
            onPress={onDelete}
            fullWidth
          />
        ) : null}
      </View>
    </View>
  );
}
