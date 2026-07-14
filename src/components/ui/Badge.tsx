import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, type TypographyVariant } from '@/theme';
import { Text } from '@/components/ui/Text';

/** Semantic color intent for a badge. */
export type BadgeTone = 'neutral' | 'brand' | 'success' | 'danger' | 'warning' | 'info';

/** Badge sizing preset. */
export type BadgeSize = 'sm' | 'md';

export type BadgeProps = {
  /** Text shown inside the pill. */
  label: string;
  /** Color intent. Default `neutral`. */
  tone?: BadgeTone;
  /** Size preset. Default `sm`. */
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
};

const toneMap: Record<BadgeTone, { bg: string; text: string }> = {
  neutral: { bg: colors.ink[100], text: colors.ink[700] },
  brand: { bg: colors.primary[50], text: colors.primary[700] },
  success: { bg: colors.success.light, text: colors.success.dark },
  danger: { bg: colors.danger.light, text: colors.danger.dark },
  warning: { bg: colors.warning.light, text: colors.warning.dark },
  info: { bg: colors.info.light, text: colors.info.dark },
};

const sizeMap: Record<
  BadgeSize,
  { paddingHorizontal: number; paddingVertical: number; variant: TypographyVariant }
> = {
  sm: { paddingHorizontal: 8, paddingVertical: 2, variant: 'label' },
  md: { paddingHorizontal: 12, paddingVertical: 4, variant: 'label' },
};

/**
 * Compact status pill built on the `Text` primitive. `tone` maps to a
 * background tint + readable text color from the semantic palette.
 */
export function Badge({ label, tone = 'neutral', size = 'sm', style }: BadgeProps) {
  const { bg, text } = toneMap[tone];
  const { paddingHorizontal, paddingVertical, variant } = sizeMap[size];

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: bg,
          borderRadius: radii.full,
          paddingHorizontal,
          paddingVertical,
        },
        style,
      ]}
    >
      <Text variant={variant} style={{ color: text }}>
        {label}
      </Text>
    </View>
  );
}
