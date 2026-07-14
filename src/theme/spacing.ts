/**
 * Spacing and radius tokens on a 4-point grid. Screens should prefer these
 * (or the matching Tailwind classes) over ad-hoc pixel values for consistency.
 */

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export type SpacingToken = keyof typeof spacing;

export const radii = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radii;

/** Standard horizontal gutter used by the Screen wrapper and most layouts. */
export const SCREEN_PADDING = spacing.xl; // 20
