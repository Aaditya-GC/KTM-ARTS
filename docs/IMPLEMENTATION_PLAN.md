# Kathmandu Arts / ThangkaHub — Implementation Plan (v2)

> **Updated to reflect actual project state as built.** This document is both a record of what exists and a guide for remaining work.

---

## Project Identity

- **Consumer brand:** Kathmandu Arts
- **Platform name:** ThangkaHub
- **Tagline:** "The Sacred Archive" / "Preserving Himalayan Heritage"
- **Description:** Premium marketplace for authentic Nepali Thangka art, connecting Kathmandu Valley artists with global collectors
- **Tone:** Luxurious, reverent, scholarly, elite. Museum-meets-high-fashion.
- **Core metaphor:** Gold leaf on aged parchment — warmth, rarity, craftsmanship, spiritual depth

---

## Tech Stack (as built)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.2.9 (App Router) | SSR/SSG, Server Components |
| Language | TypeScript 5.7+ | Strict mode |
| Styling | Tailwind CSS 4 + ShadCN UI + tw-animate-css | CSS-driven `@theme`, no JS config |
| UI Primitives | ShadCN (with @base-ui/react as headless layer) | Components in `src/components/ui/` |
| Database | Supabase PostgreSQL | Managed Postgres |
| Auth | Supabase Auth (email/password) | Server-only session handling |
| ORM | Drizzle ORM 0.45 + postgres.js | Type-safe queries |
| Validation | Zod 4 | Shared schemas |
| Payments | Khalti, eSewa (NPR), Stripe (USD) | All three integrated |
| Cart State | Zustand + localStorage persist | Client-side |
| Email | Resend | Transactional |
| Storage | Supabase Storage (public buckets) | Artwork/artist images |
| Animations | Framer Motion + CSS keyframes | Scroll, hover, transitions |
| Icons | Google Material Symbols Outlined | Variable font |
| Notifications | Sonner | Toast system |
| Deployment | Vercel (target) | |

---

## Design System Status

### Visual Identity Change (from original plan)
The original plan specified a **dark luxury theme** (`#14140f` background). The actual build uses a **warm/light theme** inspired by aged parchment and natural materials:

| Token | Value | Role |
|---|---|---|
| `background` | `#F5F0E8` | Page background (warm cream) |
| `surface` | `#F5F0E8` | Base surface |
| `surface-container-low` | `#EDE5D8` | Card backgrounds |
| `on-background` | `#1C1008` | Primary text (near-black) |
| `on-surface-variant` | `#8C6A4E` | Secondary text (warm brown) |
| `primary` | `#7A5C00` | Gold/ochre |
| `accent` | `#5C3317` | Deep rust (new token, not in original plan) |
| `secondary` | `#1C1008` | Near-black for buttons |
| `tertiary` | `#c4a882` | Warm beige |
| `error` | `#a0522d` | Sienna/terracotta |

Full token set in `src/app/globals.css`. See `docs/DESIGN_SYSTEM.md` for component specs.

### Fonts
- **Display/Headlines:** Playfair Display (serif)
- **Body/Labels:** Inter (sans-serif)
- **Icons:** Material Symbols Outlined (variable font)

### Key Component Status
- GoldButton: Solid `secondary` background (not gradient), hover shifts to `accent`
- Navbar: Fixed, top-0, z-50, backdrop-blur-md
- Footer: `surface-container-lowest` background, brand + links + social icons
- Side drawer: ShadCN Sheet component
- Art cards: Grayscale → color on hover, zoom effect
- Artist cards: 3/4 portrait aspect ratio, grayscale → color hover

---

## Route Structure (as built)

### Marketing Pages (`src/app/(marketing)/`)
| Route | Type | Status |
|---|---|---|
| `/` | Server Component | Built (10-section landing page) |
| `/marketplace` | Server Component | Built (search, filters, pagination, URL searchParams) |
| `/marketplace/[slug]` | Server Component | Built (artwork detail with gallery, story, certificate) |
| `/artists` | Server Component | Built (artist directory) |
| `/artists/[slug]` | Server Component | Built (artist profile with portfolio) |
| `/commissions` | Server Component | Built (commission inquiry page) |
| `/knowledge-hub` | Server Component | Built (article listing) |
| `/knowledge-hub/[slug]` | Server Component | Built (article detail) |

### Auth Pages (`src/app/(auth)/`)
| Route | Type | Status |
|---|---|---|
| `/login` | Client Component | Built |
| `/register` | Client Component | Built |
| `/verify` | Server Component | Built |

### Checkout Pages (`src/app/checkout/`)
| Route | Type | Status |
|---|---|---|
| `/checkout` | Client Component | Built |
| `/checkout/shipping` | Client Component | Built |
| `/checkout/payment` | Client Component | Built |
| `/checkout/confirmation/[orderId]` | Server Component | Built |

### Dashboard Pages (`src/app/dashboard/`)
| Route | Type | Role | Status |
|---|---|---|---|
| `/dashboard` | Server Component | All | Built (role-based redirect) |
| `/dashboard/admin` | Server Component | Admin | Built |
| `/dashboard/admin/users` | Server Component | Admin | Built |
| `/dashboard/admin/artists` | Server Component | Admin | Built |
| `/dashboard/admin/artworks` | Server Component | Admin | Built |
| `/dashboard/artist` | Server Component | Artist | Built |
| `/dashboard/artist/artworks` | Mixed | Artist | Built |
| `/dashboard/artist/artworks/new` | Client Component | Artist | Built |
| `/dashboard/artist/artworks/[id]/edit` | Client Component | Artist | Built |
| `/dashboard/artist/profile` | Mixed | Artist | Built |
| `/dashboard/artist/orders` | Server Component | Artist | Built |
| `/dashboard/customer` | Server Component | Client | Built |
| `/dashboard/customer/orders` | Server Component | Client | Built |
| `/dashboard/customer/orders/[id]` | Server Component | Client | Built |
| `/dashboard/customer/wishlist` | Server Component | Client | Built |
| `/dashboard/customer/settings` | Server Component | Client | Built |
| `/dashboard/customer/checkout` | Client Component | Client | Built |

### API Routes
| Route | Method | Status |
|---|---|---|
| `/api/auth/callback` | GET | Built (Supabase OAuth callback) |
| `/api/payments/khalti/verify` | GET | Built |
| `/api/payments/esewa/verify` | GET | Built |
| `/api/payments/stripe/webhook` | POST | Built |
| Search API (`/api/search` suggested) | — | Not built (search handled server-side via ILIKE) |

---

## Database Schema (as built — 12 tables)

See `src/lib/db/schema.ts`. Tables: `profiles`, `artists`, `artworks`, `artworkCategories`, `certificates`, `creationSteps`, `orders`, `orderItems`, `cartItems`, `wishlistItems`, `articles`, `testimonials`.

**Enums:** `user_role` (client, artist, admin), `artwork_status` (available, sold, reserved, draft), `order_status` (pending, paid, shipped, delivered, cancelled)

**Notable additions vs original plan:**
- `orders` table has `stripePaymentIntentId`, `currency`, `updatedAt` columns
- `orderItems` table has `priceAtPurchase` column
- `certificate_id` on `artworks` is nullable (not a FK reference, value stored directly)
- `articles` and `testimonials` tables exist (not in original Phase 1 schema)

**Migrations:** One manual SQL file at `src/db/migrations/add_orders.sql`. Drizzle-generated migrations not yet run.

---

## Auth System (as built)

- **No middleware.ts** file exists. Auth protection is handled in dashboard layout via `getCurrentUser()` + `redirect()`.
- Server actions in `src/lib/auth/actions.ts`: `signUp`, `signIn`, `signOut`
- Role utilities in `src/lib/auth/roles.ts`: `getCurrentUser()` (cached), `requireRole()`, `isAdmin()`, `isArtist()`
- Admin view-mode toggle in `src/lib/auth/view-mode.ts`: cookie-based "view as client"
- Supabase clients: `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (server with cookie handling)

---

## Component Inventory (as built — 37 files)

| Directory | Files |
|---|---|
| `src/components/art/` | `art-card.tsx`, `art-grid.tsx` |
| `src/components/artist/` | `artist-card.tsx`, `artist-grid.tsx` |
| `src/components/cart/` | `add-to-cart-button.tsx`, `cart-drawer.tsx`, `cart-item.tsx` |
| `src/components/layout/` | `cart-button.tsx`, `footer.tsx`, `mobile-menu.tsx`, `navbar.tsx`, `search-button.tsx`, `user-menu.tsx`, `view-mode-banner.tsx` |
| `src/components/marketplace/` | `active-filters.tsx`, `filter-sidebar.tsx`, `pagination.tsx`, `search-bar.tsx`, `sort-select.tsx` |
| `src/components/search/` | `search-modal.tsx` |
| `src/components/shared/` | `art-card-skeleton.tsx`, `badge-verified.tsx`, `gold-button.tsx`, `outline-button.tsx`, `section-header.tsx` |
| `src/components/ui/` | `button.tsx`, `checkbox.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `sheet.tsx`, `skeleton.tsx`, `slider.tsx` |

---

## Library Structure (as built — 20+ files)

| Path | Purpose |
|---|---|
| `src/lib/auth/actions.ts` | Sign up, sign in, sign out server actions |
| `src/lib/auth/artist-actions.ts` | Artist profile CRUD, image upload |
| `src/lib/auth/roles.ts` | `getCurrentUser`, `requireRole`, role checks |
| `src/lib/auth/view-mode.ts` | Admin view-as-client toggle |
| `src/lib/artwork-actions.ts` | Artwork CRUD, creation steps, certificates, publishing |
| `src/lib/checkout-actions.ts` | Order creation, retrieval |
| `src/lib/checkout-store.ts` | Zustand store for checkout flow state |
| `src/lib/order-actions.ts` | Order creation with payment initiation |
| `src/lib/search-actions.ts` | Full-text search across artworks |
| `src/lib/stripe-actions.ts` | Stripe PaymentIntent creation |
| `src/lib/utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `src/lib/utils/slug.ts` | Unique slug generation |
| `src/lib/db/index.ts` | Drizzle client initialization |
| `src/lib/db/schema.ts` | Full DB schema (12 tables) |
| `src/lib/payments/khalti.ts` | Khalti payment initiation + verification |
| `src/lib/payments/stripe.ts` | Stripe checkout session creation |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/validators/artwork.ts` | Artwork + creation step Zod schemas |
| `src/lib/validators/auth.ts` | Auth Zod schemas |
| `src/lib/validators/artist.ts` | Artist profile Zod schemas |

---

## Supabase SQL Files

| File | Purpose |
|---|---|
| `supabase/seed.sql` | Admin + 4 artist profiles/users |
| `supabase/seed_artworks.sql` | 6 artworks, categories, certificates, creation steps |
| `supabase/rls_policies.sql` | RLS policies for all tables |
| `supabase/storage_buckets.sql` | `artworks` and `artists` public storage buckets |

---

## Comparison: Original Plan vs Actual

| Aspect | Original Plan | Actual |
|---|---|---|
| **Theme** | Dark (#14140f bg) | Light/warm (#F5F0E8 bg) |
| **Next.js** | 15 | 16.2.9 |
| **React** | 18 | 19.2.4 |
| **Auth middleware** | src/middleware.ts | Dashboard layout redirect |
| **cn() location** | src/lib/utils/cn.ts | src/lib/utils.ts |
| **Types directory** | src/types/ | Does not exist (types from schema + validators) |
| **Fonts directory** | src/styles/fonts.ts | Does not exist (fonts in layout.tsx) |
| **DB tables** | 10 | 12 (added articles, testimonials) |
| **Order status** | confirmed | paid |
| **Orders columns** | base columns | + stripePaymentIntentId, currency, updatedAt |
| **Order items columns** | base columns | + priceAtPurchase |
| **Gold button** | Gold gradient (#d4af37) | Solid secondary (#1C1008) |
| **Migration approach** | Drizzle generate+push | Manual SQL (drizzle configured but not yet used) |
| **Dependencies** | base set | + @base-ui/react, sonner, stripe, next-themes, framer-motion, lucide-react, tw-animate-css |
| **shadcn** | CLI only | Both CLI + runtime package |
| **Build status** | Phase 0 only | All phases substantially built |

---

## Remaining Work / Future Phases

### Phase A: Migration & RLS
- [ ] Run `drizzle-kit generate` and `drizzle-kit push` to sync schema to Supabase
- [ ] Execute `supabase/rls_policies.sql` in Supabase SQL Editor
- [ ] Execute `supabase/seed.sql` and `supabase/seed_artworks.sql`
- [ ] Verify all RLS policies work correctly

### Phase B: Production Readiness
- [ ] Create `src/middleware.ts` for proper route-level auth protection (currently handled in layout)
- [ ] Implement `src/app/api/search/route.ts` for debounced search suggestions
- [ ] Add `src/types/` directory with shared type definitions
- [ ] Add `loading.tsx` for remaining routes that lack them
- [ ] Ensure all pages have proper `generateMetadata` exports for SEO
- [ ] Add structured data (JSON-LD) on artwork detail pages
- [ ] Verify image optimization with Next.js `<Image>` component

### Phase C: Feature Completions
- [ ] Live artist sessions (LiveKit) — Phase 2 feature
- [ ] Multi-currency beyond NPR/USD
- [ ] Custom commission marketplace (full flow beyond inquiry form)
- [ ] AI Cultural Guide
- [ ] Cloudflare Stream video hosting
- [ ] Mobile app

### Phase D: Polish & Launch
- [ ] Responsive QA across all breakpoints (375px → 1920px)
- [ ] Performance: Lighthouse 90+ desktop, 70+ mobile
- [ ] Error boundaries for all route groups
- [ ] Toast notifications for all user actions
- [ ] `pnpm build` passes with zero warnings
- [ ] `tsc --noEmit` passes with zero errors
- [ ] Deploy to Vercel with environment variables

---

## Dev Conventions

See `docs/PROJECT_RULES.md` for:
- No comments (default)
- Server Components by default, `"use client"` only for interactivity
- No barrel exports, no circular imports
- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes
- Use design system tokens, never raw hex values
- Three similar lines before extracting a helper
- Strict TypeScript, prefer inference, no `any`

---

## Quick Reference

| Need | Location |
|---|---|
| Design tokens | `src/app/globals.css` + `docs/DESIGN_SYSTEM.md` |
| Component patterns | `docs/DESIGN_SYSTEM.md` section 6 |
| Route structure | `docs/ARCHITECTURE.md` section 2 + 4 |
| DB schema | `src/lib/db/schema.ts` |
| Auth flow | `src/lib/auth/actions.ts` + `src/lib/auth/roles.ts` |
| Server actions | `src/lib/artwork-actions.ts` |
| Payment integration | `src/lib/payments/` + `src/app/api/payments/` |
| Supabase config | `src/lib/supabase/` |
| Validators | `src/lib/validators/` |
| Zod schemas | `src/lib/validators/` |
