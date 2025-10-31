/**
 * Card component for displaying content in a container
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'sm',
  padding = spacing.md,
}) => {
  return (
    <View
      style={[
        styles.card,
        { padding },
        shadows[elevation],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
