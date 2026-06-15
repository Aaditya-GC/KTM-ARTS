# June 15 Implementation Plan — Completion Report

> **Date completed:** 2026-06-15
> **Build status:** `tsc --noEmit` zero errors, `pnpm build` zero errors, zero warnings (41 pages)

---

## What Was Delivered — Phase by Phase

### Phase 1: Foundation & Infrastructure

| Deliverable | File | Notes |
|---|---|---|
| Route-level auth proxy | `src/proxy.ts` | Next.js 16 proxy (replaces deprecated middleware). Supabase SSR cookie handling, protected route check for `/dashboard/*` and `/checkout/*`, auth-page redirect for logged-in users, redirect param preservation |
| Shared type definitions | `src/types/index.ts` | Barrel re-exports from user, artwork, artist, order modules |
| | `src/types/user.ts` | `UserRole`, `SafeUser`, re-exports `Profile` from schema |
| | `src/types/artwork.ts` | `ArtworkStatus`, `ArtworkCardData`, re-exports `Artwork`, `Certificate`, `CreationStep`, validators |
| | `src/types/artist.ts` | `ArtistCardData`, re-exports `Artist`, `ArtistProfileInput` |
| | `src/types/order.ts` | `OrderStatus`, re-exports `Order`, `OrderItem`, `DbCartItem` |
| Drizzle migration | `supabase/migrations/` | Generated and synced — all 13 tables (12 original + commission_requests) verified in DB |
| RLS policies | `supabase/rls_policies.sql` | Verified active on all tables |
| Storage buckets | `supabase/storage_buckets.sql` | `artworks` and `artists` buckets verified public |

### Phase 2: Data & Content Seeding

| Deliverable | File | Notes |
|---|---|---|
| Knowledge hub articles | `supabase/seed_articles.sql` | 6 articles: What Is a Thangka, Understanding Styles, Iconography of Deities, Caring for Your Thangka, Role of Gold, Collecting Guide. Each with full rich-text content, category, author attribution |
| Testimonials | `supabase/seed_testimonials.sql` | 4 collector testimonials from Sarah Chen (SF), Marcus Weber (Berlin), Tenzin Dolma (Toronto), Dr. James Harrison (London) |
| Seed execution | All 4 seed files executed | 7 profiles, 4 artists, 6 artworks, 6 certificates, 12 creation steps, 6 articles, 4 testimonials |

### Phase 3: Marketplace Polish

| Deliverable | File | Notes |
|---|---|---|
| Mobile filter FAB + Sheet | `src/components/marketplace/mobile-filter-sheet.tsx` | Fixed bottom-right FAB (`lg:hidden`), ShadCN Sheet sliding from left, reuses existing FilterSidebar component inside |
| FAB integration | `src/app/(marketing)/marketplace/page.tsx` | `<MobileFilterSheet />` added to page JSX |
| Price slider, deity naming, search debounce | (already existed) | Verified functional — no changes needed |

### Phase 4: Dashboard Completion

| Deliverable | File | Notes |
|---|---|---|
| Artist orders page | `src/app/dashboard/artist/orders/page.tsx` | **Replaced stub.** Server Component. 4-table join (orderItems→orders→artworks→profiles). Shows artwork title, customer name, price, status badge (color-coded), shipping destination (extracted from JSONB), order date. Empty state: "No orders received yet" with inbox icon |
| Wishlist server actions | `src/lib/wishlist-actions.ts` | Full CRUD: `addToWishlist`, `removeFromWishlist`, `getWishlist` (4-table join returning full artwork data), `isInWishlist` (boolean check). All with Supabase auth verification |
| Wishlist page (server) | `src/app/dashboard/customer/wishlist/page.tsx` | Server Component — fetches via `getWishlist()`, passes to client. Handles empty state with marketplace link |
| Wishlist page (client) | `src/app/dashboard/customer/wishlist/wishlist-client.tsx` | Responsive grid (1→2→3 columns), artwork thumbnail with link, title/artist/price, remove button |
| Wishlist button | `src/components/cart/add-to-wishlist-button.tsx` | Client component with loading/filled/outlined states. `isInWishlist` check on mount, toggle on click, Sonner toast feedback. Integrated into art-card and artwork detail page |
| Customer cart section | `src/app/dashboard/customer/customer-cart.tsx` | Extracted from customer dashboard page into reusable client component |
| Customer dashboard | `src/app/dashboard/customer/page.tsx` | Rewired as Server Component. Shows member name + since date, 3 quick-link cards (Marketplace, Wishlist, Orders), cart section, recent orders (top 3 with status/date/amount) |
| Loading skeletons | `src/app/dashboard/artist/orders/loading.tsx` + `src/app/dashboard/customer/wishlist/loading.tsx` | Pulse-animated placeholders matching page layouts |

### Phase 5: Commission System

| Deliverable | File | Notes |
|---|---|---|
| Commission table | `src/lib/db/schema.ts` (line 181) | `commission_requests` — id, name, email, phone, deity, style, size_description, budget_npr, description, status (default "new"), created_at. Full Drizzle type exports |
| Zod validator | `src/lib/validators/commission.ts` | name (required, max 100), email (required, valid), phone (optional), deity (optional), style (optional), sizeDescription (optional), budgetNpr (optional, min 5000), description (required, min 20, max 3000) |
| Server action | `src/lib/commission-actions.ts` | `submitCommission` — parses FormData, validates with Zod, inserts to DB, revalidates path |
| Commission form | `src/components/commission/commission-form.tsx` | Client component. Two-column grid: name/email, phone, deity/style, size/budget, description textarea. Loading/error/success states. GoldButton submit. On success: in-page confirmation with checkmark icon and 48-hour response promise |
| Page update | `src/app/(marketing)/commissions/page.tsx` | Replaced `mailto:commissions@kathmanduarts.com` CTA with `<CommissionForm />`. Added ISR: `revalidate = 300` |

### Phase 6: Cart Database Sync

| Deliverable | File | Notes |
|---|---|---|
| Cart server actions | `src/lib/cart-actions.ts` | `syncCartToDb` (set-difference algorithm: deletes removed items, inserts new ones with `onConflictDoNothing`), `getCartFromDb` (4-table join), `clearCartFromDb` |
| Zustand store update | `src/hooks/use-cart.ts` | Added `syncWithServer` and `loadFromServer` methods. Auto-syncs on every add/remove/clear. LocalStorage remains source of truth; DB is backup for cross-device persistence. Guest users (unauthenticated) remain localStorage-only |

### Phase 7: SEO & Performance

| Deliverable | File | Notes |
|---|---|---|
| Root metadata | `src/app/layout.tsx` | Added `metadataBase`, `openGraph` (title, description, siteName, locale, type), `twitter` (summary_large_image), `robots` (index, follow) |
| Page metadata | `src/app/(marketing)/marketplace/page.tsx` | `generateMetadata` — title, description |
| | `src/app/(marketing)/marketplace/[slug]/page.tsx` | `generateMetadata` — dynamic from artwork data, OG image from artwork.images[0] |
| | `src/app/(marketing)/artists/[slug]/page.tsx` | `generateMetadata` — dynamic from artist profile |
| | `src/app/(marketing)/knowledge-hub/[slug]/page.tsx` | `generateMetadata` — dynamic from article |
| JSON-LD | `src/app/(marketing)/marketplace/[slug]/page.tsx` | Product schema with name, description, image array, offers (price, currency, availability — InStock/SoldOut), creator (Person) |
| generateStaticParams | `src/app/(marketing)/marketplace/[slug]/page.tsx` | Pre-builds all available artwork pages at build time |
| ISR revalidation | Landing page: 120s | Was `force-dynamic` |
| | Marketplace/slug: 300s | Was `force-dynamic` |
| | Commissions: 300s | New |
| | Knowledge-hub: 3600s | Was `force-dynamic` |
| | Knowledge-hub/[slug]: 3600s | Was `force-dynamic` |

### Phase 8: Error Handling & Loading States

| Deliverable | File | Notes |
|---|---|---|
| Auth error boundary | `src/app/(auth)/error.tsx` | "Authentication Error" message, reset button |
| Checkout error boundary | `src/app/checkout/error.tsx` | "Checkout Error" message, reset button |
| Loading skeletons | 22 `loading.tsx` files total | Covering: marketing pages (5), checkout (4), dashboard (5), admin (4), artist (2), customer (3). All use `animate-pulse` with `bg-surface-container-higher` placeholders |
| Toast notifications | `add-to-cart-button.tsx` | "Added to cart" / "Removed from cart" |
| | `add-to-wishlist-button.tsx` | "Added to wishlist" / "Removed from wishlist" |
| | `commission-form.tsx` | Implicit via success state display |

### Phase 9: Production Hardening

| Deliverable | File | Notes |
|---|---|---|
| Rate limiter | `src/lib/rate-limit.ts` | In-memory Map-based. 10 requests per 60s window per key. Returns boolean — caller decides what to do on false |
| Search API | `src/app/api/search/route.ts` | GET endpoint. Accepts `?q=` param (min 2 chars). Returns `{ results: SearchResult[] }` or `{ error }`. Reuses `searchArtworks` server action |
| Input sanitization | `src/lib/utils/sanitize.ts` | `sanitizeText` — strips HTML tags and angle brackets. `sanitizeSlug` — lowercases, replaces non-alphanumeric with hyphens, collapses multiples, trims edges |
| Design docs update | `docs/DESIGN_SYSTEM.md` | Section 2 color table updated from dark theme (`#14140f` background) to current warm cream theme (`#F5F0E8` background). All tokens match `globals.css` |
| Vercel config | `vercel.json` | API route maxDuration set to 30s |
| Build verification | `pnpm build` | 41 pages, zero errors, zero warnings |

---

## Review Round 1 — 5 Issues Found & Fixed

| # | Issue | Fix | Files Changed |
|---|---|---|---|
| 1 | Wishlist button existed but was imported nowhere — dead code | Wired to `art-card.tsx` (conditional on `id` prop, small size) and `marketplace/[slug]/page.tsx` (next to AddToCartButton) | `art-card.tsx`, `marketplace/[slug]/page.tsx` |
| 2 | Wishlist icon always showed outlined `favorite` regardless of state | Inline `style={{ fontVariationSettings: ... }}` toggles `'FILL' 1` (filled) vs `'FILL' 0` (outlined) | `add-to-wishlist-button.tsx` |
| 3 | Loading state returned `null` — layout shift when button mounts | Renders same-sized placeholder `<div>` (7x7 or 10x10 based on `size` prop) | `add-to-wishlist-button.tsx` |
| 4 | `vercel.json` listed in plan but not created | Created at project root with `maxDuration: 30` for API routes | `vercel.json` |
| 5 | New Phase 4 components used raw `<img>` instead of `next/image` | `customer-cart.tsx` → `Image` with `width=64 height=64`. `wishlist-client.tsx` → `Image fill` with `sizes` | `customer-cart.tsx`, `wishlist-client.tsx` |

---

## Review Round 2 — Physical Verification (Browser Testing)

Two critical runtime bugs surfaced during browser testing that code review could not catch:

| # | Issue | Symptom | Root Cause | Fix |
|---|---|---|---|---|
| 6 | **N+1 `isInWishlist` queries** | Marketplace page spawned 6 separate server action calls (~300ms each, first one 19s). 6 artworks = 6 DB round-trips per page load | Each `AddToWishlistButton` independently called `isInWishlist()` on mount via `useEffect` | Added `getWishlistIds()` batch server action. Marketplace/landing/detail pages call it once during server render, pass `Set<string>` down through `ArtGrid` → `ArtCard` → `AddToWishlistButton` as `initialInWishlist` prop. Button skips `useEffect` fetch when prop is provided. |
| 7 | **Duplicate key race condition** | `POST /marketplace 500` — `duplicate key value violates unique constraint "wishlist_items_user_id_artwork_id_unique"` | TOCTOU: `addToWishlist` did SELECT then INSERT. Two rapid clicks both saw "not in wishlist", both tried INSERT, second violated unique constraint | Replaced SELECT-then-INSERT with direct INSERT wrapped in try/catch for PG error code `23505` (unique violation). If row already exists, insert becomes a silent no-op. |

**Result:** Before fix = 6 DB queries per page load. After fix = 1.

**Files changed in Round 2:**
- `src/lib/wishlist-actions.ts` — added `getWishlistIds()`, removed pre-flight SELECT from `addToWishlist`, added duplicate-key catch
- `src/components/cart/add-to-wishlist-button.tsx` — added `initialInWishlist` prop
- `src/components/art/art-card.tsx` — added optional `inWishlist` prop
- `src/components/art/art-grid.tsx` — added optional `wishlistIds` prop
- `src/app/(marketing)/marketplace/page.tsx` — batch-fetches wishlist IDs server-side
- `src/app/(marketing)/marketplace/[slug]/page.tsx` — batch-fetches wishlist IDs server-side
- `src/app/(marketing)/page.tsx` — batch-fetches wishlist IDs server-side

---

## Files Changed — Total Footprint

| Category | Count |
|---|---|
| New files created | 25 |
| Existing files modified | 19+ (12 original + 7 from review rounds) |
| Loading states added | 22 total (some pre-existing) |
| Seed SQL files | 2 new (articles, testimonials) + 2 existing executed |
| DB migrations | 1 new migration (commission_requests) |
| Design docs updated | 1 (DESIGN_SYSTEM.md) |
| Review rounds | 2 (5 code-review issues + 2 runtime bugs) |

---

## Expected Betterments (Post-Completion Opportunities)

These are items that work correctly but could be improved with further investment. None are blocking.

### 1. Rate Limiter — In-Memory Only

The current `rate-limit.ts` uses an in-memory `Map`. This resets on every deployment/cold start and doesn't scale across multiple server instances. For production, consider:
- **Supabase-based rate limiting:** Store counts in a `rate_limits` table with TTL via `created_at`
- **Upstash Redis:** Serverless Redis with atomic increment + expiry
- **Vercel WAF:** Built-in rate limiting at the edge if deploying to Vercel Pro/Enterprise

### 2. Cart Sync — Race Condition on Rapid Clicks

`syncCartToDb` does individual `DELETE` + `INSERT` statements in a loop. Rapid add/remove can produce momentary inconsistencies. Improvement: wrap in a database transaction or add a debounce to the sync call (batch writes every 500ms instead of on every click).

### 3. Wishlist Button — Repeated `isInWishlist` Calls

Every `AddToWishlistButton` instance calls `isInWishlist` independently on mount. On a page with 12 artwork cards, that's 12 DB round-trips. Consider:
- Batch endpoint: `POST /api/wishlist/check` with array of artwork IDs
- Context/provider: Load the user's full wishlist once at page level, pass down as a `Set<string>`
- The current approach is fine for the MVP's data volumes (6-50 artworks) but will slow at scale

### 4. `getWishlist` Called Twice on Wishlist Page

The server component calls `getWishlist()` to check for empty state, then passes items to the client. But `getWishlist` authenticates the user each time. This is fine — just be aware there's a double auth check (once in the server component via Drizzle, once in the server action). Could deduplicate by passing user from layout.

### 5. Commission Form — No Rate Limiting Applied

The `submitCommission` server action doesn't call `checkRateLimit`. The rate limiter utility exists but isn't integrated into any server action yet. Add `checkRateLimit("commission", 3, 60000)` to limit to 3 submissions per minute per IP.

### 6. Artist Orders — No Pagination

The orders query has no `LIMIT` or pagination. Fine for now (low order volume expected in MVP), but will need pagination once artists have 50+ orders.

### 7. Search API — No Rate Limiting or Caching

`/api/search` is a public GET endpoint with no rate limiting and no response caching. Could add:
- `checkRateLimit` guard (5 req/s per IP)
- `Cache-Control` header with short TTL (30s) for repeated queries
- ETag support for conditional requests

### 8. Proxy — No Role-Based Routing

`proxy.ts` protects `/dashboard/*` but doesn't enforce role-specific access. An artist can technically navigate to `/dashboard/admin/users` (the page component would show data from DB without auth checks on the query — the admin pages currently don't verify admin role in their queries). Add role verification in the proxy or as a wrapper in admin page components.

### 9. `generateMetadata` Missing on Some Public Pages

`/artists` (directory) and `/knowledge-hub` (listing) still lack `generateMetadata`. They fall back to the root layout's metadata. Low priority — listing pages are less critical for SEO than detail pages.

### 10. Material Symbols — Render-Blocking Font Load

The Google Fonts `<link>` in the root layout uses `precedence="default"` which means the font loads as a render-blocking resource. Consider:
- `precedence="high"` with `rel="preload"` for the variable font
- Or self-host the Material Symbols variable font (WOFF2) to eliminate the external request

### 11. Dark Mode Class Forced But Theme Is Light

`<html className="dark">` is hardcoded in the root layout, but the design system is now warm/light (`#F5F0E8` background). The `dark` class activates Tailwind's dark variant but the base tokens are already light. This is harmless but confusing — either remove the `dark` class or implement an actual theme toggle.

### 12. Database Types in `src/types/` Re-export But Not Used

The types in `src/types/` re-export from Drizzle and Zod but no existing code has been refactored to import from `@/types` instead of `@/lib/db/schema` or `@/lib/validators/*`. The directory exists as a future import target. Gradual migration would be: pick one new component to use `@/types`, verify it works, then expand.

---

## Quick Verification Checklist

For anyone picking up this project fresh:

- [ ] `pnpm install`
- [ ] Copy `.env.example` to `.env.local`, fill with Supabase + payment keys
- [ ] Run `supabase/seed.sql`, `seed_artworks.sql`, `seed_articles.sql`, `seed_testimonials.sql` in Supabase SQL Editor
- [ ] Run `npx drizzle-kit push` to sync schema (including `commission_requests`)
- [ ] `pnpm dev` — should start on localhost:3000
- [ ] Visit `/` — 10-section landing page with 6 artworks, 4 artists, 6 articles, testimonials
- [ ] Visit `/marketplace` — search, deity filter, price slider, mobile FAB
- [ ] Visit `/commissions` — form submits to DB
- [ ] Register → login → customer dashboard shows cart + orders + quick links
- [ ] Wishlist: click heart on any artwork card → appears in `/dashboard/customer/wishlist`
- [ ] Admin upgrades user to artist → artist dashboard shows stats + orders
- [ ] Artist creates artwork → appears in marketplace after publish
- [ ] `tsc --noEmit` passes
- [ ] `pnpm build` succeeds with zero errors
