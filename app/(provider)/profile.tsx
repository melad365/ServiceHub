/**
 * Provider Profile screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { getInitials } from '@utils/formatting';

export default function ProviderProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Sign out error:', error);
          }
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user.profile.name)}</Text>
            </View>
          </View>
          <Text style={styles.name}>{user.profile.name}</Text>
          <Text style={styles.email}>{user.profile.email}</Text>
          {user.profile.phone && <Text style={styles.phone}>{user.profile.phone}</Text>}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Provider</Text>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuButton
            icon="account-edit"
            label="Edit Profile"
            onPress={() => Alert.alert('Coming soon', 'Edit profile feature')}
          />
          <MenuButton
            icon="briefcase"
            label="Business Details"
            onPress={() => Alert.alert('Coming soon', 'Business details feature')}
          />
          <MenuButton
            icon="image-multiple"
            label="Portfolio"
            onPress={() => Alert.alert('Coming soon', 'Portfolio management')}
          />
          <MenuButton
            icon="bank"
            label="Payout Settings"
            onPress={() => Alert.alert('Coming soon', 'Payout settings feature')}
          />
          <MenuButton
            icon="star"
            label="Reviews"
            onPress={() => Alert.alert('Coming soon', 'Reviews feature')}
          />
          <MenuButton
            icon="bell"
            label="Notifications"
            onPress={() => Alert.alert('Coming soon', 'Notifications settings')}
          />
          <MenuButton
            icon="help-circle"
            label="Help & Support"
            onPress={() => Alert.alert('Coming soon', 'Help & support feature')}
          />
        </View>

        {/* Sign Out Button */}
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          fullWidth
          style={styles.signOutButton}
        />

        {/* Version Info */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuButtonProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <View style={styles.menuButtonLeft}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.text} />
      <Text style={styles.menuButtonText}>{label}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  userCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.h2,
    color: colors.textInverse,
  },
  name: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  phone: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '600',
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuButtonText: {
    ...typography.body1,
    color: colors.text,
  },
  signOutButton: {
    marginBottom: spacing.lg,
  },
  version: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
