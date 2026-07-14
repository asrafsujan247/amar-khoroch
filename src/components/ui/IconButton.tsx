import { type ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors } from '@/theme';

/** Ionicons glyph name — the full, type-safe set of available icons. */
type IoniconName = ComponentProps<typeof Ionicons>['name'];

/** Visual weight of the icon button. */
export type IconButtonVariant = 'solid' | 'soft' | 'ghost';

export type IconButtonProps = {
  /** Ionicons name to render. */
  icon: IoniconName;
  /** Press handler. Ignored while `disabled`. */
  onPress?: () => void;
  /** Screen-reader label (required — the button has no visible text). */
  accessibilityLabel: string;
  /** Circular container size in px. Default 44. */
  size?: number;
  /** Icon glyph size in px. Defaults to half the container size. */
  iconSize?: number;
  /** Visual intent. Default `soft`. */
  variant?: IconButtonVariant;
  /** Override the icon color (wins over the variant default). */
  color?: string;
  /** Dim and disable the button. */
  disabled?: boolean;
  /** Style override applied last. */
  style?: StyleProp<ViewStyle>;
};

type VariantStyle = { bg: string; icon: string };

/** Background + icon color per variant. */
const VARIANTS: Record<IconButtonVariant, VariantStyle> = {
  solid: { bg: colors.primary[500], icon: colors.white },
  soft: { bg: colors.primary[50], icon: colors.primary[700] },
  ghost: { bg: 'transparent', icon: colors.ink[700] },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Circular, icon-only button for toolbars and compact actions. Style-driven
 * from theme tokens with a subtle press-in scale. Requires an
 * `accessibilityLabel` since it renders no visible text, and grows its touch
 * target with `hitSlop` for small sizes.
 */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 44,
  iconSize,
  variant = 'soft',
  color,
  disabled = false,
  style,
}: IconButtonProps) {
  const v = VARIANTS[variant];
  const glyphSize = iconSize ?? Math.round(size * 0.5);
  const interactive = !disabled;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 90 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  // Pad the touch target out to a comfortable ~48px minimum for small buttons.
  const slop = Math.max(0, Math.round((48 - size) / 2));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={!interactive}
      hitSlop={slop}
      onPress={interactive ? onPress : undefined}
      onPressIn={interactive ? handlePressIn : undefined}
      onPressOut={interactive ? handlePressOut : undefined}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: v.bg,
        },
        interactive ? null : styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      <Ionicons name={icon} size={glyphSize} color={color ?? v.icon} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
});
