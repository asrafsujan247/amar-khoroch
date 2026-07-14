import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, Text } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { type IoniconName } from '@/features/dashboard/types';

export type StatTileProps = {
  /** Caption beneath the value, e.g. "Spent today". */
  label: string;
  /** Pre-formatted value string — rendered verbatim by this tile. */
  value: string;
  /** Ionicons glyph shown in the chip. */
  icon: IoniconName;
  /** Icon glyph color. Default `colors.primary[600]`. */
  iconColor?: string;
  /** Icon chip background color. Default `colors.primary[50]`. */
  iconBgColor?: string;
};

/**
 * Compact metric tile designed to sit in a row — wrap it in a `flex: 1`
 * container rather than giving it a fixed width. Shows an icon chip above a
 * headline value and a caption label. The `value` is already formatted by the
 * caller, so it is displayed as-is.
 */
export function StatTile({
  label,
  value,
  icon,
  iconColor = colors.primary[600],
  iconBgColor = colors.primary[50],
}: StatTileProps) {
  return (
    <Card>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radii.md,
          backgroundColor: iconBgColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <Text variant="h2" style={{ marginTop: spacing.md }}>
        {value}
      </Text>
      <Text variant="caption" color="secondary" style={{ marginTop: spacing.xs }}>
        {label}
      </Text>
    </Card>
  );
}
