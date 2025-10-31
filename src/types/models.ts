/**
 * Application models and business logic types
 */

import { Database } from './database.types';

// Extract table types
export type User = Database['public']['Tables']['users']['Row'];
export type Provider = Database['public']['Tables']['providers']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Availability = Database['public']['Tables']['availability']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];

// Composite types for UI
export interface ProviderProfile extends User {
  provider: Provider;
  services: Service[];
  averageRating: number;
  reviewCount: number;
  distance?: number; // In kilometers
}

export interface BookingWithDetails extends Booking {
  customer: User;
  provider: ProviderProfile;
  service: Service;
}

export interface ReviewWithUser extends Review {
  customer: User;
}

// Search and filter types
export interface SearchFilters {
  category?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // In kilometers
  minRating?: number;
  maxPrice?: number;
  minPrice?: number;
  priceType?: 'fixed' | 'hourly';
  availability?: Date;
  verified?: boolean;
  insurance?: boolean;
}

export interface SearchResults {
  providers: ProviderProfile[];
  total: number;
  page: number;
  pageSize: number;
}

// Booking request
export interface BookingRequest {
  providerId: string;
  serviceId: string;
  scheduledStart: Date;
  scheduledEnd?: Date;
  address: string;
  notes?: string;
  photoUrl?: string;
}

// Review submission
export interface ReviewSubmission {
  bookingId: string;
  rating: number;
  text?: string;
}

// Provider portfolio item
export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
}

// Location type
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Notification types
export interface NotificationPayload {
  type: 'booking_request' | 'booking_accepted' | 'booking_declined' | 'booking_started' | 'booking_completed' | 'review_received' | 'payment_received';
  title: string;
  body: string;
  data: Record<string, any>;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  profile: User;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'customer' | 'provider';
}

export interface SignInData {
  email: string;
  password: string;
}

// Stats and analytics (for provider dashboard)
export interface ProviderStats {
  totalBookings: number;
  completedBookings: number;
  totalEarnings: number;
  averageRating: number;
  reviewCount: number;
  upcomingBookings: number;
}

export interface CustomerStats {
  totalBookings: number;
  completedBookings: number;
  totalSpent: number;
  reviewsGiven: number;
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}
