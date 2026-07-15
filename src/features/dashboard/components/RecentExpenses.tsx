import { Fragment } from 'react';
import { Pressable, View } from 'react-native';

import { Card, Divider, EmptyState, Text } from '@/components/ui';
import { spacing } from '@/theme';
import type { RecentExpense } from '@/features/dashboard/types';

import { ExpenseRow } from '@/features/expenses/components/ExpenseRow';

export type RecentExpensesProps = {
  /** Expenses to list, newest first (presentation-ready). */
  expenses: RecentExpense[];
  /** Called with the expense id when a row is pressed. */
  onPressExpense?: (id: string) => void;
  /** Called when the "See all" action is pressed. */
  onSeeAll?: () => void;
};

/**
 * The "Recent Expenses" dashboard section: a header row with a "See all"
 * action, and a Card holding the individual expense rows separated by thin
 * dividers. Falls back to an EmptyState inside the Card when there is nothing
 * to show.
 */
export function RecentExpenses({ expenses, onPressExpense, onSeeAll }: RecentExpensesProps) {
  const hasExpenses = expenses.length > 0;

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        }}
      >
        <Text variant="title">Recent Expenses</Text>
        {hasExpenses ? (
          <Pressable
            onPress={onSeeAll}
            accessibilityRole="button"
            accessibilityLabel="See all expenses"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text variant="subtitle" color="brand">
              See all
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Card>
        {hasExpenses ? (
          expenses.map((expense, index) => (
            <Fragment key={expense.id}>
              {index > 0 ? <Divider inset={0} style={{ marginVertical: 4 }} /> : null}
              <ExpenseRow expense={expense} onPress={() => onPressExpense?.(expense.id)} />
            </Fragment>
          ))
        ) : (
          <EmptyState
            icon="receipt-outline"
            title="No expenses yet"
            description="Your recent expenses will show up here."
          />
        )}
      </Card>
    </View>
  );
}
