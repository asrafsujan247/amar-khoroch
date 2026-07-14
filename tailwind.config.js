/** @type {import('tailwindcss').Config} */
// The color/radius values below mirror `src/theme/*` so the same design tokens
// are available via NativeWind classNames (e.g. `bg-primary`, `text-ink-500`)
// and via TypeScript style props. Keep the two in sync when editing.
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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
          light: '#5CEAD4',
          dark: '#00C2A0',
          darker: '#009C81',
        },
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
        background: '#F5F7F9',
        surface: '#FFFFFF',
        'surface-alt': '#F1F5F9',
        border: '#E2E8F0',
        success: { DEFAULT: '#16A34A', light: '#DCFCE7', dark: '#15803D' },
        danger: { DEFAULT: '#EF4444', light: '#FEE2E2', dark: '#B91C1C' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7', dark: '#B45309' },
        info: { DEFAULT: '#3B82F6', light: '#DBEAFE', dark: '#1D4ED8' },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
    },
  },
  plugins: [],
};
