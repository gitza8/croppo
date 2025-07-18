import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { theme } from '@/components/designSystem';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    (disabled || loading) && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={disabled ? 'Button is disabled' : undefined}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary[500] : theme.colors.neutral[50]}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyleCombined}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    minHeight: theme.accessibility.minTouchTarget,
    ...theme.shadows.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  secondary: {
    backgroundColor: theme.colors.secondary[500],
    borderColor: theme.colors.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: theme.colors.error[500],
    borderColor: theme.colors.error[500],
  },
  
  // Sizes
  sm: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    minHeight: 36,
  },
  md: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    minHeight: theme.accessibility.minTouchTarget,
  },
  lg: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    minHeight: 52,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  
  text_primary: {
    color: theme.colors.neutral[50],
  },
  text_secondary: {
    color: theme.colors.neutral[50],
  },
  text_outline: {
    color: theme.colors.primary[500],
  },
  text_ghost: {
    color: theme.colors.neutral[700],
  },
  text_danger: {
    color: theme.colors.neutral[50],
  },
  
  text_sm: {
    fontSize: theme.typography.fontSize.sm,
  },
  text_md: {
    fontSize: theme.typography.fontSize.base,
  },
  text_lg: {
    fontSize: theme.typography.fontSize.lg,
  },
  
  textDisabled: {
    opacity: 0.7,
  },
});