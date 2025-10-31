/**
 * Provider Bookings screen - placeholder
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@constants/theme';

export default function ProviderBookingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Bookings</Text>
        <View style={styles.placeholder}>
          <MaterialCommunityIcons name="calendar-check" size={64} color={colors.textSecondary} />
          <Text style={styles.placeholderText}>No bookings yet</Text>
          <Text style={styles.placeholderSubtext}>Booking requests will appear here</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.lg,
  },
  placeholderSubtext: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
