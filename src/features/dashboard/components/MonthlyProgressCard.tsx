import { View } from 'react-native';

import { Badge, Card, Divider, ProgressBar, Text, type BadgeTone } from '@/components/ui';
import { colors, spacing } from '@/theme';
import { formatCurrency } from '@/utils/currency';

export type MonthlyProgressCardProps = {
  /** Fraction of the budget consumed, 0–1, for the progress bar. */
  progress: number;
  /** Rounded percentage of salary spent (0–100+). */
  budgetPercentUsed: number;
  /** Average spend per elapsed day this month. */
  dailyAverage: number;
  /** Salary minus expenses — negative when overspent. */
  remaining: number;
};

/**
 * Monthly budget summary card. A tone-coded badge and progress fill escalate
 * from brand → warning → danger as spending approaches and passes the salary,
 * with a footer breaking out the daily average and remaining balance.
 */
export function MonthlyProgressCard({
  progress,
  budgetPercentUsed,
  dailyAverage,
  remaining,
}: MonthlyProgressCardProps) {
  const tone: BadgeTone =
    budgetPercentUsed < 75 ? 'brand' : budgetPercentUsed < 90 ? 'warning' : 'danger';
  const fillColor =
    budgetPercentUsed < 75
      ? colors.primary[500]
      : budgetPercentUsed < 90
        ? colors.warning.DEFAULT
        : colors.danger.DEFAULT;

  return (
    <Card>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="title">Monthly Budget</Text>
        <Badge label={`${budgetPercentUsed}% used`} tone={tone} />
      </View>

      <ProgressBar progress={progress} fillColor={fillColor} style={{ marginTop: spacing.md }} />

      <Divider style={{ marginTop: spacing.lg, marginBottom: spacing.lg }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text variant="caption" color="secondary">
            Daily Average
          </Text>
          <Text variant="subtitle" style={{ marginTop: spacing.xs }}>
            {formatCurrency(dailyAverage)}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text variant="caption" color="secondary">
            Remaining
          </Text>
          <Text
            variant="subtitle"
            color={remaining < 0 ? 'danger' : 'default'}
            style={{ marginTop: spacing.xs }}
          >
            {formatCurrency(remaining)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
