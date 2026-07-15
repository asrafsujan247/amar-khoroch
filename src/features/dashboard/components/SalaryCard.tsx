import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button, Card, Text } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { useMoney } from '@/hooks/useMoney';

export type SalaryCardProps = {
  /** Monthly salary amount in Taka. Ignored when `isSet` is false. */
  salary: number;
  /** Whether a salary has been set for the current month. */
  isSet: boolean;
  /** Current month label, e.g. "July 2026". */
  monthLabel: string;
  /** Opens the salary entry / edit modal. */
  onEdit?: () => void;
};

const IconChip = () => (
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
);

/**
 * Headline dashboard card for the user's monthly salary. When a salary is set,
 * it shows the amount with an inline "Edit" action; when it is not, it shows a
 * prominent "Set salary" call-to-action so the once-a-month entry is obvious.
 */
export function SalaryCard({ salary, isSet, monthLabel, onEdit }: SalaryCardProps) {
  const money = useMoney();

  if (!isSet) {
    return (
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconChip />
          <View style={{ flex: 1, marginLeft: spacing.md, gap: 2 }}>
            <Text variant="overline" color="tertiary">
              MONTHLY SALARY
            </Text>
            <Text variant="subtitle" color="secondary">
              Not set for {monthLabel}
            </Text>
          </View>
        </View>
        <Button
          title="Set salary"
          leftIcon="add"
          onPress={onEdit}
          fullWidth
          style={{ marginTop: spacing.lg }}
        />
      </Card>
    );
  }

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconChip />

        <View style={{ flex: 1, marginLeft: spacing.md, gap: 2 }}>
          <Text variant="overline" color="tertiary">
            MONTHLY SALARY
          </Text>
          <Text variant="h2">{money(salary)}</Text>
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
