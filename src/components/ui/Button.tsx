import { type ComponentProps } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { colors, radii, type TypographyVariant } from '@/theme';

/** Ionicons glyph name — the full, type-safe set of available icons. */
type IoniconName = ComponentProps<typeof Ionicons>['name'];

/** Visual weight / intent of the button. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/** Control size (drives height, padding and label typography). */
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  /** Label rendered via the `Text` primitive. */
  title: string;
  /** Press handler. Ignored while `loading` or `disabled`. */
  onPress?: () => void;
  /** Visual intent. Default `primary`. */
  variant?: ButtonVariant;
  /** Control size. Default `md`. */
  size?: ButtonSize;
  /** Show a spinner in place of the label and block interaction. */
  loading?: boolean;
  /** Dim and disable the button. */
  disabled?: boolean;
  /** Ionicons name rendered before the label. */
  leftIcon?: IoniconName;
  /** Ionicons name rendered after the label. */
  rightIcon?: IoniconName;
  /** Stretch to fill the parent's cross axis. */
  fullWidth?: boolean;
  /** Style override applied last. */
  style?: StyleProp<ViewStyle>;
};

type VariantStyle = { bg: string; content: string; solid: boolean };

/** Background + content (icon/label) color per variant. `solid` variants use inverse text. */
const VARIANTS: Record<ButtonVariant, VariantStyle> = {
  primary: { bg: colors.primary[500], content: colors.white, solid: true },
  secondary: { bg: colors.primary[50], content: colors.primary[700], solid: false },
  ghost: { bg: 'transparent', content: colors.ink[700], solid: false },
  danger: { bg: colors.danger.DEFAULT, content: colors.white, solid: true },
};

type SizeStyle = {
  height: number;
  paddingHorizontal: number;
  text: TypographyVariant;
  icon: number;
};

const SIZES: Record<ButtonSize, SizeStyle> = {
  sm: { height: 44, paddingHorizontal: 16, text: 'callout', icon: 18 },
  md: { height: 52, paddingHorizontal: 20, text: 'subtitle', icon: 20 },
  lg: { height: 56, paddingHorizontal: 24, text: 'title', icon: 22 },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Primary action button for the app. Style-driven from theme tokens so every
 * button shares the same rounded, tactile look. Solid variants render inverse
 * (white) content; soft/ghost variants render tinted content. A subtle
 * press-in scale gives tactile feedback and is disabled while non-interactive.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const interactive = !disabled && !loading;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 90 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const indicatorColor = v.solid ? colors.white : colors.primary[500];

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={!interactive}
      onPress={interactive ? onPress : undefined}
      onPressIn={interactive ? handlePressIn : undefined}
      onPressOut={interactive ? handlePressOut : undefined}
      style={[
        styles.base,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          backgroundColor: v.bg,
          borderRadius: radii.xl,
        },
        fullWidth ? styles.fullWidth : styles.hug,
        interactive ? null : styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <>
          {leftIcon ? <Ionicons name={leftIcon} size={s.icon} color={v.content} /> : null}
          <Text
            variant={s.text}
            color={v.solid ? 'inverse' : 'default'}
            numberOfLines={1}
            style={v.solid ? undefined : { color: v.content }}
          >
            {title}
          </Text>
          {rightIcon ? <Ionicons name={rightIcon} size={s.icon} color={v.content} /> : null}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  hug: { alignSelf: 'flex-start' },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
});
