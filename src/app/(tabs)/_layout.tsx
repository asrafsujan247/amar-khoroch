import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '@/components/navigation/TabButton';
import { colors, radii, shadows } from '@/theme';

/**
 * Central elevated "Add" button. It is NOT a tab route — it opens the
 * `add-expense` modal — so it renders as a plain pressable inside the tab bar
 * (the headless Tabs router ignores non-`TabTrigger` children when building
 * routes).
 */
function CenterAddButton() {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.centerSlot}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add expense"
        onPressIn={() => {
          scale.value = withTiming(0.92, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 140 });
        }}
        onPress={() => router.push('/add-expense')}
      >
        <Animated.View style={[styles.fab, animatedStyle]}>
          <Ionicons name="add" size={30} color={colors.white} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

/**
 * Bottom-tab navigation built on Expo Router's headless `expo-router/ui` Tabs.
 * Four destinations (Home, Stats, History, Settings) flank a central Add FAB.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />

      <TabList style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TabTrigger name="index" href="/" asChild>
          <TabButton icon="home-outline" iconFocused="home" label="Home" />
        </TabTrigger>

        <TabTrigger name="statistics" href="/statistics" asChild>
          <TabButton icon="stats-chart-outline" iconFocused="stats-chart" label="Stats" />
        </TabTrigger>

        <CenterAddButton />

        <TabTrigger name="history" href="/history" asChild>
          <TabButton icon="time-outline" iconFocused="time" label="History" />
        </TabTrigger>

        <TabTrigger name="settings" href="/settings" asChild>
          <TabButton icon="settings-outline" iconFocused="settings" label="Settings" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slot: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.ink[200],
    ...shadows.lg,
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: radii.full,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    // Lift the FAB above the bar and give it a ring so it reads as elevated.
    marginTop: -28,
    borderWidth: 4,
    borderColor: colors.background,
    ...shadows.lg,
  },
});
