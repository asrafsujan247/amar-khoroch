import { View } from 'react-native';

import { IconButton, Text } from '@/components/ui';
import { spacing } from '@/theme';

export type GreetingHeaderProps = {
  /** Time-based greeting, e.g. "Good evening". */
  greeting: string;
  /** Optional user name; appended to the greeting when present. */
  userName?: string;
  /** Current month label shown beneath the greeting, e.g. "July 2026". */
  monthLabel: string;
  /** Called when the settings button is pressed. */
  onPressSettings?: () => void;
};

/**
 * Top-of-screen dashboard header: a personalized greeting with the current
 * month on the left, and a soft settings button on the right. Renders without
 * a Card wrapper since it sits flush at the top of the screen.
 */
export function GreetingHeader({
  greeting,
  userName,
  monthLabel,
  onPressSettings,
}: GreetingHeaderProps) {
  const title = userName ? `${greeting}, ${userName}` : greeting;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1, marginRight: spacing.md }}>
        <Text variant="h2">{title}</Text>
        <Text variant="caption" color="secondary" style={{ marginTop: spacing.xs }}>
          {monthLabel}
        </Text>
      </View>

      <IconButton
        icon="settings-outline"
        variant="soft"
        accessibilityLabel="Settings"
        onPress={onPressSettings}
      />
    </View>
  );
}
