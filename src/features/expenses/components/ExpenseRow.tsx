import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui';
import { type ExpenseListItem } from '@/features/expenses/types';
import { useMoney } from '@/hooks/useMoney';

export type ExpenseRowProps = {
  /** The expense to render (presentation-ready). */
  expense: ExpenseListItem;
  /** Called when the row is pressed. */
  onPress?: () => void;
};

/**
 * A single tappable expense row: a soft category-tinted icon circle on the left,
 * the category label with an optional note in the middle, and the amount over a
 * date label on the right.
 *
 * Renders without a Card wrapper — callers group rows inside one shared Card or
 * a list. Memoized because History renders this in a long FlatList.
 */
export const ExpenseRow = memo(function ExpenseRow({ expense, onPress }: ExpenseRowProps) {
  const money = useMoney();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${expense.categoryLabel}, ${money(expense.amount)}, ${expense.dateLabel}`}
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
        <Text variant="bodyStrong">{money(expense.amount)}</Text>
        <Text variant="caption" color="tertiary">
          {expense.dateLabel}
        </Text>
      </View>
    </Pressable>
  );
});
