import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button, Card, Text } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { formatCurrency } from '@/utils/currency';

export type SalaryCardProps = {
  /** Monthly salary amount in Taka. */
  salary: number;
  /** Current month label, e.g. "July 2026". */
  monthLabel: string;
  /** Called when the Edit button is pressed. */
  onEdit?: () => void;
};

/**
 * Headline dashboard card for the user's monthly salary. A soft brand icon
 * chip sits beside the amount, with an inline "Edit" action on the right so
 * the salary can be adjusted without leaving the dashboard.
 */
export function SalaryCard({ salary, monthLabel, onEdit }: SalaryCardProps) {
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radii.md,
            backgroundColor: colors.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="wallet-outline" size={22} color={colors.primary[600]} />
        </View>

        <View style={{ flex: 1, marginLeft: spacing.md, gap: 2 }}>
          <Text variant="overline" color="tertiary">
            MONTHLY SALARY
          </Text>
          <Text variant="h2">{formatCurrency(salary)}</Text>
          <Text variant="caption" color="secondary">
            {monthLabel}
          </Text>
        </View>

        <Button
          title="Edit"
          variant="secondary"
          size="sm"
          leftIcon="pencil"
          onPress={onEdit}
          style={{ marginLeft: spacing.md, alignSelf: 'center' }}
        />
      </View>
    </Card>
  );
}
