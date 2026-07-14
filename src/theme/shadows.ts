import { Platform, type ViewStyle } from 'react-native';

/**
 * Soft elevation presets. Android uses `elevation`; iOS/web use the classic
 * shadow* props. Applied via the `style` prop (e.g. `<Card shadow="md" />`)
 * because cross-platform shadow rendering is more reliable through style than
 * through utility classes.
 */

const make = (elevation: number, opacity: number, radius: number, offsetY: number): ViewStyle =>
  Platform.select<ViewStyle>({
    android: { elevation },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
  }) ?? {};

export const shadows = {
  none: {} as ViewStyle,
  sm: make(2, 0.06, 6, 2),
  md: make(4, 0.08, 12, 4),
  lg: make(8, 0.1, 20, 8),
  xl: make(14, 0.12, 28, 12),
} as const;

export type ShadowToken = keyof typeof shadows;
