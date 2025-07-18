import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { theme } from '@/components/designSystem';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export default function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
  style,
  testID,
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    padding !== 'none' && styles[`padding_${padding}`],
    style,
  ];

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={cardStyle}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole={onPress ? 'button' : undefined}
      testID={testID}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  
  // Variants
  elevated: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  outlined: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filled: {
    backgroundColor: theme.colors.neutral[50],
  },
  
  // Padding
  padding_sm: {
    padding: theme.spacing[3],
  },
  padding_md: {
    padding: theme.spacing[4],
  },
  padding_lg: {
    padding: theme.spacing[6],
  },
});