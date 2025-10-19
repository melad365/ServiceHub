# Functional & Technical Specification — Service-Provider Marketplace (mobile, React Native)

## Executive summary (improved wording)
A two-role mobile marketplace connecting Customers with Service Providers (painters, cleaners, plumbers, etc.). Providers create detailed profiles, list services/pricing, upload portfolio items and accept bookings. Customers browse, request/confirm services, pay, rate and review providers. Core goals: fast booking flow, reliable profiles, clear trust signals (ratings/reviews), and basic dispute handling. Build cross-platform with React Native; use Supabase (Postgres + Auth + Storage) as primary backend. Design MVP to validate matching, bookings, payment, and review loop.

# Functional spec

## Primary actors
- **Customer** — searches providers, books services, pays, rates.
- **Service Provider** — registers as business/person, lists services, manages availability, accepts/declines bookings, views earnings and reviews.
- **Admin (internal)** — moderate content, manage disputes, view analytics.

## Core user flows (MVP)
1. **Onboarding**
   - Customer: email/mobile login (magic link or OTP), minimal profile (name, address, phone).
   - Provider: register, verify identity (photo ID upload optional for trust), add services, set hourly or fixed pricing, add portfolio images.

2. **Discovery**
   - Customer chooses category (e.g., plumber), enters location or uses GPS, sees ranked list with distance, rating, price indicator, availability badge.
   - Search and filter: category, price range, availability, ratings, distance.

3. **Provider detail page**
   - Photos, short bio, list of services with prices, skills/proficiency tags, verified badges, average rating, reviews, sample jobs, calendar availability, contact button, "Request Service" CTA.

4. **Request / Booking**
   - Customer selects service, date/time, optionally attaches photo and notes, chooses payment method (card), confirms request.
   - Provider receives booking request (push + in-app), accepts/declines or proposes new time.
   - On acceptance, booking confirmed and payment is authorized/captured per payment flow.

5. **Job lifecycle**
   - Statuses: Requested → Accepted → In Progress → Completed → Rated.
   - Provider marks job started/completed; customer confirms completion; payment captured/released per policy.

6. **Ratings & Reviews**
   - After completion, customer rates provider (1–5) and writes review. Provider can reply. Providers can also view ratings from other providers (as requested).

7. **Payments & Payouts**
   - Customer pays via Stripe. Platform takes commission. Provider receives payouts to connected Stripe account.

8. **Notifications**
   - Push (booking requests, status changes), in-app messages, email receipts.

9. **Admin**
   - Dashboard for user management, dispute handling, content moderation, usage analytics.

## Non-functional requirements (MVP)
- Authentication and role separation.
- Data privacy (GDPR conscious), secure storage for PII.
- Low latency for search results (<500ms typical).
- Scalability to thousands of users; design to be horizontally scalable.
- Observability: logs and error tracking.

# Data model (relational; Supabase/Postgres)

Primary tables (columns abbreviated):

- **users**
  - id (uuid, PK), email, phone, name, role ENUM('customer','provider','admin'), created_at, last_login, avatar_url, location (lat, lon), verified boolean

- **providers** (one-to-one with users where role='provider')
  - user_id (FK users.id), business_name, bio, years_experience, service_categories (array/text[]), hourly_rate_min, hourly_rate_max, base_price, portfolio_urls (jsonb), verified_badges jsonb, insurance boolean

- **services**
  - id, provider_id, title, description, price_type ENUM('fixed','hourly'), unit_price, min_hours, tags jsonb

- **availability**
  - id, provider_id, date, start_time, end_time, is_blocked boolean

- **bookings**
  - id, customer_id, provider_id, service_id, status ENUM('requested','accepted','in_progress','completed','cancelled'), scheduled_start, scheduled_end, address, notes, created_at, amount, fee, currency, payment_status

- **reviews**
  - id, booking_id, customer_id, provider_id, rating INT, text, created_at, moderated boolean

- **transactions**
  - id, booking_id, stripe_payment_id, amount, platform_fee, payout_status, created_at

- **messages**
  - id, booking_id, from_user_id, to_user_id, text, attachments jsonb, created_at

- **audit_logs** / **admin_actions**

Indexes: GIST index on location for proximity queries; indexes on provider.service_categories, provider.rating, bookings.status.

# Authentication & Authorization
- Use **Supabase Auth** (Postgres + GoTrue) for email/password, magic link, and OAuth providers if desired.
- Implement **role claims** in JWT tokens: role included in token payload (customer/provider/admin).
- Enforce server-side RBAC via Postgres policies (Supabase Row Level Security) for table access.
- Multi-factor options optional for providers (SMS or authenticator).
- Password rules, account lockout, email verification required for providers.

# Security
- Secure transport: HTTPS/TLS everywhere.
- Store secrets (Stripe, Supabase keys) in secret manager (Vercel/Netlify env or cloud provider secret store).
- Sanitize and validate all inputs. Use prepared statements / parameterized SQL.
- Rate limiting on endpoints and login attempts.
- File uploads: signed upload URLs + virus scan (optional). Store files in Supabase Storage or S3; serve via CDN.
- PII minimization: only store necessary info; encryption at rest via managed DB.
- Regular backups, retention policy, and GDPR compliance (data deletion flows).
- Access logging and audit trail for admin actions.

# Search & discovery
- Simple MVP: use Postgres geospatial query (PostGIS) or Supabase geo functions for proximity + full-text search on service titles/descriptions.
- For semantic search / better matching later: integrate vector search (Weaviate, Pinecone, or pgvector in Postgres). Keep schema to store embeddings if needed.
- Ranking factors: proximity, rating, price match, provider availability, recency.

# API design
- Use REST (or GraphQL if preferred). Example endpoints:
  - `POST /auth/signup`, `POST /auth/login`
  - `GET /providers?category=&lat=&lon=&radius=&min_rating=&sort=`
  - `GET /providers/:id`
  - `POST /bookings`
  - `PATCH /bookings/:id/status`
  - `POST /reviews`
  - `GET /me/bookings`
- Use JWT bearer tokens. Enforce server validation on role and ownership.

# Tech stack (recommended)
- Mobile: React Native (Expo for faster dev) or RN bare if native modules needed.
- Backend: Supabase (Postgres + Auth + Storage) + lightweight serverless functions (Vercel, Netlify Functions, or Cloud Run) for webhooks and complex logic (payments, scheduled jobs).
- Payments: Stripe (Payments + Connect for provider payouts).
- Push notifications: Firebase Cloud Messaging (Android) + APNs (iOS) via Expo or custom native.
- File storage: Supabase Storage or AWS S3.
- Optional vector search: Weaviate or pgvector + Supabase for semantic search later.
- CI/CD: GitHub Actions, deploy app builds via EAS (Expo Application Services) or Fastlane for release pipelines.
- Monitoring: Sentry (errors), LogRocket or Firebase Analytics (client analytics), Prometheus/Cloud provider logs for backend.

# Architecture diagram (text)
Mobile App (React Native) ⇄ REST/GraphQL API (Serverless functions) ⇄ Supabase Postgres (data, auth, storage)
Third parties: Stripe (payments) | FCM/APNs (push) | Sentry (errors) | Optional Vector DB (Weaviate)

# MVP scope (minimal to validate product)
**Must have**
- User auth (email/magic link) + role selection (customer/provider).
- Provider onboarding: create profile, add services, set pricing, upload portfolio.
- Customer discovery: category browse + proximity filter + provider detail page.
- Booking request flow (request → provider accept/decline).
- Basic payments: Stripe integration (authorize at booking, capture at completion or capture on accept depending on policy).
- Ratings & reviews for completed jobs.
- Push notifications for booking events.
- Basic admin panel to view users, bookings, and moderate reviews.
- Basic logging and error reporting.

**Nice to have (post-MVP)**
- Calendar sync (Google Calendar) for providers.
- Provider availability calendar UI.
- In-app chat with attachments.
- Provider verification badges (ID upload).
- Semantic search/skill matching (vector search).
- Promotions, coupons, subscription plans for providers.
- Dispute resolution workflow and refunds.

# Acceptance criteria (MVP)
- Providers can be discovered by category and location.
- Customers can request and confirm bookings; providers can accept.
- Payments can be initiated and tracked via Stripe.
- Completed jobs generate review prompts and store reviews.
- Users authenticate and only access authorized resources.
- Admin can moderate reviews and suspend users.

# UI/UX pages (minimum)
- Splash / Onboarding / Role choose
- Auth (email/login, magic link)
- Home / Browse categories
- Search results (list & map toggle)
- Provider detail
- Booking flow (select service, schedule, confirm payment)
- Booking management (customer & provider)
- Reviews & history
- Provider onboarding / profile editor
- Admin dashboard (web)

# Data migration & future proofing
- Use clear foreign keys and constraints; avoid denormalizing essential data.
- Add `metadata` jsonb fields for extensibility.
- Keep payments and transaction data immutable.

# Testing & QA
- Automated unit tests for critical backend functions and business logic (booking lifecycle, payments).
- End-to-end tests simulating booking and payment.
- Manual QA for mobile flows on iOS/Android devices.
- Security testing: OWASP checklist, dependency scanning.

# Deployment, hosting & ops
- Host frontend CI builds via EAS / app store pipelines.
- Supabase managed DB and storage. Use separate environments (dev/stage/prod).
- Serverless functions for webhooks (Stripe), scheduled cleanup jobs.
- Backups enabled; daily export of DB to object storage.
- Log aggregation and Sentry for error monitoring.

# Minimum viable data privacy & legal
- Terms of Service and Privacy Policy pages.
- Consent during onboarding for data handling and payment terms.
- Data deletion endpoint for GDPR "right to be forgotten".

# Next concrete steps (immediate)
1. Finalize user stories and MVP feature list (use the list above).
2. Create ERD and API contract for listed endpoints.
3. Build Supabase schema and RLS policies.
4. Scaffold React Native app with authentication + basic browse screen.
5. Integrate Stripe test environment and booking flow.
