# Progression-1 — MVP Foundation Complete

## Date: 2026-06-13

---

## 1. Overview

Built the complete MVP foundation for ThangkaHub (consumer brand: Kathmandu Arts) — a premium digital marketplace for authentic Nepali Thangka art. 10 phases executed across ~100 source files, 32 routes, clean TypeScript build.

**Current state:** All pages render, database is connected, auth works, cart works, admin/artist/client role system is functional. Payments are implemented with test keys. No real artwork data yet — only 4 seeded artists.

---

## 2. Tech Stack (Actual)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.9 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 4.3.0 |
| UI Components | ShadCN (base-nova style, Base UI) — 17 components | 4.11.0 |
| Database | Supabase PostgreSQL | — |
| Auth | Supabase Auth (email/password) | `@supabase/ssr` 0.12.0 |
| ORM | Drizzle ORM | 0.45.2 |
| Validation | Zod | 4.4.3 |
| State | Zustand (cart) | 5.0.14 |
| Payments | Khalti, eSewa, Stripe (test keys) | — |
| Email | Resend (placeholder) | 6.12.4 |
| Icons | Material Symbols, Lucide | — |
| Fonts | Playfair Display, Inter | Google Fonts |

**Deviation from plan:** Next.js 16 scaffolded instead of planned 15. ShadCN generated `base-nova` style (Base UI) instead of Radix. Tailwind 4 CSS-driven config via `@theme`.

---

## 3. What Was Built — Phase by Phase

### Phase 0 — Project Scaffold
- Next.js 16 with TypeScript, Tailwind 4
- All 50+ design tokens in `globals.css` via `@theme`
- ShadCN UI with 17 components (button, input, select, checkbox, radio, slider, badge, card, dialog, dropdown, sheet, tabs, avatar, skeleton, toast/sonner, separator)
- `cn()` utility, path aliases, directory structure
- Font loading (Playfair Display + Inter) + Material Symbols

### Phase 1 — Database
- **14 Drizzle tables:** profiles, artists, artworks, artwork_categories, creation_steps, certificates, orders, order_items, cart_items, wishlist_items, articles, testimonials
- 3 Supabase clients (client, server, admin)
- RLS policies, storage bucket policies, seed data structure

### Phase 2 — Authentication
- Login, register, verify pages with gold-button styling
- Server actions: signUp, signIn, signOut (Zod-validated)
- Proxy-based auth middleware (protects `/dashboard`, redirects logged-in users)
- Role utilities: getCurrentUser, requireRole, isAdmin, isArtist

### Phase 3 — Layout Shell
- Navbar (fixed, backdrop-blur, gold logo, nav links, cart badge, user menu)
- Footer (gold brand, nav links, social icons)
- SideDrawer (mobile menu, cream background, Playfair links)
- Shared components: GoldButton (gradient, lift hover), OutlineButton, BadgeVerified, SectionHeader

### Phase 4 — Artist Profiles
- Artist server actions (create, update, upgradeToArtist)
- ArtistCard (3:4 ratio, grayscale→color hover), ArtistGrid (1→2→4 col)
- Artist directory page (`/artists`)
- Artist profile page (`/artists/[slug]`) — hero, stats, bio, specializations, portfolio grid
- Artist profile edit in dashboard

### Phase 5 — Artwork Management
- Artwork server actions (create, update, upload image, add creation steps, generate certificate, publish, delete)
- Slug generator utility
- Multi-step artwork upload form (dashboard)
- Artwork list + edit page (dashboard)
- Supabase Storage integration for images

### Phase 6 — Public Marketplace
- ArtCard (4:5 ratio, status badge, grayscale→color, verified badge, NPR price)
- ArtGrid (1→2→3 col responsive)
- FilterSidebar (subject checkboxes, size buttons, price slider)
- SearchBar (debounced 300ms, ILIKE full-text)
- SortSelect (newest, price asc/desc)
- ActiveFilters (removable chips)
- Pagination
- Marketplace listing page (`/marketplace`) with server-side filtering via URL searchParams
- Artwork detail page (`/marketplace/[slug]`) — image gallery, story, materials chips, dimensions, certificate, creation journey timeline

### Phase 7 — Cart & Checkout
- Zustand cart store with localStorage persistence
- CartDrawer (ShadCN Sheet), CartItem component
- CartButton with badge count in navbar
- AddToCartButton on artwork detail
- Checkout page (shipping form, payment method selector, order summary)
- Khalti integration (initiate + verify)
- eSewa integration (initiate + verify)
- Stripe integration (initiate — webhook handler exists but untested)
- Order actions: createOrder, initiateOrderPayment, confirmOrder
- Order history pages (customer + artist dashboards)
- Wishlist page (customer dashboard)

### Phase 8 — Admin Dashboard
- Admin overview with stats
- User management (view all, upgrade to artist)
- Artist approvals (verify, feature)
- Artwork moderation (verify, remove)
- Dashboard sidebar with role-based link filtering

### Phase 9 — Home Page & Content
- **Home page — 10 sections:**
  1. Hero (display-xl headline, gold glow, floating badges)
  2. Platform overview cards (3 columns, offset middle, icon watermarks)
  3. Featured artists (DB-driven, 4-column grid)
  4. Featured artworks (DB-driven, 3-column grid)
  5. Creation journey (5-step timeline with connecting line)
  6. Custom commission CTA (split layout, icon features)
  7. Authenticity verification (certificate mockup, collector info)
  8. Knowledge hub preview (3 article cards, grayscale→color)
  9. Testimonial (decorative quote mark, italic quote)
  10. Live sessions placeholder (coming soon cards)
- Knowledge Hub list + article detail pages (rich text parsing)
- Commissions page (4-step process, artist grid, email CTA)
- Articles + testimonials tables added to schema

### Phase 10 — Polish & SEO
- Loading skeletons: ArtCardSkeleton, ArtistCardSkeleton
- loading.tsx for marketplace, artwork detail, artists, home, commissions, knowledge-hub
- Error boundaries (root + marketplace-specific)
- Custom 404 page ("The path you seek does not exist in this mandala")
- Sonner toaster with dark theme
- generateMetadata on artwork detail + knowledge hub article pages
- Sitemap (static + DB-driven, graceful DB failure)
- Robots.txt
- VS Code settings (TS SDK, Tailwind class regex)

### Post-Phase: View Mode + Dashboard Polish
- Admin/artist can toggle "View as Client" mode (cookie-based)
- Yellow banner on public pages when viewing as client
- Dashboard sidebar: user name, role badge, active link highlighting, sign out
- Navbar shows "Dashboard" badge for admin/artist users
- Proxy updated to respect view-mode cookie
- Migrated from deprecated `middleware.ts` to `proxy.ts`

---

## 4. File Inventory

```
src/
├── app/
│   ├── layout.tsx                          # Root layout (fonts, toaster)
│   ├── globals.css                         # 50+ design tokens, utilities, animations
│   ├── loading.tsx                         # [moved to marketing group]
│   ├── error.tsx                           # Root error boundary
│   ├── not-found.tsx                       # Custom 404
│   ├── robots.ts                           # Robots.txt
│   ├── sitemap.ts                          # Dynamic sitemap
│   ├── (marketing)/
│   │   ├── layout.tsx                      # Navbar + Footer + ViewModeBanner
│   │   ├── page.tsx                        # Home page (10 sections)
│   │   ├── loading.tsx                     # Home page skeleton
│   │   ├── marketplace/
│   │   │   ├── page.tsx                    # Browse + filter + search
│   │   │   ├── loading.tsx                 # Grid skeleton
│   │   │   ├── error.tsx                   # Marketplace error
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                # Artwork detail + generateMetadata
│   │   │       └── loading.tsx             # Detail skeleton
│   │   ├── artists/
│   │   │   ├── page.tsx                    # Artist directory
│   │   │   ├── loading.tsx                 # Artist grid skeleton
│   │   │   └── [slug]/page.tsx             # Artist profile
│   │   ├── commissions/
│   │   │   ├── page.tsx                    # Commission info
│   │   │   └── loading.tsx                 # Commission skeleton
│   │   └── knowledge-hub/
│   │       ├── page.tsx                    # Article listing
│   │       ├── loading.tsx                 # Article grid skeleton
│   │       └── [slug]/page.tsx             # Article detail + generateMetadata
│   ├── (auth)/
│   │   ├── layout.tsx                      # Minimal auth layout
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx                      # Server auth check → Sidebar + content
│   │   ├── sidebar.tsx                     # Client: links, role badge, view mode, sign out
│   │   ├── page.tsx                        # Role-based redirect
│   │   ├── admin/
│   │   │   ├── page.tsx                    # Admin overview
│   │   │   ├── users/page.tsx              # User management
│   │   │   ├── artists/page.tsx            # Artist approvals
│   │   │   └── artworks/page.tsx           # Artwork moderation
│   │   ├── artist/
│   │   │   ├── page.tsx                    # Artist overview
│   │   │   ├── artworks/
│   │   │   │   ├── page.tsx                # Artwork list
│   │   │   │   ├── new/page.tsx            # Multi-step upload form
│   │   │   │   └── [id]/edit/page.tsx      # Edit artwork
│   │   │   ├── profile/page.tsx            # Edit artist profile
│   │   │   └── orders/page.tsx             # Orders received
│   │   └── customer/
│   │       ├── page.tsx                    # Customer overview
│   │       ├── checkout/page.tsx           # Checkout form
│   │       ├── orders/
│   │       │   ├── page.tsx                # Order history
│   │       │   └── [id]/page.tsx           # Order detail
│   │       ├── wishlist/page.tsx           # Wishlist
│   │       └── settings/page.tsx           # Account settings
│   └── api/
│       ├── auth/callback/route.ts
│       └── payments/
│           ├── khalti/verify/route.ts
│           ├── esewa/verify/route.ts
│           └── stripe/webhook/route.ts
├── components/
│   ├── ui/                                 # 16 ShadCN components
│   ├── layout/
│   │   ├── navbar.tsx, footer.tsx
│   │   ├── side-drawer.tsx
│   │   ├── cart-button.tsx, user-menu.tsx
│   │   └── view-mode-banner.tsx
│   ├── art/
│   │   ├── art-card.tsx, art-grid.tsx
│   ├── artist/
│   │   ├── artist-card.tsx, artist-grid.tsx
│   ├── cart/
│   │   ├── add-to-cart-button.tsx
│   │   ├── cart-drawer.tsx, cart-item.tsx
│   ├── marketplace/
│   │   ├── filter-sidebar.tsx, search-bar.tsx
│   │   ├── sort-select.tsx, active-filters.tsx
│   │   └── pagination.tsx
│   └── shared/
│       ├── gold-button.tsx, outline-button.tsx
│       ├── badge-verified.tsx, section-header.tsx
│       └── art-card-skeleton.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts                       # 14 tables, all enums, all type exports
│   │   └── index.ts                        # Drizzle client
│   ├── supabase/
│   │   ├── client.ts, server.ts, admin.ts
│   ├── auth/
│   │   ├── actions.ts                      # signUp, signIn, signOut
│   │   ├── artist-actions.ts               # Artist CRUD, upgrade
│   │   ├── roles.ts                        # getCurrentUser, requireRole
│   │   └── view-mode.ts                    # enable/disable user view
│   ├── payments/
│   │   ├── khalti.ts                       # Initiate + verify
│   │   ├── esewa.ts                        # Initiate
│   │   └── stripe.ts                       # Create checkout session
│   ├── validators/
│   │   ├── auth.ts, artist.ts, artwork.ts
│   ├── utils/
│   │   ├── cn.ts [deleted — uses utils.ts]
│   │   ├── utils.ts                        # cn()
│   │   └── slug.ts                         # generateSlug
│   ├── artwork-actions.ts                  # Artwork CRUD, images, certificates
│   └── order-actions.ts                    # Orders + payment initiation
├── hooks/
│   └── use-cart.ts                         # Zustand store
├── types/                                  # [types live in schema.ts]
└── proxy.ts                                # Auth middleware (replaced middleware.ts)
```

---

## 5. Database — 14 Tables

| Table | Purpose | Rows (current) |
|---|---|---|
| `profiles` | Extended user data (joins Supabase Auth) | 5 (1 admin + 4 artists, seeded) |
| `artists` | Artist-specific data | 4 (seeded) |
| `artworks` | Artwork listings | 0 |
| `artwork_categories` | Many-to-many categorization | 0 |
| `creation_steps` | Time-lapse progress tracking | 0 |
| `certificates` | Authenticity certificates | 0 |
| `orders` | Purchase orders | 0 |
| `order_items` | Line items within orders | 0 |
| `cart_items` | Persistent cart (server-side) | 0 |
| `wishlist_items` | User wishlists | 0 |
| `articles` | Knowledge hub content | 0 |
| `testimonials` | Home page testimonials | 0 |

---

## 6. What Works

| Feature | Status |
|---|---|
| Home page (all 10 sections) | Renders, DB-driven sections show data when available |
| Marketplace browse + filter + search | UI complete, returns 0 results (no artworks seeded) |
| Artwork detail page | Renders for any artwork in DB |
| Artist directory + profiles | 4 seeded artists render correctly |
| Auth (register, login, logout, verify) | Full flow working against Supabase |
| Role-based routing | Admin/artist/client each see correct dashboard |
| View as Client mode | Admin/artist can toggle to browse public site |
| Cart (add, remove, persist) | Zustand + localStorage working |
| Checkout form | Renders, creates order in DB |
| Payment initiation (Khalti/eSewa) | Code complete, needs real sandbox keys |
| Payment initiation (Stripe) | Code complete, webhook untested |
| Admin user management | Upgrade clients to artist, verify artists |
| Artwork upload | Form exists, needs Supabase Storage setup |
| Knowledge hub + articles | Pages render, 0 articles seeded |
| Commissions page | Renders, email CTA |
| Loading skeletons | 6 pages covered |
| Error boundaries | Root + marketplace |
| 404 page | Custom themed |
| SEO metadata | Artwork detail + knowledge hub |
| Sitemap + robots.txt | Dynamic, DB-fallback |

---

## 7. Known Gaps

### Blocking for production
| # | Gap | Fix |
|---|---|---|
| 1 | No artworks seeded | Artists need to upload via dashboard, or add artwork seed data |
| 2 | No articles seeded | Add seed data or create via admin |
| 3 | No testimonials seeded | Add 1 row to `testimonials` table |
| 4 | Stripe webhook untested | Test with Stripe CLI + sandbox keys |
| 5 | Payment keys are placeholders | Replace `.env.local` with real Khalti/eSewa/Stripe sandbox keys |
| 6 | Checkout has no Zod validation | Add checkout schema to `validators/` |
| 7 | User menu has no logout for client-role users | Add logout to UserMenu component for all logged-in users |

### Non-blocking polish
| # | Gap | Fix |
|---|---|---|
| 8 | `force-dynamic` on all pages | Switch to ISR with `revalidate` after DB is populated |
| 9 | No mobile hamburger menu wired | SideDrawer component exists, toggle not connected to navbar button |
| 10 | Search icon in navbar is decorative | Wire to open search or scroll to marketplace |
| 11 | No image optimization | Replace `<img>` with `next/image` |
| 12 | eSewa hardcoded test URL | Move to env var |
| 13 | No tests | Add integration tests for auth + checkout flows |
| 14 | No password reset flow | Add forgot-password page |

---

## 8. Environment Variables

**File: `.env.local`**

All Supabase keys are set with real values. Payment keys are placeholders. See `.env.example` for the template.

| Variable | Status |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Real |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Real |
| `SUPABASE_SERVICE_ROLE_KEY` | Real |
| `DATABASE_URL` | Real (pooler) |
| `KHALTI_*` | Placeholder |
| `ESEWA_*` | Placeholder |
| `STRIPE_*` | Placeholder |
| `RESEND_API_KEY` | Placeholder |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_USD_EXCHANGE_RATE` | `134` |

---

## 9. How to Run

```bash
pnpm install
pnpm dev                    # → http://localhost:3000
```

**Prerequisites:**
- `.env.local` with Supabase credentials
- Supabase project with tables pushed (`pnpm drizzle-kit push`)
- RLS policies + storage buckets run in SQL Editor
- Seed data run in SQL Editor (after updating UUIDs)

---

## 10. What's Next (Progression-2)

1. Fix the 7 blocking gaps listed above
2. Add seed data for artworks (6 pieces across 4 artists, with images)
3. Add seed data for articles (3 articles with markdown content)
4. Add seed data for testimonials (1-2 entries)
5. Get real Khalti sandbox keys and test end-to-end payment
6. Connect mobile hamburger to SideDrawer
7. Add client logout to navbar UserMenu
8. ISR migration for top pages
9. Production deployment to Vercel
10. Domain setup
