# ThangkaHub — Architecture & Implementation Plan

## MVP Scope (2 Weeks)

### In Scope
- **3-role auth system:** Client (default), Artist (admin-granted), Admin
- **Core marketplace:** Browse, search, filter, artwork detail pages
- **Artist profiles:** Bio, portfolio, lineage, specializations
- **Story-driven artwork pages:** Deity info, symbolism, materials, artist story
- **Advanced search/filtering:** Deity, style, artist, price range, size, materials
- **Shopping cart + checkout:** Khalti, eSewa, Stripe (NPR + USD initially)
- **Time-lapse creation archive:** Artists upload progress steps per artwork (optional)
- **Admin dashboard:** User management, artist account approval, platform oversight

### Out of Scope (Phase 2)
- Custom commission marketplace
- Live artist sessions (LiveKit)
- Multi-currency beyond NPR/USD
- Cloudflare Stream video hosting
- AI Cultural Guide
- Mobile app

---

## 1. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG for SEO, Server Components for perf |
| Language | TypeScript 5.7+ | Type safety across full stack |
| Styling | Tailwind CSS 4 + ShadCN UI (canary) | CSS-driven config via `@theme`, no JS config file |
| Database | Supabase PostgreSQL | Managed Postgres, built-in Auth, RLS, Storage |
| Auth | Supabase Auth (email/password + OAuth) | Free tier generous, RLS integration |
| ORM | Drizzle ORM | Lightweight, type-safe, good Supabase compat |
| Validation | Zod | Shared schemas client + server |
| Payments | Khalti, eSewa, Stripe | Nepal-first + international fallback |
| Email | Resend | Transactional emails, verification |
| Storage | Supabase Storage | Artwork images, certificates, timelapses |
| Deployment | Vercel | Native Next.js, edge functions, CDN |
| Monitoring | Sentry (free tier) | Error tracking |

### Tailwind 4 Notes

Tailwind 4 is **CSS-driven** — no `tailwind.config.ts`. Design tokens go in `globals.css` via `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #f2ca50;
  --color-primary-container: #d4af37;
  --color-background: #14140f;
  --color-on-background: #e6e2d9;
  --color-on-surface-variant: #d0c5af;
  /* ... all 50+ tokens from DESIGN_SYSTEM.md */
  --font-display-xl: "Playfair Display", serif;
  --font-headline-lg: "Playfair Display", serif;
  --font-body-md: "Inter", sans-serif;
  --spacing-gutter: 32px;
  --spacing-section-gap: 120px;
}
```

- **Dark mode:** Use `dark` variant (T4 uses `prefers-color-scheme` by default; we force `.dark` class via `@custom-variant dark (&:where(.dark, .dark *))` in the CSS)
- **ShadCN UI:** Use the `@shadcn/ui` CLI with Tailwind 4 support flag
- **No JS config migration needed** — the designs already use `darkMode: "class"` which Tailwind 4 handles differently; we'll use a CSS custom variant to preserve the class-based toggle

---

## 2. Project Structure

```
thangkahub/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (providers, fonts, metadata)
│   │   ├── page.tsx                  # Home / Landing
│   │   ├── loading.tsx               # Root loading skeleton
│   │   ├── error.tsx                 # Root error boundary
│   │   ├── not-found.tsx             # 404
│   │   │
│   │   ├── (marketing)/              # Public group layout
│   │   │   ├── layout.tsx            # Navbar + Footer
│   │   │   ├── marketplace/
│   │   │   │   ├── page.tsx          # Browse + search + filters
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Artwork detail
│   │   │   ├── artists/
│   │   │   │   ├── page.tsx          # Artist directory
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Artist profile
│   │   │   └── knowledge-hub/
│   │   │       ├── page.tsx          # Articles listing
│   │   │       └── [slug]/
│   │   │           └── page.tsx      # Article detail
│   │   │
│   │   ├── (auth)/                   # Auth group (no nav/footer)
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── verify/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/              # Protected dashboard group
│   │   │   ├── layout.tsx            # Dashboard sidebar layout
│   │   │   ├── page.tsx              # Role-based redirect
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          # Admin overview
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx      # User management
│   │   │   │   ├── artists/
│   │   │   │   │   └── page.tsx      # Artist approvals
│   │   │   │   └── artworks/
│   │   │   │       └── page.tsx      # Platform moderation
│   │   │   ├── artist/
│   │   │   │   ├── page.tsx          # Artist dashboard
│   │   │   │   ├── artworks/
│   │   │   │   │   ├── page.tsx      # My artworks list
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx  # Upload artwork
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx # Edit artwork
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx      # Edit artist profile
│   │   │   │   └── orders/
│   │   │   │       └── page.tsx      # Orders received
│   │   │   └── customer/
│   │   │       ├── page.tsx          # Customer dashboard
│   │   │       ├── orders/
│   │   │       │   └── page.tsx      # Order history
│   │   │       ├── wishlist/
│   │   │       │   └── page.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   │
│   │   └── api/                      # API route handlers
│   │       ├── auth/
│   │       │   └── callback/         # Supabase OAuth callback
│   │       ├── payments/
│   │       │   ├── khalti/
│   │       │   │   ├── initiate/
│   │       │   │   └── verify/
│   │       │   ├── esewa/
│   │       │   │   ├── initiate/
│   │       │   │   └── verify/
│   │       │   └── stripe/
│   │       │       └── webhook/
│   │       └── search/
│   │           └── route.ts          # Search API endpoint
│   │
│   ├── components/
│   │   ├── ui/                       # ShadCN primitives (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   └── separator.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.tsx            # Top navigation
│   │   │   ├── footer.tsx            # Site footer
│   │   │   ├── side-drawer.tsx       # Mobile menu drawer
│   │   │   ├── dashboard-sidebar.tsx # Dashboard navigation
│   │   │   └── mobile-filter-fab.tsx # Floating filter button
│   │   │
│   │   ├── art/
│   │   │   ├── art-card.tsx          # Marketplace card
│   │   │   ├── art-grid.tsx          # Responsive grid wrapper
│   │   │   ├── art-detail.tsx        # Full artwork view
│   │   │   ├── art-image-gallery.tsx # Multi-image viewer
│   │   │   └── art-certificate.tsx   # Certificate of authenticity display
│   │   │
│   │   ├── artist/
│   │   │   ├── artist-card.tsx       # Artist preview card
│   │   │   ├── artist-profile.tsx    # Full artist profile
│   │   │   └── artist-grid.tsx       # Artist directory grid
│   │   │
│   │   ├── marketplace/
│   │   │   ├── filter-sidebar.tsx    # Desktop filter panel
│   │   │   ├── search-bar.tsx        # Search with suggestions
│   │   │   ├── sort-select.tsx       # Sort dropdown
│   │   │   └── active-filters.tsx    # Filter chips/tags
│   │   │
│   │   ├── cart/
│   │   │   ├── cart-drawer.tsx       # Slide-out cart
│   │   │   ├── cart-item.tsx         # Individual cart item
│   │   │   └── checkout-form.tsx     # Shipping + payment form
│   │   │
│   │   ├── shared/
│   │   │   ├── gold-button.tsx       # Primary CTA button
│   │   │   ├── outline-button.tsx    # Secondary CTA
│   │   │   ├── section-header.tsx    # Reusable section heading
│   │   │   ├── testimonial.tsx       # Testimonial block
│   │   │   ├── process-steps.tsx     # Creation journey steps
│   │   │   └── badge-verified.tsx    # Verified authentic badge
│   │   │
│   │   └── knowledge/
│   │       └── article-card.tsx      # Knowledge hub article card
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client (public anon key)
│   │   │   ├── server.ts             # Server client (service role for RLS bypass)
│   │   │   └── middleware.ts         # Auth middleware for protected routes
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client init
│   │   │   └── schema.ts             # Drizzle schema definitions
│   │   ├── auth/
│   │   │   ├── actions.ts            # Server actions: login, register, logout
│   │   │   └── roles.ts              # Role check utilities
│   │   ├── payments/
│   │   │   ├── khalti.ts             # Khalti integration
│   │   │   ├── esewa.ts              # eSewa integration
│   │   │   └── stripe.ts             # Stripe integration
│   │   ├── validators/
│   │   │   ├── artwork.ts            # Artwork schemas
│   │   │   ├── artist.ts             # Artist profile schemas
│   │   │   ├── auth.ts               # Auth schemas (login/register)
│   │   │   └── order.ts              # Order/checkout schemas
│   │   ├── utils/
│   │   │   ├── cn.ts                 # Tailwind class merge
│   │   │   ├── currency.ts           # Currency formatting
│   │   │   └── slug.ts               # URL slug generation
│   │   └── constants/
│   │       ├── site.ts               # Site metadata, nav links
│   │       ├── filters.ts            # Filter option definitions
│   │       └── currencies.ts         # Currency config
│   │
│   ├── hooks/
│   │   ├── use-cart.ts               # Cart state (context or zustand)
│   │   ├── use-debounce.ts           # Search debounce
│   │   └── use-media-query.ts        # Responsive breakpoint detection
│   │
│   ├── types/
│   │   ├── database.ts               # Generated DB types from Drizzle
│   │   ├── artwork.ts                # Artwork + filter types
│   │   ├── artist.ts                 # Artist profile types
│   │   ├── user.ts                   # User + role types
│   │   └── order.ts                  # Order + cart types
│   │
│   └── styles/
│       ├── globals.css               # Tailwind directives + custom CSS
│       └── fonts.ts                  # Font loading (Playfair Display, Inter)
│
├── supabase/
│   └── migrations/                   # Drizzle-generated migrations
│
├── public/
│   ├── images/                       # Static images (logo, placeholders)
│   └── icons/                        # Favicon, app icons
│
├── drizzle.config.ts
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── .env.local                        # Supabase keys, payment keys
├── .env.example
└── README.md
```

---

## 3. Database Schema (Drizzle ORM)

### 3.1 Users & Auth (extends Supabase Auth)

```sql
-- Supabase auth.users handles: id, email, encrypted_password, created_at, etc.

-- Extended profile
profiles:
  id            uuid PK (references auth.users)
  role          user_role ENUM('client', 'artist', 'admin') DEFAULT 'client'
  full_name     text
  avatar_url    text
  phone         text
  country       text
  created_at    timestamptz

-- Admin-granted artist account
artists:
  id            uuid PK (references profiles.id)
  slug          text UNIQUE                 -- URL-friendly name
  bio           text
  lineage       text                        -- Artistic lineage/tradition
  specialization text[]                     -- Array: ['Mandala','Deities','Landscape']
  experience_years int
  location      text                        -- Kathmandu, Patan, etc.
  awards        jsonb                       -- [{title, year}]
  studio_images text[]                      -- Supabase storage URLs
  is_verified   boolean DEFAULT false
  is_featured   boolean DEFAULT false       -- Admin-curated
  created_at    timestamptz
```

### 3.2 Artworks

```sql
artworks:
  id              uuid PK
  artist_id       uuid FK → artists.id
  slug            text UNIQUE
  title           text
  description     text                        -- The story: symbolism, inspiration
  deity           text                        -- Buddha, Tara, Mahakala, etc.
  style           text                        -- Karma Gadri, Newari, Tibetan, etc.
  medium          text                        -- Mineral pigments, gold leaf, cotton canvas
  materials       text[]                      -- ['24K Gold','Lapis Lazuli','Vermilion']
  dimensions_cm   jsonb                       -- {height, width}
  price_npr       integer                     -- Price in NPR (base currency)
  price_usd       integer                     -- Computed or manual USD price
  year_created    integer
  images          text[]                      -- Supabase storage URLs (first = primary)
  status          artwork_status ENUM('available','sold','reserved','draft')
  is_verified     boolean DEFAULT false
  certificate_id  uuid FK → certificates.id
  created_at      timestamptz
  updated_at      timestamptz

artwork_categories:
  artwork_id  uuid FK → artworks.id
  category    text                            -- 'Mandala','Deity','Life of Buddha','Landscape','Abstract'
  PRIMARY KEY (artwork_id, category)
```

### 3.3 Creation Steps (Time-lapse Archive)

```sql
creation_steps:
  id            uuid PK
  artwork_id    uuid FK → artworks.id
  step_number   integer
  title         text                          -- 'Sketch','Base Color','Detail','Gold Leaf','Final'
  description   text
  image_url     text                          -- Progress photo
  duration_days integer                       -- How long this step took
  created_at    timestamptz
```

### 3.4 Certificates

```sql
certificates:
  id              uuid PK
  artwork_id      uuid FK → artworks.id (unique)
  certificate_no  text UNIQUE                 -- 'KA-2024-001'
  issued_date     date
  materials_audit jsonb                       -- {gold_verified, pigments_verified, canvas_type}
  blockchain_ref  text                        -- Future: blockchain hash
  qr_code_url     text
  created_at      timestamptz
```

### 3.5 Orders & Cart

```sql
orders:
  id              uuid PK
  customer_id     uuid FK → profiles.id
  status          order_status ENUM('pending','confirmed','shipped','delivered','cancelled')
  total_npr       integer
  total_usd       integer
  payment_method  text                        -- 'khalti','esewa','stripe'
  payment_id      text                        -- Gateway transaction ID
  shipping_name   text
  shipping_address jsonb
  shipping_phone  text
  notes           text
  created_at      timestamptz

order_items:
  id          uuid PK
  order_id    uuid FK → orders.id
  artwork_id  uuid FK → artworks.id
  price_npr   integer                         -- Price at time of purchase
  quantity    integer DEFAULT 1

cart_items:
  id          uuid PK
  user_id     uuid FK → profiles.id
  artwork_id  uuid FK → artworks.id
  added_at    timestamptz
  UNIQUE (user_id, artwork_id)
```

### 3.6 Wishlist

```sql
wishlist_items:
  id          uuid PK
  user_id     uuid FK → profiles.id
  artwork_id  uuid FK → artworks.id
  added_at    timestamptz
  UNIQUE (user_id, artwork_id)
```

---

## 4. Route Design & Data Flow

### 4.1 Public Routes

| Route | Render | Data Source | Description |
|---|---|---|---|
| `/` | Static + ISR | Supabase (featured artworks, artists) | Landing page with hero, categories, featured |
| `/marketplace` | SSR (dynamic) | Supabase filtered query | Browse with filters in URL searchParams |
| `/marketplace/[slug]` | SSR | Supabase single artwork | Artwork detail with images, story, certificate |
| `/artists` | SSR | Supabase artists | Artist directory |
| `/artists/[slug]` | SSR | Supabase artist + artworks | Artist profile with full portfolio |
| `/knowledge-hub` | ISR (1h) | Supabase articles | Article listing |
| `/knowledge-hub/[slug]` | ISR (1h) | Supabase single article | Article detail |

### 4.2 Auth Routes

| Route | Type | Description |
|---|---|---|
| `/login` | Client | Email/password + OAuth options |
| `/register` | Client | Registration form |
| `/auth/callback` | API | Supabase OAuth callback handler |

### 4.3 Protected Dashboard Routes

| Route | Role | Description |
|---|---|---|
| `/dashboard` | All | Role-based redirect |
| `/dashboard/admin/users` | Admin | User list, role management, artist approval |
| `/dashboard/admin/artworks` | Admin | Moderation queue |
| `/dashboard/artist` | Artist | Stats overview (views, orders, revenue) |
| `/dashboard/artist/artworks` | Artist | CRUD artwork listings |
| `/dashboard/artist/artworks/new` | Artist | Upload form (multi-step) |
| `/dashboard/artist/profile` | Artist | Edit bio, images, lineage |
| `/dashboard/artist/orders` | Artist | Orders received |
| `/dashboard/customer` | Customer | Overview |
| `/dashboard/customer/orders` | Customer | Order history |
| `/dashboard/customer/wishlist` | Customer | Saved items |
| `/dashboard/customer/settings` | Customer | Profile edit |

### 4.4 API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/payments/khalti/initiate` | POST | Start Khalti payment |
| `/api/payments/khalti/verify` | POST | Verify Khalti payment |
| `/api/payments/esewa/initiate` | POST | Start eSewa payment |
| `/api/payments/esewa/verify` | POST | Verify eSewa payment |
| `/api/payments/stripe/webhook` | POST | Stripe webhook handler |
| `/api/search` | GET | Quick-search artworks (debounced, for search bar autocomplete) |

---

## 5. Authentication & Authorization Flow

### 5.1 Role Model

```
Client (default on signup) → Can browse, buy, review, wishlist
Artist (admin-upgrades a client) → Can upload/manage artworks, view orders
Admin → Can manage users, approve artists, moderate content
```

### 5.2 Auth Flow

1. User registers → `profiles` row created with role='client'
2. User logs in → Supabase session cookie set
3. Middleware checks session on protected routes
4. Admin upgrades a client → sets `profiles.role = 'artist'`, creates `artists` row
5. RLS policies enforce role-based access at database level

### 5.3 RLS Policies (Key Ones)

```sql
-- Artists can only edit their own artworks
CREATE POLICY "artist_own_artworks" ON artworks
  FOR UPDATE USING (artist_id = auth.uid());

-- Everyone can view available artworks
CREATE POLICY "public_view_available" ON artworks
  FOR SELECT USING (status = 'available');

-- Only admins can change user roles
CREATE POLICY "admin_update_roles" ON profiles
  FOR UPDATE USING (
    EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 6. Component Architecture (Key Components)

### 6.1 Layout Shell

```
RootLayout
├── Providers (Theme, Auth, Cart, Toast)
├── MarketingLayout
│   ├── Navbar
│   │   ├── Logo
│   │   ├── NavLinks
│   │   ├── SearchButton
│   │   ├── CartButton (with badge count)
│   │   ├── UserMenu (avatar or login link)
│   │   └── MobileMenuToggle
│   ├── [Page Content]
│   └── Footer
├── AuthLayout (minimal, no nav)
└── DashboardLayout
    ├── DashboardSidebar
    ├── DashboardHeader
    └── [Dashboard Content]
```

### 6.2 Marketplace Page Component Tree

```
MarketplacePage
├── SearchBar (with debounced autocomplete)
├── ActiveFilters (removable chips)
├── FilterSidebar
│   ├── DeityFilter (checkboxes)
│   ├── StyleFilter (checkboxes)
│   ├── ArtistGradeFilter (radios)
│   ├── SizeFilter (button group)
│   ├── PriceRangeFilter (range slider)
│   └── MaterialFilter (checkboxes)
├── SortSelect (dropdown)
├── ArtGrid
│   └── ArtCard[] (responsive grid)
│       ├── ArtImage (aspect-ratio box, grayscale→color hover)
│       ├── StatusBadge (Available/Reserved/Sold)
│       ├── Title + Artist
│       ├── VerifiedBadge
│       └── Price
└── Pagination
```

### 6.3 Artwork Detail Page

```
ArtworkDetailPage
├── ArtImageGallery (main image + thumbnails)
├── ArtInfo
│   ├── Title + Artist link
│   ├── Price (NPR + USD)
│   ├── StatusBadge
│   ├── VerifiedBadge + Certificate link
│   ├── StorySection (rich text: symbolism, deity info, inspiration)
│   ├── MaterialsSection (icons for gold, pigments, canvas)
│   ├── DimensionsSection
│   └── AddToCartButton / BuyNowButton
├── CreationStepsSection (optional timeline)
├── ArtistCard (preview, link to full profile)
└── RelatedArtworks (same artist or style)
```

---

## 7. Payment Integration Strategy

### 7.1 Khalti (NPR, primary for Nepal customers)

```
Client                          Server                    Khalti
  │                               │                         │
  ├─ Select Khalti ──────────────►│                         │
  │                               ├─ POST /api/payments/    │
  │                               │   khalti/initiate ─────►│
  │                               │◄── pidx, payment_url ──┤
  │◄── redirect to Khalti page ───┤                         │
  │                               │                         │
  │── Complete payment on Khalti ─┼────────────────────────►│
  │◄── redirect back with pidx ───┤                         │
  │                               │                         │
  │── GET /checkout/success ─────►│                         │
  │                               ├─ POST /api/payments/    │
  │                               │   khalti/verify ───────►│
  │                               │◄── status ─────────────┤
  │                               ├─ Create order in DB     │
  │◄── Order confirmation ────────┤                         │
```

### 7.2 eSewa (NPR, secondary Nepal option)

Similar flow but uses eSewa's API. Both Khalti and eSewa use a redirect-based flow common in Nepal.

### 7.3 Stripe (USD, international customers)

Stripe Checkout for international purchases. Webhook-based order confirmation.

### 7.4 Currency Strategy (MVP)
- Base currency: NPR (all prices stored in NPR)
- USD display: Use a configurable exchange rate (admin-set, not live FX for MVP)
- At checkout, auto-select payment gateway based on customer country

---

## 8. Search & Filter Architecture

### 8.1 Filter State

Filters live in URL searchParams (shareable, bookmarkable, SSR-compatible):

```
/marketplace?deity=Buddha,Tara&style=Karma+Gadri&price_min=1000&price_max=5000&size=medium&sort=newest&page=1
```

### 8.2 Database Query Strategy

```typescript
// Server Component — reads searchParams and builds Supabase query
async function getArtworks(searchParams: FilterParams) {
  let query = supabase
    .from('artworks')
    .select('*, artists(*), certificates(*)')
    .eq('status', 'available');

  if (searchParams.deity) {
    query = query.in('deity', searchParams.deity.split(','));
  }
  if (searchParams.style) {
    query = query.in('style', searchParams.style.split(','));
  }
  if (searchParams.price_min) {
    query = query.gte('price_npr', searchParams.price_min);
  }
  if (searchParams.price_max) {
    query = query.lte('price_npr', searchParams.price_max);
  }
  // ... more filters

  return query.range(offset, offset + pageSize);
}
```

### 8.3 Full-Text Search

Supabase PostgreSQL supports `tsvector`. Create a generated column:

```sql
ALTER TABLE artworks ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(deity, ''))
  ) STORED;

CREATE INDEX artwork_search_idx ON artworks USING GIN(search_vector);
```

---

## 9. Implementation Phases (2 Weeks)

### Phase 1: Foundation (Days 1-3)

| Task | Hours | Owner |
|---|---|---|
| Initialize Next.js 15 project with TypeScript | 0.5 | Dev |
| Configure Tailwind CSS with design tokens from DESIGN_SYSTEM.md | 1 | Dev |
| Install & configure ShadCN UI components | 1 | Dev |
| Set up Supabase project + Drizzle ORM | 2 | Dev |
| Write full database schema + run migrations | 3 | Dev |
| Set up Supabase Auth (email/password) | 2 | Dev |
| Create layout shell (Navbar, Footer, SideDrawer) | 4 | Dev |
| Build auth pages (login, register, callback) | 3 | Dev |
| Implement role-based middleware | 2 | Dev |
| **Milestone:** User can register, login, and see their role | | |

### Phase 2: Core Data Models (Days 3-5)

| Task | Hours | Owner |
|---|---|---|
| Artist profile CRUD (admin approval flow) | 4 | Dev |
| Artwork upload form (artist dashboard) | 6 | Dev |
| Artwork CRUD server actions | 4 | Dev |
| Creation steps upload (time-lapse) | 3 | Dev |
| Certificate generation (server-side) | 3 | Dev |
| Image upload to Supabase Storage | 2 | Dev |
| Seed database with sample data | 2 | Dev |
| **Milestone:** Artists can upload artworks, admins can approve | | |

### Phase 3: Public Marketplace (Days 5-8)

| Task | Hours | Owner |
|---|---|---|
| Home page (hero, platform overview, featured artists, featured artworks) | 6 | Dev |
| Marketplace listing page with server-side filtering | 8 | Dev |
| ArtGrid + ArtCard components | 4 | Dev |
| FilterSidebar + all filter controls | 6 | Dev |
| SearchBar with debounced autocomplete | 4 | Dev |
| Pagination component | 2 | Dev |
| Artwork detail page (story-driven layout) | 6 | Dev |
| Artist directory page | 3 | Dev |
| Artist profile page (with portfolio) | 4 | Dev |
| **Milestone:** Public can browse, search, filter, and view artwork/artist details | | |

### Phase 4: Cart + Checkout (Days 8-11)

| Task | Hours | Owner |
|---|---|---|
| Cart state management (Zustand + Supabase persistence) | 4 | Dev |
| CartDrawer component | 4 | Dev |
| Checkout page (shipping form) | 4 | Dev |
| Khalti integration (initiate + verify) | 5 | Dev |
| eSewa integration (initiate + verify) | 5 | Dev |
| Stripe Checkout integration | 4 | Dev |
| Order creation + confirmation flow | 4 | Dev |
| Order history (customer + artist dashboards) | 3 | Dev |
| **Milestone:** Complete purchase flow works end-to-end | | |

### Phase 5: Polish + Launch (Days 11-14)

| Task | Hours | Owner |
|---|---|---|
| Admin dashboard (user management, artist approval) | 6 | Dev |
| Knowledge Hub (simple article pages, optional) | 4 | Dev |
| Responsive QA (mobile, tablet, desktop) | 4 | Dev |
| Performance optimization (image optimization, caching) | 4 | Dev |
| SEO (metadata, sitemap, structured data) | 3 | Dev |
| Error boundaries + loading states | 3 | Dev |
| Toast notifications + UX polish | 2 | Dev |
| Deployment to Vercel + domain setup | 2 | Dev |
| **Milestone:** Production-ready MVP deployed | | |

---

## 10. Key Technical Decisions

### 10.1 Why Drizzle over Prisma?
- **Lighter:** No code generation step, smaller bundle
- **Edge-compatible:** Works in Next.js edge runtime
- **SQL-like:** Familiar query syntax, easier debugging
- **Migration-first:** Explicit migration files

### 10.2 Why Server Components for Marketplace?
- **SEO:** Thangka art is visual but discoverability depends on text content (deity names, symbolism, artist names)
- **Performance:** Filter queries run server-side, no client-side waterfall
- **URL-based filters:** Shareable search results via searchParams

### 10.3 Why Zustand for Cart?
- **Lightweight:** ~1KB, no boilerplate
- **Persist middleware:** Syncs to localStorage automatically
- **Works with Supabase:** Can sync cart to DB for logged-in users

### 10.4 Image Strategy
- Upload: Supabase Storage (S3-compatible)
- Serve: Supabase CDN (or Vercel Image Optimization for on-the-fly transforms)
- Upload sizes: Max 5MB, resized client-side before upload
- Display: Next.js `next/image` with `sharp` for optimization

---

## 11. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Payments
KHALTI_SECRET_KEY=
KHALTI_PUBLIC_KEY=
ESEWA_SECRET_KEY=
ESEWA_PUBLIC_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Resend)
RESEND_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_NAME=Kathmandu Arts

# Exchange Rate (set by admin, used for USD display)
NEXT_PUBLIC_USD_EXCHANGE_RATE=134
```

---

## 12. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Khalti/eSewa API changes | High | Abstract payment interface; keep Stripe as fallback |
| Supabase cold starts | Medium | Keep connections warm via ISR revalidation |
| 2-week timeline too tight | High | Cut Knowledge Hub, time-lapse if needed; focus on marketplace core |
| Image upload abuse | Medium | RLS + size limits + rate limiting in middleware |
| NPR/USD pricing confusion | Low | Clear currency toggle in UI; store NPR as canonical |
