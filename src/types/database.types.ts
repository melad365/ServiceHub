/**
 * Database types for Supabase tables
 * Generated from the functional spec data model
 */

export type UserRole = 'customer' | 'provider' | 'admin';

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PriceType = 'fixed' | 'hourly';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded';

export type PayoutStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          name: string;
          role: UserRole;
          created_at: string;
          last_login: string | null;
          avatar_url: string | null;
          location_lat: number | null;
          location_lon: number | null;
          address: string | null;
          verified: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          name: string;
          role: UserRole;
          created_at?: string;
          last_login?: string | null;
          avatar_url?: string | null;
          location_lat?: number | null;
          location_lon?: number | null;
          address?: string | null;
          verified?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          name?: string;
          role?: UserRole;
          created_at?: string;
          last_login?: string | null;
          avatar_url?: string | null;
          location_lat?: number | null;
          location_lon?: number | null;
          address?: string | null;
          verified?: boolean;
        };
      };
      providers: {
        Row: {
          user_id: string;
          business_name: string | null;
          bio: string | null;
          years_experience: number | null;
          service_categories: string[];
          hourly_rate_min: number | null;
          hourly_rate_max: number | null;
          base_price: number | null;
          portfolio_urls: Record<string, any> | null;
          verified_badges: Record<string, any> | null;
          insurance: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          business_name?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          service_categories?: string[];
          hourly_rate_min?: number | null;
          hourly_rate_max?: number | null;
          base_price?: number | null;
          portfolio_urls?: Record<string, any> | null;
          verified_badges?: Record<string, any> | null;
          insurance?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          business_name?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          service_categories?: string[];
          hourly_rate_min?: number | null;
          hourly_rate_max?: number | null;
          base_price?: number | null;
          portfolio_urls?: Record<string, any> | null;
          verified_badges?: Record<string, any> | null;
          insurance?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          title: string;
          description: string | null;
          price_type: PriceType;
          unit_price: number;
          min_hours: number | null;
          tags: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          title: string;
          description?: string | null;
          price_type: PriceType;
          unit_price: number;
          min_hours?: number | null;
          tags?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          title?: string;
          description?: string | null;
          price_type?: PriceType;
          unit_price?: number;
          min_hours?: number | null;
          tags?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      availability: {
        Row: {
          id: string;
          provider_id: string;
          date: string;
          start_time: string;
          end_time: string;
          is_blocked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          date: string;
          start_time: string;
          end_time: string;
          is_blocked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          is_blocked?: boolean;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          provider_id: string;
          service_id: string;
          status: BookingStatus;
          scheduled_start: string;
          scheduled_end: string | null;
          address: string;
          notes: string | null;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
          amount: number;
          fee: number;
          currency: string;
          payment_status: PaymentStatus;
        };
        Insert: {
          id?: string;
          customer_id: string;
          provider_id: string;
          service_id: string;
          status?: BookingStatus;
          scheduled_start: string;
          scheduled_end?: string | null;
          address: string;
          notes?: string | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
          amount: number;
          fee: number;
          currency?: string;
          payment_status?: PaymentStatus;
        };
        Update: {
          id?: string;
          customer_id?: string;
          provider_id?: string;
          service_id?: string;
          status?: BookingStatus;
          scheduled_start?: string;
          scheduled_end?: string | null;
          address?: string;
          notes?: string | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
          amount?: number;
          fee?: number;
          currency?: string;
          payment_status?: PaymentStatus;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          provider_id: string;
          rating: number;
          text: string | null;
          created_at: string;
          moderated: boolean;
          provider_reply: string | null;
          replied_at: string | null;
        };
        Insert: {
          id?: string;
          booking_id: string;
          customer_id: string;
          provider_id: string;
          rating: number;
          text?: string | null;
          created_at?: string;
          moderated?: boolean;
          provider_reply?: string | null;
          replied_at?: string | null;
        };
        Update: {
          id?: string;
          booking_id?: string;
          customer_id?: string;
          provider_id?: string;
          rating?: number;
          text?: string | null;
          created_at?: string;
          moderated?: boolean;
          provider_reply?: string | null;
          replied_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          booking_id: string;
          stripe_payment_id: string;
          amount: number;
          platform_fee: number;
          payout_status: PayoutStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          stripe_payment_id: string;
          amount: number;
          platform_fee: number;
          payout_status?: PayoutStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          stripe_payment_id?: string;
          amount?: number;
          platform_fee?: number;
          payout_status?: PayoutStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          booking_id: string;
          from_user_id: string;
          to_user_id: string;
          text: string;
          attachments: Record<string, any> | null;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          booking_id: string;
          from_user_id: string;
          to_user_id: string;
          text: string;
          attachments?: Record<string, any> | null;
          created_at?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          booking_id?: string;
          from_user_id?: string;
          to_user_id?: string;
          text?: string;
          attachments?: Record<string, any> | null;
          created_at?: string;
          read?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      price_type: PriceType;
      payment_status: PaymentStatus;
      payout_status: PayoutStatus;
    };
  };
}
