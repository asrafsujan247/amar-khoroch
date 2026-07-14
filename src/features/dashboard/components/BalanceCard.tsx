import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ProgressBar, Text } from '@/components/ui';
import { radii, shadows, spacing } from '@/theme';
import { formatCurrency } from '@/utils/currency';

export type BalanceCardProps = {
  /** Money left this month (salary − spent). May be negative when overspent. */
  remaining: number;
  /** Total salary / budget for the month. */
  salary: number;
  /** Amount spent so far this month. */
  spent: number;
};

/** Translucent white used for supporting text/icons on the gradient. */
const SOFT_WHITE = 'rgba(255,255,255,0.85)';
const SOFTER_WHITE = 'rgba(255,255,255,0.9)';

/**
 * The premium hero card of the dashboard: remaining balance rendered as white
 * text over a diagonal brand gradient, with a slim spent/salary progress bar.
 * The LinearGradient is the surface itself, so this is not wrapped in a Card.
 */
export function BalanceCard({ remaining, salary, spent }: BalanceCardProps) {
  const progress = salary > 0 ? spent / salary : 0;

  return (
    <LinearGradient
      colors={['#00E0BA', '#00A48C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderRadius: radii['3xl'],
          padding: 20,
          overflow: 'hidden',
        },
        shadows.lg,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="overline" style={{ color: SOFT_WHITE }}>
          REMAINING BALANCE
        </Text>
        <Ionicons name="wallet-outline" size={22} color={SOFT_WHITE} />
      </View>

      <Text variant="display" color="inverse" style={{ marginTop: spacing.sm }}>
        {formatCurrency(remaining)}
      </Text>

      <ProgressBar
        progress={progress}
        trackColor="rgba(255,255,255,0.25)"
        fillColor="#FFFFFF"
        height={8}
        style={{ marginTop: spacing.lg }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: spacing.md,
        }}
      >
        <Text variant="caption" style={{ color: SOFTER_WHITE }}>
          {`Spent ${formatCurrency(spent)}`}
        </Text>
        <Text variant="caption" style={{ color: SOFTER_WHITE }}>
          {`Salary ${formatCurrency(salary)}`}
        </Text>
      </View>
    </LinearGradient>
  );
}
