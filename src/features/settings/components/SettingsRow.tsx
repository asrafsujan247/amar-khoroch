import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { type IoniconName } from '@/types/icon';

export type SettingsRowProps = {
  /** Leading glyph shown inside the tinted chip. */
  icon: IoniconName;
  /** Glyph color. Defaults to `colors.primary[600]`, or danger when `destructive`. */
  iconColor?: string;
  /** Chip background. Defaults to `colors.primary[50]`, or danger light when `destructive`. */
  iconBgColor?: string;
  /** Primary line of the row. */
  label: string;
  /** Optional secondary line under the label. */
  description?: string;
  /** Optional right-aligned current value, e.g. "৳ Bangladeshi Taka". */
  value?: string;
  /** Press handler. Omit to render a static, non-tappable row. */
  onPress?: () => void;
  /** Show the trailing chevron. Defaults to true when `onPress` is provided. */
  showChevron?: boolean;
  /** Render the icon and label in danger colors (e.g. "Reset App"). Default false. */
  destructive?: boolean;
  /** Dim the row and block presses. Default false. */
  disabled?: boolean;
  /** Custom right-hand control (e.g. a Switch). Replaces `value` and the chevron. */
  rightElement?: ReactNode;
};

/**
 * A single settings line: a rounded icon chip, a label with an optional
 * description, and a right side that is either a custom control, a value, a
 * chevron, or nothing.
 *
 * The chip / text / right side sit in an inner row `View` (with an inline style)
 * rather than being laid out by the outer pressable — that keeps the horizontal
 * layout robust. Renders without a Card wrapper: `SettingsSection` groups rows
 * inside one shared Card and inserts the dividers. A row is only tappable when
 * `onPress` is given and it is not `disabled`; otherwise it renders as a plain
 * View with no chevron, so it never advertises an interaction it does not have.
 */
export function SettingsRow({
  icon,
  iconColor,
  iconBgColor,
  label,
  description,
  value,
  onPress,
  showChevron,
  destructive = false,
  disabled = false,
  rightElement,
}: SettingsRowProps) {
  const glyphColor = iconColor ?? (destructive ? colors.danger.DEFAULT : colors.primary[600]);
  const chipColor = iconBgColor ?? (destructive ? colors.danger.light : colors.primary[50]);

  const hasRightElement = rightElement !== undefined;
  const chevronVisible = (showChevron ?? onPress !== undefined) && !hasRightElement;
  const accessibilityLabel = value === undefined ? label : `${label}, ${value}`;

  const row = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radii.md,
          backgroundColor: chipColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={18} color={glyphColor} />
      </View>

      <View style={{ flex: 1, marginLeft: spacing.md, gap: 2 }}>
        <Text variant="subtitle" color={destructive ? 'danger' : 'default'}>
          {label}
        </Text>
        {description ? (
          <Text variant="caption" color="secondary">
            {description}
          </Text>
        ) : null}
      </View>

      {hasRightElement ? (
        <View style={{ marginLeft: spacing.sm }}>{rightElement}</View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            marginLeft: spacing.sm,
          }}
        >
          {value ? (
            <Text variant="caption" color="secondary" numberOfLines={1} style={{ flexShrink: 1 }}>
              {value}
            </Text>
          ) : null}
          {chevronVisible ? (
            <Ionicons name="chevron-forward" size={16} color={colors.ink[400]} />
          ) : null}
        </View>
      )}
    </View>
  );

  if (onPress === undefined) {
    return (
      <View accessibilityState={{ disabled }} style={disabled ? { opacity: 0.5 } : undefined}>
        {row}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.6 : 1 })}
    >
      {row}
    </Pressable>
  );
}
