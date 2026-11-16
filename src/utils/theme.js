/**
 * Fikra Agency - Theme & Design Tokens
 * Light/dark mode support, CSS custom properties, Tailwind config
 */

export const THEME = {
  light: {
    primary: '#4F46E5',
    secondary: '#7C3AED',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceAlt: '#EDF2F7',
    text: '#0F172A',
    muted: '#64748B',
    border: '#E2E8F0',
    ring: 'rgba(79, 70, 229, 0.5)',
  },
  dark: {
    primary: '#818CF8',
    secondary: '#A78BFA',
    accent: '#FBBF24',
    background: '#0B1020',
    surface: '#121936',
    surfaceAlt: '#1E293B',
    text: '#E2E8F0',
    muted: '#94A3B8',
    border: '#1E293B',
    ring: 'rgba(129, 140, 248, 0.5)',
  },
}

export const PALETTE = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  surfaceAlt: 'var(--color-surface-alt)',
  text: 'var(--color-text)',
  muted: 'var(--color-muted)',
  border: 'var(--color-border)',
  ring: 'var(--color-ring)',
  gradientHero: 'linear-gradient(135deg, #4F46E5, #7C3AED, #F59E0B)',
  gradientText: 'linear-gradient(135deg, #4F46E5, #7C3AED, #F59E0B)',
}

export const COLORS = {
  // Semantic names used across the app
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
}

/**
 * Font sizes
 */
export const FONT_SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
}

/**
 * Letter spacing
 */
export const LETTER_SPACING = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
}

/**
 * Radius sizes
 */
export const RADIUS = {
  none: '0',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
}

/**
 * Transition presets (all components use these for 60fps animations)
 */
export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

/**
 * Elevation / shadow scale (responsive)
 */
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
}

/**
 * Breakpoints (matches Tailwind)
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

/**
 * Z-index scale
 */
export const Z_INDEX = {
  base: '0',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1040',
  modalBackdrop: '1060',
  modal: '1080',
  toast: '1100',
  tooltip: '1200',
}

/**
 * Common section spacing (top/bottom padding)
 */
export const SECTION_SPACING = {
  default: '8rem', // 128px
  compact: '6rem',
  tight: '4rem',
}

export default { THEME, PALETTE, COLORS, FONT_SIZES, LETTER_SPACING, RADIUS, TRANSITIONS, SHADOWS, BREAKPOINTS, Z_INDEX, SECTION_SPACING }
