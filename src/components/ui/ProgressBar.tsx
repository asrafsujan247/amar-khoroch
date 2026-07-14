import { useEffect, useState } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors } from '@/theme';

export type ProgressBarProps = {
  /** Fill amount, 0–1. Values outside the range are clamped. */
  progress: number;
  /** Bar thickness in px. Default 10. */
  height?: number;
  /** Track (background) color. Default `colors.ink[200]`. */
  trackColor?: string;
  /** Fill color. Default `colors.primary[500]`. */
  fillColor?: string;
  /** Round the ends (`borderRadius: height / 2`). Default true. */
  rounded?: boolean;
  /** Animate the fill when `progress` changes. Default true. */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * A determinate progress bar. The track is measured via `onLayout`, then the
 * fill's numeric width is driven with Reanimated `withTiming`. Before layout is
 * known it falls back to a percentage width so it renders immediately.
 */
export function ProgressBar({
  progress,
  height = 10,
  trackColor = colors.ink[200],
  fillColor = colors.primary[500],
  rounded = true,
  animated = true,
  style,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const [trackWidth, setTrackWidth] = useState(0);
  const fillWidth = useSharedValue(0);

  useEffect(() => {
    if (trackWidth <= 0) return;
    const target = clamped * trackWidth;
    fillWidth.value = animated ? withTiming(target, { duration: 400 }) : target;
  }, [clamped, trackWidth, animated, fillWidth]);

  const animatedFillStyle = useAnimatedStyle(() => ({ width: fillWidth.value }));

  const onLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const borderRadius = rounded ? height / 2 : 0;

  return (
    <View
      onLayout={onLayout}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[
        { width: '100%', height, backgroundColor: trackColor, borderRadius, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View
        style={[
          { height, backgroundColor: fillColor, borderRadius },
          trackWidth > 0 ? animatedFillStyle : { width: `${clamped * 100}%` },
        ]}
      />
    </View>
  );
}
