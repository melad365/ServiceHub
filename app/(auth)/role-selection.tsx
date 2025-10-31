/**
 * Role selection screen - choose between customer and provider
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import { useAuth } from '@contexts/AuthContext';
import { colors, spacing, typography, borderRadius } from '@constants/theme';

type UserRole = 'customer' | 'provider';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signUp } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      type: 'customer' as UserRole,
      title: 'I need services',
      subtitle: 'Find and book service providers',
      icon: 'account-search',
      features: [
        'Browse service providers',
        'Book services instantly',
        'Secure payments',
        'Rate and review',
      ],
    },
    {
      type: 'provider' as UserRole,
      title: 'I offer services',
      subtitle: 'Grow your business',
      icon: 'briefcase',
      features: [
        'Create your profile',
        'List your services',
        'Manage bookings',
        'Receive payments',
      ],
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Select a role', 'Please select how you want to use ServiceHub');
      return;
    }

    setLoading(true);
    try {
      await signUp(
        params.email as string,
        params.password as string,
        params.name as string,
        selectedRole
      );
      // Navigation will happen automatically via the auth context
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>How do you want to use ServiceHub?</Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.type}
              activeOpacity={0.7}
              onPress={() => setSelectedRole(role.type)}
            >
              <Card
                elevation="md"
                style={[
                  styles.roleCard,
                  selectedRole === role.type && styles.roleCardSelected,
                ]}
              >
                {/* Selection Indicator */}
                <View style={styles.roleHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      selectedRole === role.type && styles.iconContainerSelected,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={role.icon as any}
                      size={32}
                      color={selectedRole === role.type ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  {selectedRole === role.type && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </View>

                {/* Title */}
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleSubtitle}>{role.subtitle}</Text>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {role.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <MaterialCommunityIcons
                        name="check"
                        size={16}
                        color={colors.success}
                      />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={!selectedRole}
          fullWidth
          style={styles.continueButton}
        />

        {/* Back Link */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  rolesContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  roleCard: {
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerSelected: {
    backgroundColor: colors.primaryLight + '20',
  },
  roleTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  roleSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  featuresContainer: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.body2,
    color: colors.text,
  },
  continueButton: {
    marginBottom: spacing.md,
  },
  backButton: {
    alignSelf: 'center',
    padding: spacing.sm,
  },
  backText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '600',
  },
});
