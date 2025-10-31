-- ServiceHub Database Schema
-- Initial migration for the service provider marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE booking_status AS ENUM ('requested', 'accepted', 'in_progress', 'completed', 'cancelled');
CREATE TYPE price_type AS ENUM ('fixed', 'hourly');
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  avatar_url TEXT,
  location_lat DECIMAL(10, 8),
  location_lon DECIMAL(11, 8),
  address TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Providers table (one-to-one with users where role='provider')
CREATE TABLE providers (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT,
  bio TEXT,
  years_experience INTEGER,
  service_categories TEXT[] DEFAULT '{}',
  hourly_rate_min DECIMAL(10, 2),
  hourly_rate_max DECIMAL(10, 2),
  base_price DECIMAL(10, 2),
  portfolio_urls JSONB DEFAULT '[]',
  verified_badges JSONB DEFAULT '{}',
  insurance BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for provider searches
CREATE INDEX idx_providers_service_categories ON providers USING GIN(service_categories);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_type price_type NOT NULL DEFAULT 'fixed',
  unit_price DECIMAL(10, 2) NOT NULL,
  min_hours INTEGER,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_provider_id ON services(provider_id);

-- Availability table
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(user_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_availability_provider_date ON availability(provider_id, date);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(user_id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  status booking_status NOT NULL DEFAULT 'requested',
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ,
  address TEXT NOT NULL,
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  amount DECIMAL(10, 2) NOT NULL,
  fee DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_status payment_status DEFAULT 'pending'
);

CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_start ON bookings(scheduled_start);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(user_id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  moderated BOOLEAN DEFAULT FALSE,
  provider_reply TEXT,
  replied_at TIMESTAMPTZ
);

CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  payout_status payout_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_stripe_payment_id ON transactions(stripe_payment_id);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_messages_to_user_id ON messages(to_user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view provider profiles" ON users
  FOR SELECT USING (role = 'provider');

-- Providers policies
CREATE POLICY "Anyone can view providers" ON providers
  FOR SELECT USING (true);

CREATE POLICY "Providers can update their own profile" ON providers
  FOR UPDATE USING (auth.uid() = user_id);

-- Services policies
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Providers can manage their own services" ON services
  FOR ALL USING (auth.uid() = provider_id);

-- Bookings policies
CREATE POLICY "Customers can view their bookings" ON bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Providers can view their bookings" ON bookings
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their bookings" ON bookings
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Providers can update their bookings" ON bookings
  FOR UPDATE USING (auth.uid() = provider_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can reply to reviews" ON reviews
  FOR UPDATE USING (auth.uid() = provider_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Create materialized view for provider ratings
CREATE MATERIALIZED VIEW provider_ratings AS
SELECT
  provider_id,
  AVG(rating)::DECIMAL(3,2) as average_rating,
  COUNT(*) as review_count
FROM reviews
WHERE moderated = true
GROUP BY provider_id;

CREATE UNIQUE INDEX idx_provider_ratings_provider_id ON provider_ratings(provider_id);

-- Function to refresh provider ratings
CREATE OR REPLACE FUNCTION refresh_provider_ratings()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY provider_ratings;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh ratings when reviews change
CREATE TRIGGER trigger_refresh_provider_ratings
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_provider_ratings();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to relevant tables
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
