import { type ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { colors, radii, shadows } from '@/theme';

/** Ionicons glyph name — the full, type-safe set of available icons. */
type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type FABProps = {
  /** Ionicons name to render. Default `add`. */
  icon?: IoniconName;
  /** Press handler. */
  onPress?: () => void;
  /** When provided, renders an extended (pill) FAB with this label beside the icon. */
  label?: string;
  /** Screen-reader label. Falls back to `label`, then `"Add"`. */
  accessibilityLabel?: string;
  /** Style override applied last — the screen positions the FAB via this prop. */
  style?: StyleProp<ViewStyle>;
};

const SIZE = 56;
const ICON_SIZE = 24;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Floating action button for the primary screen action. Brand-colored with a
 * soft `lg` elevation; a circular 56×56 by default, or an extended pill when a
 * `label` is supplied. Intentionally not absolutely positioned — the screen
 * places it via `style`. Includes a subtle press-in scale.
 */
export function FAB({ icon = 'add', onPress, label, accessibilityLabel, style }: FABProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 90 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const extended = label != null && label.length > 0;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Add'}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.base,
        shadows.lg,
        extended ? styles.extended : styles.circular,
        animatedStyle,
        style,
      ]}
    >
      <Ionicons name={icon} size={ICON_SIZE} color={colors.white} />
      {extended ? (
        <Text variant="subtitle" color="inverse">
          {label}
        </Text>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: SIZE,
    backgroundColor: colors.primary[500],
  },
  circular: {
    width: SIZE,
    borderRadius: SIZE / 2,
  },
  extended: {
    paddingHorizontal: 20,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
});
