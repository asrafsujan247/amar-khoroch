import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { AmountInput, Button, IconButton, Screen, Text } from '@/components/ui';
import {
  salarySchema,
  type SalaryFormInput,
  type SalaryFormValues,
} from '@/features/salary/salarySchema';
import { useCurrentSalary, useSalaryPrefill } from '@/features/salary/useSalary';
import { useSalaryStore } from '@/store/salaryStore';
import { colors } from '@/theme';
import { formatMonthLabel, getCurrentMonthKey } from '@/utils/date';

/**
 * Salary entry / edit modal.
 *
 * Sets the salary for the current month. If a record already exists (including
 * one carried forward from last month) the form prefills and the title switches
 * to "Edit Salary". Validated with zod via React Hook Form.
 */
export default function SalaryScreen() {
  const month = getCurrentMonthKey();
  const current = useCurrentSalary();
  const prefill = useSalaryPrefill();
  const upsertSalary = useSalaryStore((state) => state.upsertSalary);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SalaryFormInput, unknown, SalaryFormValues>({
    resolver: zodResolver(salarySchema),
    defaultValues: { amount: prefill },
  });

  // `values.amount` is a guaranteed positive number here (validated by zod).
  const onSubmit = (values: SalaryFormValues) => {
    upsertSalary(month, values.amount);
    router.back();
  };

  const isEditing = current != null;

  return (
    <Screen edges={['top', 'bottom']}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Text variant="h2">{isEditing ? 'Edit Salary' : 'Set Salary'}</Text>
        <IconButton
          icon="close"
          accessibilityLabel="Close"
          variant="soft"
          onPress={() => router.back()}
        />
      </View>

      <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
        {formatMonthLabel(month)}
      </Text>

      {current?.carriedForward ? (
        <View
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            backgroundColor: colors.primary[50],
          }}
        >
          <Text variant="caption" color="brand">
            Carried over from last month — confirm or adjust the amount.
          </Text>
        </View>
      ) : null}

      <View style={{ marginTop: 24, flex: 1 }}>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <AmountInput
              label="Monthly salary"
              value={field.value ?? null}
              onChangeValue={field.onChange}
              error={errors.amount?.message}
              autoFocus
            />
          )}
        />
      </View>

      <Button title="Save salary" onPress={handleSubmit(onSubmit)} fullWidth />
    </Screen>
  );
}
