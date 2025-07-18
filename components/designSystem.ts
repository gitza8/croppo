// Enhanced Design System for Croppo Application

// Color palette with semantic naming and accessibility considerations
export const colors = {
  // Primary colors
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Main primary
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  // Secondary colors
  secondary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main secondary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Accent colors
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main accent
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Status colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  
  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Legacy support
  primary: '#10B981',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  success: '#10B981',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  muted: '#6B7280',
  text: '#111827',
  subtitle: '#6B7280',
  placeholder: '#9CA3AF',
  shadow: '#000',
};

// Enhanced typography with responsive scaling
export const typography = {
  fontFamily: {
    primary: 'System',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    xxl: 28, // Legacy support
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
    // Legacy support
    regular: '400',
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
};

// Enhanced spacing system with responsive breakpoints
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
  // Legacy support
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

// Enhanced border radius
export const radii = {
  none: 0,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
  pill: 20, // Legacy support
};

// Enhanced shadows with multiple levels
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
  },
  '2xl': {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 6,
  },
};

// Responsive breakpoints
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  '2xl': 1400,
};

// Animation durations
export const animation = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
};

// Z-index layers
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Component variants
export const variants = {
  button: {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.neutral[50],
      borderColor: colors.primary[500],
    },
    secondary: {
      backgroundColor: colors.secondary[500],
      color: colors.neutral[50],
      borderColor: colors.secondary[500],
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      borderColor: colors.primary[500],
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.neutral[700],
      borderColor: 'transparent',
    },
  },
  card: {
    elevated: {
      backgroundColor: colors.surface,
      ...shadows.md,
      borderRadius: radii.lg,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.lg,
    },
    filled: {
      backgroundColor: colors.neutral[50],
      borderRadius: radii.lg,
    },
  },
};

// Accessibility helpers
export const accessibility = {
  minTouchTarget: 44,
  focusRing: {
    width: 2,
    color: colors.primary[500],
    style: 'solid',
  },
  contrast: {
    aa: 4.5,
    aaa: 7,
  },
};

// Export theme object
export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  breakpoints,
  animation,
  zIndex,
  variants,
  accessibility,
};

export default theme; 