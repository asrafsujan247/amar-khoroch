import { type ComponentProps, forwardRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type TabTriggerSlotProps } from 'expo-router/ui';

import { Text } from '@/components/ui';
import { colors } from '@/theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type TabButtonProps = TabTriggerSlotProps & {
  /** Icon shown when the tab is inactive. */
  icon: IoniconName;
  /** Icon shown when the tab is active (defaults to `icon`). */
  iconFocused?: IoniconName;
  /** Label shown under the icon. */
  label: string;
};

/**
 * A single bottom-tab button. Used as the `asChild` target of `TabTrigger`,
 * which injects `isFocused`, `onPress` and a ref via a slot. Active tabs render
 * in the brand color with the filled icon variant.
 */
export const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { icon, iconFocused, label, isFocused, href: _href, ...pressableProps },
  ref,
) {
  const color = isFocused ? colors.primary[600] : colors.ink[400];

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(isFocused) }}
      {...pressableProps}
      style={styles.button}
    >
      <Ionicons name={isFocused ? (iconFocused ?? icon) : icon} size={24} color={color} />
      <Text variant="overline" style={{ color, marginTop: 3 }}>
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});
