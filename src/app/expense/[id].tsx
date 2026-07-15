import { router, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';

import { EmptyState, IconButton, Screen, Text } from '@/components/ui';
import { ExpenseForm } from '@/features/expenses/components/ExpenseForm';
import { useExpenseById } from '@/features/expenses/useExpenses';
import { useExpenseStore } from '@/store/expenseStore';

/**
 * Edit Expense — presented as a modal. Reuses `ExpenseForm` so add and edit
 * behave identically, and adds a destructive delete with confirmation.
 */
export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const expense = useExpenseById(id);
  const updateExpense = useExpenseStore((state) => state.updateExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);

  const confirmDelete = () => {
    Alert.alert('Delete expense?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteExpense(id);
          router.back();
        },
      },
    ]);
  };

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
        <Text variant="h2">Edit Expense</Text>
        <IconButton
          icon="close"
          accessibilityLabel="Close"
          variant="soft"
          onPress={() => router.back()}
        />
      </View>

      {expense ? (
        <ExpenseForm
          defaultValues={{
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            note: expense.note ?? '',
          }}
          submitLabel="Save changes"
          onSubmit={(values) => {
            updateExpense(expense.id, {
              amount: values.amount,
              category: values.category,
              date: values.date,
              note: values.note,
            });
            router.back();
          }}
          onDelete={confirmDelete}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon="alert-circle-outline"
            title="Expense not found"
            description="It may have been deleted already."
          />
        </View>
      )}
    </Screen>
  );
}
