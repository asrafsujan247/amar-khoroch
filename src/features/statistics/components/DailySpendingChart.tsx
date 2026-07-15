import { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { LineChart, ruleTypes, type lineDataItem } from 'react-native-gifted-charts';

import { Card, EmptyState, Text } from '@/components/ui';
import { colors, spacing, SCREEN_PADDING } from '@/theme';
import { type DailyPoint } from '@/features/statistics/types';
import { formatCurrency } from '@/utils/currency';

/** Plot height in px — a wide, shallow aspect keeps the trend readable without dominating the card. */
const CHART_HEIGHT = 180;

/** Horizontal y-axis gutter. Sized for the widest compact label (e.g. "12.5K"). */
const Y_AXIS_LABEL_WIDTH = 44;

/** Hairline weight shared by both axes and the horizontal rules. */
const AXIS_THICKNESS = 1;

/**
 * Axis label size. Deliberately below `typography.caption` (13): axis text is
 * reference material, not content, and must stay recessive. The chart renders
 * this text internally, so it takes a style object rather than the `Text`
 * primitive — the ink color token is what keeps it consistent with the app.
 */
const AXIS_LABEL_FONT_SIZE = 11;

/** Gap between the y-axis and the first point, so day 1 never sits on the axis. */
const INITIAL_SPACING = 12;

/** Horizontal rules drawn across the plot, including the origin. */
const Y_AXIS_SECTIONS = 4;

/**
 * Lowest chart width we will ever ask for. Only reachable on hardware narrower
 * than ~237px (none in practice); exists so a freak measurement can never yield
 * a negative width and invert the line's geometry.
 */
const MIN_CHART_WIDTH = 120;

/** Brand-tinted area fill. Kept faint so the fill reads as support, not as a second mark. */
const AREA_START_OPACITY = 0.18;
const AREA_END_OPACITY = 0.02;

/**
 * Round `value` up to a "nice" axis maximum that divides evenly into `sections`.
 *
 * gifted-charts' own default only rounds up to the next multiple of 10, which
 * across 4 sections produces ragged ticks (1234 -> 1240 -> steps of 310). This
 * snaps the step to a 1/2/5 x 10^n progression so labels land on round money.
 */
function niceAxisMax(value: number, sections: number): number {
  if (!Number.isFinite(value) || value <= 0) return sections;

  const roughStep = value / sections;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;
  const niceStep = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;

  return niceStep * magnitude * sections;
}

export type DailySpendingChartProps = {
  /** One point per day of the month, in day order. */
  data: DailyPoint[];
};

/**
 * The month's spending plotted day by day, as a smoothed area line.
 *
 * A single series, so there is no legend — the card title names the measure.
 * Two things this component deliberately does NOT do:
 *
 * 1. It never labels individual points. At ~30 points per month the values
 *    would collide into noise; the y-axis carries the scale instead, and only
 *    every 5th day (plus day 1) gets an x label for the same reason.
 * 2. It never lets the grid compete with the data. Rules and axes are drawn in
 *    `ink-200` hairlines and axis text in `ink-400`, leaving the brand teal as
 *    the only saturated thing in the frame.
 *
 * Data points are hidden rather than drawn: a full month compresses to roughly
 * 7px between points, at which spacing even 3px markers merge into a blob along
 * the line. The curve alone carries the trend.
 */
export function DailySpendingChart({ data }: DailySpendingChartProps) {
  const { width: windowWidth } = useWindowDimensions();

  /**
   * The chart's `width` is the PLOT area only — gifted-charts positions the plot
   * at `marginLeft: yAxisLabelWidth + yAxisThickness`, so the y-axis gutter sits
   * outside this number and must be subtracted for the chart to fit the card.
   */
  const chartWidth = Math.max(
    MIN_CHART_WIDTH,
    windowWidth - SCREEN_PADDING * 2 - spacing.lg * 2 - Y_AXIS_LABEL_WIDTH - AXIS_THICKNESS,
  );

  const hasSpending = data.length > 0 && data.some((point) => point.total > 0);

  const chartData = useMemo<lineDataItem[]>(
    () =>
      data.map((point) => ({
        value: point.total,
        label: point.day === 1 || point.day % 5 === 0 ? String(point.day) : '',
      })),
    [data],
  );

  const maxValue = useMemo(
    () => niceAxisMax(Math.max(...data.map((point) => point.total), 0), Y_AXIS_SECTIONS),
    [data],
  );

  return (
    <Card>
      <View>
        <Text variant="title">Daily Spending</Text>
      </View>

      {!hasSpending ? (
        <EmptyState
          icon="trending-up-outline"
          title="No spending yet"
          description="Your daily spending will chart here."
        />
      ) : (
        <View style={{ marginTop: spacing.lg }}>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={CHART_HEIGHT}
            adjustToWidth
            initialSpacing={INITIAL_SPACING}
            disableScroll
            // Series: one thin brand-colored curve over a faint brand wash.
            thickness={2}
            color={colors.primary[500]}
            curved
            hideDataPoints
            areaChart
            startFillColor={colors.primary[500]}
            endFillColor={colors.primary[500]}
            startOpacity={AREA_START_OPACITY}
            endOpacity={AREA_END_OPACITY}
            // Scale.
            maxValue={maxValue}
            noOfSections={Y_AXIS_SECTIONS}
            // Recessive grid and axes.
            rulesType={ruleTypes.SOLID}
            rulesColor={colors.ink[200]}
            rulesThickness={AXIS_THICKNESS}
            xAxisColor={colors.ink[200]}
            xAxisThickness={AXIS_THICKNESS}
            yAxisColor={colors.ink[200]}
            yAxisThickness={AXIS_THICKNESS}
            yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
            yAxisTextStyle={{ color: colors.ink[400], fontSize: AXIS_LABEL_FONT_SIZE }}
            xAxisLabelTextStyle={{ color: colors.ink[400], fontSize: AXIS_LABEL_FONT_SIZE }}
            formatYLabel={(label: string) =>
              formatCurrency(Number(label), { compact: true, showSymbol: false })
            }
          />
        </View>
      )}
    </Card>
  );
}
