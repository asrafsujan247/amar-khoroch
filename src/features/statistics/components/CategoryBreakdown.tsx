import { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, EmptyState, ProgressBar, Text } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { type CategorySlice } from '@/features/statistics/types';
import { formatCurrency } from '@/utils/currency';

export type CategoryBreakdownProps = {
  /** Categories with spending this month. Rendered highest-first; never mutated. */
  slices: CategorySlice[];
};

/**
 * The legend and table view for the Statistics donut chart: one labeled row per
 * category, ranked highest-spend first.
 *
 * This list is an accessibility dependency, not a decoration. Slots 1, 3 and 5 of
 * the categorical palette sit below 3:1 contrast on white, so the donut is only
 * legible because every category also appears here with a visible icon, text
 * label and value — identity is never carried by color alone.
 *
 * Two invariants hold the data-viz contract together:
 * - Ranking sorts a *copy*; the incoming `slices` array is never mutated, since
 *   its fixed `CATEGORIES` order is what keeps donut colors stable.
 * - Color follows the entity, never its rank — a slice's color is passed through
 *   untouched, and only the chip and bar wear it. Text stays on ink tokens.
 */
export function CategoryBreakdown({ slices }: CategoryBreakdownProps) {
  const ranked = useMemo(() => [...slices].sort((a, b) => b.total - a.total), [slices]);

  return (
    <Card>
      <Text variant="title">Category Breakdown</Text>

      {ranked.length === 0 ? (
        <EmptyState
          icon="list-outline"
          title="Nothing to break down"
          description="Add an expense to see where your money goes."
        />
      ) : (
        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          {ranked.map((slice) => {
            const percent = Math.round(slice.percent);

            return (
              <View
                key={slice.id}
                accessible
                accessibilityLabel={`${slice.label}, ${formatCurrency(slice.total)}, ${percent}% of spending`}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: radii.md,
                      backgroundColor: `${slice.color}1F`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={slice.icon} size={16} color={slice.color} />
                  </View>

                  <Text
                    variant="subtitle"
                    numberOfLines={1}
                    style={{ flex: 1, marginLeft: spacing.md }}
                  >
                    {slice.label}
                  </Text>

                  <View style={{ alignItems: 'flex-end', marginLeft: spacing.sm }}>
                    <Text variant="subtitle">{formatCurrency(slice.total)}</Text>
                    <Text variant="caption" color="secondary">
                      {`${percent}%`}
                    </Text>
                  </View>
                </View>

                <ProgressBar
                  progress={slice.percent / 100}
                  height={6}
                  fillColor={slice.color}
                  trackColor={colors.ink[100]}
                  style={{ marginTop: spacing.sm }}
                />
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}
