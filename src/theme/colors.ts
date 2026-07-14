/**
 * Color tokens for the Salary Expense Tracker design system.
 *
 * Brand: #00E0BA (bright fintech teal). Version 1 is light-mode only.
 *
 * NOTE: The hex values here are mirrored in `tailwind.config.js` so the same
 * palette is available both via NativeWind classNames (e.g. `bg-primary`,
 * `text-ink-500`) and via style props / charts (e.g. `colors.primary[600]`).
 * Keep the two in sync when editing.
 */
export const colors = {
  /** Brand teal scale. `DEFAULT` (#00E0BA) is the signature brand color. */
  primary: {
    50: '#E6FCF7',
    100: '#C3F7EC',
    200: '#8CEFDB',
    300: '#4FE6C8',
    400: '#1ADCB6',
    500: '#00E0BA',
    600: '#00C2A0',
    700: '#009C81',
    800: '#007767',
    900: '#00544A',
    DEFAULT: '#00E0BA',
  },

  /** Neutral slate scale for text, borders and subtle surfaces. */
  ink: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  /** App surfaces. */
  background: '#F5F7F9',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border: '#E2E8F0',

  white: '#FFFFFF',
  black: '#000000',

  /** Semantic colors: each has a strong `DEFAULT`, a `light` tint and a `dark` shade. */
  success: { DEFAULT: '#16A34A', light: '#DCFCE7', dark: '#15803D' },
  danger: { DEFAULT: '#EF4444', light: '#FEE2E2', dark: '#B91C1C' },
  warning: { DEFAULT: '#F59E0B', light: '#FEF3C7', dark: '#B45309' },
  info: { DEFAULT: '#3B82F6', light: '#DBEAFE', dark: '#1D4ED8' },

  /**
   * Categorical palette for charts / category tags. Brand teal leads, followed
   * by distinct, accessible hues. Refined against the dataviz guidance in M8.
   */
  categorical: [
    '#00E0BA',
    '#3B82F6',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
  ],
} as const;

export type Colors = typeof colors;
