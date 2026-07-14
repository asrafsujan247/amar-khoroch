import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { colors, radii, type RadiusToken, shadows, type ShadowToken } from '@/theme';

export type CardProps = ViewProps & {
  children: ReactNode;
  /** Apply inner padding. Default true. */
  padded?: boolean;
  /** Custom padding value (px). Defaults to 16 when `padded`. */
  padding?: number;
  /** Corner radius token. Default `2xl` (24). */
  radius?: RadiusToken;
  /** Elevation preset. Default `md`. */
  shadow?: ShadowToken;
  /** Surface background color. Default white. */
  background?: string;
};

/**
 * Elevated surface primitive. The premium "large card, rounded corners, soft
 * shadow" look is centralized here so every card in the app is consistent.
 */
export function Card({
  children,
  padded = true,
  padding,
  radius = '2xl',
  shadow = 'md',
  background = colors.surface,
  style,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        { backgroundColor: background, borderRadius: radii[radius] },
        padded ? { padding: padding ?? 16 } : null,
        shadows[shadow],
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
