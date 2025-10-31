/**
 * Provider Dashboard screen - placeholder
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@constants/theme';
import { useAuth } from '@contexts/AuthContext';

export default function ProviderDashboardScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome, {user?.profile.name}!</Text>
          <Text style={styles.subtitle}>Manage your services and bookings</Text>
        </View>

        <View style={styles.placeholder}>
          <MaterialCommunityIcons name="view-dashboard" size={64} color={colors.textSecondary} />
          <Text style={styles.placeholderText}>Provider Dashboard</Text>
          <Text style={styles.placeholderSubtext}>Coming soon...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
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
