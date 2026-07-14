import React, { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '@/theme';
import { Text } from '@/components/ui/Text';

export type EmptyStateProps = {
  /** Ionicons glyph shown in the soft circle. Default `file-tray-outline`. */
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  /** Primary heading. */
  title: string;
  /** Optional supporting copy. */
  description?: string;
  /** Optional call-to-action rendered below the text (e.g. a button). */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Centered placeholder shown when a list or screen has no content. Pairs an
 * iconed circle with a title, optional description and an optional action.
 */
export function EmptyState({
  icon = 'file-tray-outline',
  title,
  description,
  action,
  style,
}: EmptyStateProps) {
  return (
    <View
      style={[
        { alignItems: 'center', paddingVertical: spacing['4xl'], paddingHorizontal: spacing.xl },
        style,
      ]}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.primary[50],
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <Ionicons name={icon} size={32} color={colors.primary[600]} />
      </View>

      <Text variant="subtitle" center>
        {title}
      </Text>

      {description ? (
        <Text variant="body" color="secondary" center style={{ marginTop: spacing.sm }}>
          {description}
        </Text>
      ) : null}

      {action ? <View style={{ marginTop: spacing.xl }}>{action}</View> : null}
    </View>
  );
}
