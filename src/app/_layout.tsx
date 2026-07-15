import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme';

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
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-expense" options={{ presentation: 'modal' }} />
          <Stack.Screen name="expense/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="salary" options={{ presentation: 'modal' }} />
          <Stack.Screen name="currency" options={{ presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
