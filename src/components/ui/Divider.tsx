import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

export type DividerProps = {
  /** Line direction. Default `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Line color. Default `colors.ink[200]`. */
  color?: string;
  /** Line thickness in px. Default 1. */
  thickness?: number;
  /** Margin applied along the main axis (px). Default 0. */
  inset?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * A thin separator line. Horizontal fills its container's width; vertical
 * stretches to the parent's height. `inset` adds margin along the main axis.
 */
export function Divider({
  orientation = 'horizontal',
  color = colors.ink[200],
  thickness = 1,
  inset = 0,
  style,
}: DividerProps) {
  const base: ViewStyle =
    orientation === 'horizontal'
      ? { width: '100%', height: thickness, marginHorizontal: inset }
      : { alignSelf: 'stretch', width: thickness, marginVertical: inset };

  return <View style={[base, { backgroundColor: color }, style]} />;
}
