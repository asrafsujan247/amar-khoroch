import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import {
  colors,
  fontWeight,
  typography,
  type FontWeightToken,
  type TypographyVariant,
} from '@/theme';

/** Semantic text colors mapped to palette tokens. */
export type TextColor =
  'default' | 'secondary' | 'tertiary' | 'inverse' | 'brand' | 'success' | 'danger' | 'warning';

const colorMap: Record<TextColor, string> = {
  default: colors.ink[900],
  secondary: colors.ink[500],
  tertiary: colors.ink[400],
  inverse: colors.white,
  brand: colors.primary[600],
  success: colors.success.DEFAULT,
  danger: colors.danger.DEFAULT,
  warning: colors.warning.dark,
};

export type TextProps = RNTextProps & {
  /** Typographic scale variant. Default `body`. */
  variant?: TypographyVariant;
  /** Semantic color. Default `default` (ink-900). */
  color?: TextColor;
  /** Override the variant's font weight. */
  weight?: FontWeightToken;
  /** Center the text horizontally. */
  center?: boolean;
};

/**
 * The single text primitive for the whole app. Screens choose a semantic
 * `variant` + `color`; they never hardcode font sizes or hex values.
 * `className` still passes through for layout tweaks (e.g. `mt-2`).
 */
export function Text({
  variant = 'body',
  color = 'default',
  weight,
  center,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      style={[
        typography[variant],
        { color: colorMap[color] },
        weight ? { fontWeight: fontWeight[weight] } : null,
        center ? { textAlign: 'center' } : null,
        style,
      ]}
      {...rest}
    />
  );
}
