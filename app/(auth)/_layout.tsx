/**
 * Auth layout - for authentication screens
 */

import { Stack } from 'expo-router';
import { colors } from '@constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="role-selection" />
    </Stack>
  );
}
