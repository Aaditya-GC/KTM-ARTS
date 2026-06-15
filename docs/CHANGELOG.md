# Changelog — Kathmandu Arts

## [Unreleased] — 2026-06-14

### Theme & Color System
- Rethemed entire site from dark/black to warm cream + espresso brown palette
- Deep Brass (#7A5C00) replaced bright gold (#f2ca50, #d4af37, #ffe088, #e9c349) across logo, prices, badges, buttons
- All colors moved to CSS variables in `src/app/globals.css`
- Updated `text-glow-gold` shadow to use Deep Brass rgba
- Replaced all `hover:text-primary` with `hover:text-accent` across 15+ files

**Files:**
- `src/app/globals.css` — all color tokens rewritten
- `src/components/ui/button.tsx` — button variants
- `src/components/ui/input.tsx` — input styles
- `src/components/art/art-card.tsx` — price, badge colors
- `src/components/cart/cart-drawer.tsx` — accent colors
- `src/components/layout/navbar.tsx` — link hover colors
- `src/components/layout/footer.tsx` — link hover colors
- `src/components/layout/user-menu.tsx` — dashboard link
- `src/components/search/search-modal.tsx` — result hover
- `src/components/shared/badge-verified.tsx` — icon color
- `src/app/dashboard/customer/checkout/page.tsx` — input focus
- `src/app/(marketing)/marketplace/[slug]/page.tsx` — price color
- `src/app/(marketing)/page.tsx` — hero accent
- `src/app/(marketing)/layout.tsx` — announcement bar links

### Announcement Bar
- Fixed bar above navbar: dark brown (#1C1008) 36px, 3-section layout
- Left: About Us, Wholesale | Center: "SUMMER SALE: UP TO 60% OFF STOREWIDE" | Right: Customer Reviews, Contact Us
- Side links hidden on mobile, center text fills width
- Navbar shifted from `top-0` to `top-9`, main wrapper padding `pt-[132px]`

**Files:**
- `src/app/(marketing)/layout.tsx`

### Navbar
- Added `MobileMenu` client component with animated slide-down drawer (Framer Motion)
- Nav links centered via `absolute left-1/2 -translate-x-1/2`
- Link gap increased to `gap-8 lg:gap-10`
- Logo reduced to `text-2xl` (was `text-headline-md` 32px)
- Added 44px touch targets to all header icon buttons (search, cart, user menu)

**Files:**
- `src/components/layout/navbar.tsx`
- `src/components/layout/mobile-menu.tsx` (new)
- `src/components/layout/cart-button.tsx`
- `src/components/layout/search-button.tsx`
- `src/components/layout/user-menu.tsx`

### Hero Section
- Replaced text-only hero with full-bleed Pexels background image (Buddhist monastery interior)
- Dark overlay gradient (`rgba(10,6,2,0.45)` to `rgba(10,6,2,0.65)`)
- Text repositioned to lower-center with `justify-end pb-12 md:pb-16`
- "KATHMANDU VALLEY · EST. 2024" label, "Sacred Art, Thoughtfully Collected." heading (`text-3xl md:text-4xl`)
- Two custom buttons (cream solid + ghost outline), animated chevron scroll indicator
- Removed gap between navbar and hero via `-mt-[132px]`
- Buttons stack vertically on mobile (`flex-col sm:flex-row`)

**Files:**
- `src/app/(marketing)/page.tsx`

### Cart Drawer
- Redesigned with premium layout: thumbnail, title, artist, price per row
- Fixed total price font size (was oversized)
- Matched "Proceed to Checkout" and "Continue Shopping" button styles
- Full width on mobile (`w-full sm:max-w-md`)

**Files:**
- `src/components/cart/cart-drawer.tsx`

### Search Modal
- Functional search modal with live Drizzle `ilike` query across title, description, deity, style, medium
- 150ms debounced input, loading skeleton, no-results state
- Full-screen overlay, closes on backdrop click / Escape key
- Popular search tags: Buddha, Mandala, Tara, etc.
- Made full-screen on mobile (`min-h-screen md:min-h-0`)

**Files:**
- `src/components/search/search-modal.tsx`
- `src/lib/search-actions.ts`

### Checkout Page
- Redesigned `/dashboard/customer/checkout` with two-column layout (60/40)
- Breadcrumb: Information › Shipping › Payment
- Styled form inputs (bg-surface-dim, border-outline, h-11, focus-visible:border-primary)
- Order summary with 48x48 thumbnails, subtotal/shipping/total rows, discount code input
- Sticky summary column, "Continue to Payment" button

**Files:**
- `src/app/dashboard/customer/checkout/page.tsx`

### Dashboard
- Collapsible sidebar on mobile with floating hamburger toggle and backdrop scrim
- Main content area adjusted (`pt-16 md:pt-8`) to avoid overlay overlap
- Redesigned customer overview with cart items listing

**Files:**
- `src/app/dashboard/sidebar.tsx`
- `src/app/dashboard/layout.tsx`

### Badge Verified
- Stabilized "Verified Authentic" badge: `leading-none whitespace-nowrap` added to component
- `min-h-[24px] flex items-center` wrappers in art-card and artist page

**Files:**
- `src/components/shared/badge-verified.tsx`
- `src/components/art/art-card.tsx`

### File Cleanup
- Deleted 12 unused files (~1013 lines removed):
  - `src/lib/payments/esewa.ts`
  - `src/lib/supabase/admin.ts`
  - `src/components/layout/side-drawer.tsx`
  - `src/components/ui/avatar.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/card.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/dropdown-menu.tsx`
  - `src/components/ui/radio-group.tsx`
  - `src/components/ui/separator.tsx`
  - `src/components/ui/sonner.tsx`
  - `src/components/ui/tabs.tsx`

### Bug Fixes
- Fixed Supabase SSR `setAll` cookie error in `src/lib/supabase/server.ts` — wrapped `cookieStore.set()` in try/catch
- Fixed search modal not closing on outside click (stopPropagation)
- Fixed Verified Authentic badge sliding animation (entrance only, `once: true`)
- Removed USD prices from product detail page, formatted NPR correctly with commas
- Removed gap between navbar and hero section

### General Optimization
- Added `loading="lazy"` to all 7 non-hero `Image` components (marketplace detail, checkout cart, dashboard checkout, artist card, art card, search results)
- Hero image confirmed with `priority={true}`
- Removed unused `GoldButton` import from checkout page
- Added try/catch error handling to server actions: `signOut`, `createOrder`, `createCheckoutOrder`, `createPaymentIntent`, `createStripeCheckoutSession`
- Stripe and Khalti payment actions already had proper error handling
- Removed all hardcoded hex color values — replaced with CSS variable tokens across:
  - `src/app/layout.tsx` — Toaster styles
  - `src/app/(marketing)/layout.tsx` — announcement bar
  - `src/app/(marketing)/page.tsx` — hero section
  - `src/app/dashboard/customer/checkout/page.tsx` — input styles, labels, buttons
  - `src/app/(marketing)/marketplace/[slug]/page.tsx` — price color
- All `export const dynamic = "force-dynamic"` instances verified as necessary

### Supabase SSR Cookie Fix
- `src/lib/supabase/server.ts` — wrapped `cookieStore.set()` calls in try/catch to handle `setAll` errors during static generation

**Files:**
- `src/lib/supabase/server.ts`
