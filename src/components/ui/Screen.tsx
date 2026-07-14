import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors, SCREEN_PADDING } from '@/theme';

export type ScreenProps = ViewProps & {
  children: ReactNode;
  /** Apply the standard horizontal gutter. Default true. */
  padded?: boolean;
  /** Safe-area edges to inset. Default `['top']`. */
  edges?: Edge[];
  /** Background color. Default app background. */
  background?: string;
};

/**
 * Screen layout wrapper: applies safe-area insets, the app background and the
 * standard horizontal gutter so every screen starts from a consistent frame.
 */
export function Screen({
  children,
  padded = true,
  edges = ['top'],
  background = colors.background,
  style,
  ...rest
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: background }}>
      <View
        style={[{ flex: 1 }, padded ? { paddingHorizontal: SCREEN_PADDING } : null, style]}
        {...rest}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
