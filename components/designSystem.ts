// designSystem.ts

// Color palette
export const colors = {
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

// Typography
export const typography = {
  fontFamily: 'System',
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 28,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

// Border radius
export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 20,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}; 