import { type ComponentProps } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { EmptyState, Screen, Text } from '@/components/ui';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type ComingSoonProps = {
  /** Screen title shown in the header. */
  title: string;
  /** Illustrative icon. */
  icon: IoniconName;
  /** Short description of what will live here. */
  description: string;
};

/**
 * Temporary placeholder for screens that are wired into navigation (Milestone 3)
 * but implemented in later milestones. Keeps all stub screens consistent and
 * avoids duplicated markup; each screen is swapped for its real UI later.
 */
export function ComingSoon({ title, icon, description }: ComingSoonProps) {
  return (
    <Screen>
      <Text variant="h1" style={{ marginTop: 8 }}>
        {title}
      </Text>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState icon={icon} title={`${title} coming soon`} description={description} />
      </View>
    </Screen>
  );
}
