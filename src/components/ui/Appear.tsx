import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

/** Entrance duration — short enough to never feel like waiting. */
const DURATION = 320;
/** Delay added per stagger step. */
const STAGGER = 55;
/**
 * Cap on stagger steps. Without it, the last card of a long screen would wait
 * for the whole cascade before appearing.
 */
const MAX_STAGGER_STEPS = 6;

export type AppearProps = {
  children: ReactNode;
  /**
   * Position within a staggered group. Each step delays the entrance slightly
   * so cards cascade instead of appearing all at once.
   */
  index?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Subtle entrance wrapper for cards and sections: content fades in while rising
 * a few pixels into place.
 *
 * Accessibility: when the OS "reduce motion" setting is on, this renders a plain
 * View so content appears instantly. (Reanimated's own default is
 * `ReduceMotion.System`, but skipping the animated node entirely is explicit and
 * guarantees no motion.)
 *
 * Note on the API: `FadeInDown` starts 25px BELOW and rises to its resting
 * position — verified in Reanimated's source — which is the effect we want. The
 * name describes the builder, not the travel direction.
 */
export function Appear({ children, index = 0, style }: AppearProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <View style={style}>{children}</View>;
  }

  const delay = Math.min(index, MAX_STAGGER_STEPS) * STAGGER;

  return (
    <Animated.View entering={FadeInDown.duration(DURATION).delay(delay)} style={style}>
      {children}
    </Animated.View>
  );
}
