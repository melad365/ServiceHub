# ServiceHub - Project Setup Guide

## Overview
ServiceHub is a service provider marketplace mobile application built with React Native (Expo) that connects customers with service providers (plumbers, electricians, cleaners, etc.).

## Technology Stack

### Frontend
- **React Native** with Expo SDK 51
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **React Native Paper** for UI components
- **TanStack Query** (React Query) for data fetching
- **Zustand** for state management
- **Expo Location** for GPS functionality
- **Expo Image Picker** for photo uploads

### Backend
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **Stripe** for payments and Connect for provider payouts
- **Firebase Cloud Messaging** for push notifications

## Project Structure

```
ServiceHub/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── role-selection.tsx
│   ├── (customer)/               # Customer app screens
│   │   ├── _layout.tsx          # Tab navigation
│   │   ├── index.tsx            # Browse/Home
│   │   ├── search.tsx
│   │   ├── bookings.tsx
│   │   └── profile.tsx
│   ├── (provider)/               # Provider app screens
│   │   ├── _layout.tsx          # Tab navigation
│   │   ├── index.tsx            # Dashboard
│   │   ├── bookings.tsx
│   │   ├── services.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry/Splash screen
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── common/
│   │   ├── provider/
│   │   └── reviews/
│   ├── services/                # API & business logic
│   │   ├── supabase.ts
│   │   ├── auth.service.ts
│   │   ├── provider.service.ts
│   │   ├── booking.service.ts
│   │   └── payment.service.ts
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript definitions
│   │   ├── database.types.ts
│   │   └── models.ts
│   ├── constants/               # App constants
│   │   ├── categories.ts
│   │   └── theme.ts
│   ├── utils/                   # Utility functions
│   │   ├── validation.ts
│   │   └── formatting.ts
│   └── contexts/                # React contexts
│       └── AuthContext.tsx
├── supabase/                    # Database schema
│   └── migrations/
│       └── 001_initial_schema.sql
└── assets/                      # Images, fonts
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration file in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
3. Copy your Supabase URL and Anon Key

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Enable Stripe Connect for provider payouts
3. Copy your publishable and secret keys

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
STRIPE_SECRET_KEY=sk_test_your-key-here
```

### 5. Start the Development Server

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Database Schema

The database includes the following main tables:

- **users** - User accounts (customers, providers, admins)
- **providers** - Provider-specific profile data
- **services** - Services offered by providers
- **availability** - Provider availability calendar
- **bookings** - Service bookings/requests
- **reviews** - Customer reviews and ratings
- **transactions** - Payment transactions
- **messages** - In-app messaging

See `supabase/migrations/001_initial_schema.sql` for full schema.

## Key Features (MVP)

### Authentication
- Email/password and magic link authentication
- Role-based access (customer vs provider)
- JWT-based authorization with Row Level Security

### For Customers
- Browse service providers by category
- Search with filters (location, rating, price)
- View provider profiles and reviews
- Request and book services
- Make payments via Stripe
- Rate and review providers

### For Providers
- Create and manage profile
- List services with pricing
- Upload portfolio images
- Accept/decline booking requests
- View earnings and statistics
- Respond to reviews

### Shared
- Push notifications for booking events
- In-app messaging
- Real-time updates via Supabase Realtime

## Development Workflow

1. **Feature Development**: Build features iteratively, one at a time
2. **Testing**: Test on both iOS and Android
3. **Code Quality**: Run `npm run lint` and `npm run type-check`
4. **Commits**: Use descriptive commit messages

## Next Steps

The project is now scaffolded with:
- ✅ Configuration files (package.json, app.json, tsconfig.json)
- ✅ Project structure and folders
- ✅ Type definitions (database and models)
- ✅ Theme and constants
- ✅ Supabase client setup
- ✅ Auth context and provider
- ✅ Navigation structure (auth, customer, provider)
- ✅ Database schema migration

**Ready to implement:**
1. Authentication screens (login, signup, role selection)
2. Customer browse and search functionality
3. Provider profile and onboarding
4. Booking flow
5. Payment integration
6. Reviews and ratings
7. Push notifications

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## Support

For issues or questions, refer to the functional and technical specifications in `functionaltechnical.md`.
