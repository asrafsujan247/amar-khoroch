import type React from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/Text';
import { colors, radii, type TypographyVariant } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type ChipProps = {
  /** Pill text. */
  label: string;
  /** Selected (filled brand) state. */
  selected?: boolean;
  /** Press handler (ignored when `disabled`). */
  onPress?: () => void;
  /** Leading Ionicons glyph. */
  leftIcon?: IoniconName;
  /** Disable presses and dim the pill. */
  disabled?: boolean;
  /** Size preset. Default `'md'`. */
  size?: 'sm' | 'md';
  /** Extra style merged onto the pill container. */
  style?: StyleProp<ViewStyle>;
};

const SIZES: Record<
  NonNullable<ChipProps['size']>,
  { height: number; paddingHorizontal: number; variant: TypographyVariant; iconSize: number }
> = {
  sm: { height: 32, paddingHorizontal: 12, variant: 'caption', iconSize: 14 },
  md: { height: 40, paddingHorizontal: 16, variant: 'callout', iconSize: 16 },
};

/**
 * A selectable pill used for category selection and history filters. Selected
 * pills fill with brand teal; unselected ones are bordered surfaces. Purely
 * state-driven color changes plus a subtle press opacity — no animation.
 */
export function Chip({
  label,
  selected = false,
  onPress,
  leftIcon,
  disabled = false,
  size = 'md',
  style,
}: ChipProps) {
  const s = SIZES[size];
  const contentColor = selected ? colors.white : colors.ink[700];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: radii.full,
          borderWidth: selected ? 0 : 1,
          borderColor: colors.ink[200],
          backgroundColor: selected ? colors.primary[500] : colors.surface,
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {leftIcon ? <Ionicons name={leftIcon} size={s.iconSize} color={contentColor} /> : null}
      <Text variant={s.variant} weight="semibold" style={{ color: contentColor }}>
        {label}
      </Text>
    </Pressable>
  );
}
