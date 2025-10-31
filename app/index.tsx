/**
 * Entry point / Splash screen
 * Determines where to navigate based on auth state
 */

import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@contexts/AuthContext';
import { colors, spacing } from '@constants/theme';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inCustomerGroup = segments[0] === '(customer)';
    const inProviderGroup = segments[0] === '(provider)';

    if (!user && !inAuthGroup) {
      // User not logged in, redirect to auth
      router.replace('/(auth)/login');
    } else if (user) {
      // User is logged in, redirect based on role
      if (user.role === 'customer' && !inCustomerGroup) {
        router.replace('/(customer)');
      } else if (user.role === 'provider' && !inProviderGroup) {
        router.replace('/(provider)');
      }
    }
  }, [user, loading, segments]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Placeholder for logo - you can add your logo image here */}
        <View style={styles.logoPlaceholder}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
