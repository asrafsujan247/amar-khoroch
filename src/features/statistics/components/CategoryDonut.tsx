import { View } from 'react-native';
import { PieChart, type pieDataItem } from 'react-native-gifted-charts';

import { Card, EmptyState, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';
import { type CategorySlice } from '@/features/statistics/types';
import { useMoney } from '@/hooks/useMoney';

/** Outer radius of the donut, in px. */
const RADIUS = 90;
/** ~60% of `RADIUS` — leaves a comfortable ring while keeping room for the center label. */
const INNER_RADIUS = 54;
/** Surface-colored gap so neighbouring slice fills never touch. */
const SLICE_GAP = 2;

export type CategoryDonutProps = {
  /**
   * Categories with spending, in the fixed `CATEGORIES` slot order.
   *
   * Rendered in the exact order given — see the ordering invariant on the
   * component below.
   */
  slices: CategorySlice[];
  /** The month's total spending, shown in the center of the donut. */
  total: number;
};

/**
 * Monthly spending broken down by category, as a donut with the month's total
 * in the center.
 *
 * Two invariants this component must preserve:
 *
 * 1. `slices` is rendered in the order received and is NEVER sorted. Slice color
 *    follows the category entity, not its rank, and the categorical palette's
 *    colour-vision safety was validated against that specific adjacency order
 *    (see `colors.categorical`). Sorting would silently break both.
 * 2. Colors come only from `slice.color`. Nothing here recolours a slice or
 *    generates a hue, and text wears ink tokens rather than the series color.
 *
 * Slices are intentionally unlabeled: the category breakdown list that
 * accompanies this chart is the legend, and it carries the per-category values
 * that palette slots below 3:1 contrast on white require.
 */
export function CategoryDonut({ slices, total }: CategoryDonutProps) {
  const money = useMoney();
  return (
    <Card>
      <View>
        <Text variant="title">Spending by Category</Text>
      </View>

      {slices.length === 0 ? (
        <EmptyState
          icon="pie-chart-outline"
          title="No spending yet"
          description="Add an expense to see your category breakdown."
        />
      ) : (
        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <PieChart
            data={slices.map<pieDataItem>((s) => ({ value: s.total, color: s.color }))}
            donut
            radius={RADIUS}
            innerRadius={INNER_RADIUS}
            innerCircleColor={colors.surface}
            strokeColor={colors.surface}
            strokeWidth={SLICE_GAP}
            centerLabelComponent={() => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text variant="h2">{money(total)}</Text>
                <Text variant="caption" color="secondary">
                  Total
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </Card>
  );
}
