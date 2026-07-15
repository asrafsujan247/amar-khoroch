import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { IconButton, Screen, Text } from '@/components/ui';
import { isCategoryId } from '@/constants/categories';
import { ExpenseForm } from '@/features/expenses/components/ExpenseForm';
import { useExpenseStore } from '@/store/expenseStore';

/**
 * Add Expense — presented as a modal over the tabs.
 *
 * Accepts an optional `category` param so the dashboard's Quick Add shortcuts
 * can open the form with a category already selected (fast entry).
 */
export default function AddExpenseScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const addExpense = useExpenseStore((state) => state.addExpense);

  const presetCategory = category && isCategoryId(category) ? category : null;

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
        <Text variant="h2">Add Expense</Text>
        <IconButton
          icon="close"
          accessibilityLabel="Close"
          variant="soft"
          onPress={() => router.back()}
        />
      </View>

      <ExpenseForm
        defaultValues={{ category: presetCategory }}
        submitLabel="Save expense"
        onSubmit={(values) => {
          addExpense({
            amount: values.amount,
            category: values.category,
            date: values.date,
            note: values.note,
          });
          router.back();
        }}
      />
    </Screen>
  );
}
