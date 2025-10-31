/**
 * Authentication service
 * Handles all auth-related API calls
 */

import { supabase } from './supabase';
import { SignUpData, SignInData } from '@types/models';

export const authService = {
  /**
   * Sign in with email and password
   */
  signIn: async (data: SignInData) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    return authData;
  },

  /**
   * Sign up new user
   */
  signUp: async (data: SignUpData) => {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      verified: false,
    });

    if (profileError) throw profileError;

    // If provider, create provider profile
    if (data.role === 'provider') {
      const { error: providerError } = await supabase.from('providers').insert({
        user_id: authData.user.id,
        service_categories: [],
        insurance: false,
      });

      if (providerError) throw providerError;
    }

    return authData;
  },

  /**
   * Sign out
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Send password reset email
   */
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  /**
   * Update password
   */
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  /**
   * Get current session
   */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current user
   */
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};
