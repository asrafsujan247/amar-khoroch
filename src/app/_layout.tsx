import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme';

/**
 * Shared options for the app's modal routes (add/edit expense, salary,
 * currency). They slide up from the bottom, which reads as "a sheet over the
 * current screen" rather than a navigation push.
 */
const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'slide_from_bottom',
} as const;

/**
 * Root layout for the whole app.
 *
 * Wraps every route in the providers the app depends on:
 *  - GestureHandlerRootView: required by react-native-gesture-handler / Reanimated.
 *  - SafeAreaProvider: exposes safe-area insets to all screens.
 *
 * The route tree is a Stack containing the bottom-tab group `(tabs)` and the
 * `add-expense` screen presented as a modal over the tabs. Version 1 is
 * light-mode only, so the status bar is fixed to dark content.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            // Subtle, native-feeling push. Modals override this below.
            animation: 'slide_from_right',
            animationDuration: 260,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="add-expense" options={MODAL_OPTIONS} />
          <Stack.Screen name="expense/[id]" options={MODAL_OPTIONS} />
          <Stack.Screen name="salary" options={MODAL_OPTIONS} />
          <Stack.Screen name="currency" options={MODAL_OPTIONS} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
