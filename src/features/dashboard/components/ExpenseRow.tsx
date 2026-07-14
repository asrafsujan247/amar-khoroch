import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui';
import { formatCurrency } from '@/utils/currency';
import type { RecentExpense } from '@/features/dashboard/types';

export type ExpenseRowProps = {
  /** The expense to render (presentation-ready). */
  expense: RecentExpense;
  /** Called when the row is pressed. */
  onPress?: () => void;
};

/**
 * A single tappable row in the "Recent Expenses" list: a soft category-tinted
 * icon circle on the left, the category label with an optional note in the
 * middle, and the amount over a date label on the right. Renders without a
 * Card wrapper since the list groups rows inside one shared Card.
 */
export function ExpenseRow({ expense, onPress }: ExpenseRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${expense.categoryLabel}, ${formatCurrency(expense.amount)}`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: `${expense.color}1F`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={expense.icon} size={20} color={expense.color} />
      </View>

      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text variant="subtitle">{expense.categoryLabel}</Text>
        {expense.note ? (
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {expense.note}
          </Text>
        ) : null}
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="bodyStrong">{formatCurrency(expense.amount)}</Text>
        <Text variant="caption" color="tertiary">
          {expense.dateLabel}
        </Text>
      </View>
    </Pressable>
  );
}
