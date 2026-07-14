import { router } from 'expo-router';
import { View } from 'react-native';

import { EmptyState, IconButton, Screen, Text } from '@/components/ui';

/**
 * Add Expense screen, presented as a modal over the tabs. The fast-entry form
 * (amount, category, date, note) is built in Milestone 6; this milestone only
 * wires the modal into navigation.
 */
export default function AddExpenseScreen() {
  return (
    <Screen edges={['top', 'bottom']}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Text variant="h2">Add Expense</Text>
        <IconButton
          icon="close"
          accessibilityLabel="Close"
          variant="soft"
          onPress={() => router.back()}
        />
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState
          icon="add-circle-outline"
          title="Expense form coming soon"
          description="The amount, category, date and note fields arrive in Milestone 6."
        />
      </View>
    </Screen>
  );
}
