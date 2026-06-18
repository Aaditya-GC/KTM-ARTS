# Kathmandu Arts — June 17 Implementation Plan

> **Created:** 2026-06-17
> **Scope:** All 21 known gaps — security, auth, checkout, email, UX fixes, code quality, testing
> **For:** AI coding assistants to execute phase by phase, sequentially

---

## Pre-Flight: Required Reading

Every agent must read these before starting ANY phase:

1. `docs/PROJECT_RULES.md` — coding rules, conventions, anti-patterns
2. `docs/DESIGN_SYSTEM.md` — design tokens (sections 2-4), component catalog (section 6)
3. `docs/ARCHITECTURE.md` — sections 3 (DB schema), 4 (routes), 6 (component architecture)
4. `src/lib/db/schema.ts` — all tables, enums, type exports
5. `src/app/globals.css` — all CSS custom properties and utility classes

Key conventions reminder:
- No comments by default. Server Components default. `"use client"` only for interactivity.
- All mutations via Server Actions. API routes only for external callbacks.
- Use design system tokens only — never raw hex colors.
- Path aliases: `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`
- Imports order: React/Next → third-party → `@/` → relative
- `cn()` from `@/lib/utils/utils` for conditional classes

---

## Current State (June 17)

Build passes: `tsc --noEmit` zero errors, `pnpm build` zero errors, 41 pages.
All 14 DB tables live. 6 artworks, 6 articles, 4 testimonials seeded.
6 API routes, 35 page routes. Auth proxy is dead code (auth handled in dashboard layout).

---

## Phase 1: Security & Auth Hardening

**Estimated effort:** 4 tasks, ~8 file edits

### Task 1.1 — Add role-based route protection in dashboard layout

**Problem:** `dashboard/layout.tsx` checks `if (!user) redirect("/login")` but never checks the user's role. Any authenticated user can navigate to `/dashboard/admin/*` by typing the URL directly. The sidebar hides links via `allowedLinks.filter()` but the routes themselves are naked.

**Files to modify:**
- `src/app/dashboard/layout.tsx`

**What to do:**
1. Read `src/lib/auth/roles.ts` to understand `getCurrentUser()` return type (returns `{ id, fullName, role }` or `null`)
2. In `dashboard/layout.tsx`, after `const user = await getCurrentUser()`:
   - If pathname starts with `/dashboard/admin` and `user.role !== "admin"`, redirect to `/dashboard`
   - If pathname starts with `/dashboard/artist` and `user.role === "client"`, redirect to `/dashboard`
3. Import `headers` from `next/headers` to read the pathname: `const pathname = (await headers()).get("x-next-pathname") || ""`

**Verification:** Log in as a client/artist, try to navigate to `/dashboard/admin/users` — must redirect to `/dashboard`.

---

### Task 1.2 — Add sign-out to navbar UserMenu

**Problem:** `UserMenu` component shows a dashboard link for admin/artist and an account icon for clients. There is NO sign-out button anywhere in the navbar. Users can only sign out from the dashboard sidebar, which is unreachable from public pages for clients.

**Files to modify:**
- `src/components/layout/user-menu.tsx`

**What to do:**
1. Convert `UserMenu` to a dropdown accessible via click on the user icon/button
2. Use ShadCN's pattern: wrap in a relative container, use `useState` for open/close
3. Dropdown items:
   - If logged in: "Dashboard" link, "Sign Out" button (calls `signOut` server action from `@/lib/auth/actions`)
   - If not logged in: "Sign In" link to `/login`
4. For the sign-out button, use a `<form action={signOut}>` with a submit button styled as a menu item
5. Keep it minimal — no avatar images (we don't have them), no dropdown animations from Framer Motion (keep it CSS-only)
6. Close dropdown on click outside (use `useEffect` with document click listener) and on item click
7. The trigger button shows:
   - Logged in: account_circle icon + fullName abbreviated (first name only, truncate at 12 chars)
   - Not logged in: account_circle icon only

**Design tokens to use:**
- Background: `bg-surface-container-high`, border: `border-outline-variant/20`
- Items: `text-on-surface-variant`, hover → `text-accent bg-surface-container-low`
- Sign out: hover → `text-error`
- Trigger: same as current — `text-on-surface hover:text-accent`

**Verification:** Log in as each role, confirm sign-out works from any public page. Confirm the dropdown closes on outside click.

---

### Task 1.3 — Delete dead proxy.ts and rate-limit.ts

**Problem:**
- `src/proxy.ts` — has `config.matcher` but is at a non-standard path (`src/proxy.ts` instead of `src/middleware.ts`). Never imported by anything. Auth is handled in `dashboard/layout.tsx` and `checkout/page.tsx`. Dead code.
- `src/lib/rate-limit.ts` — `checkRateLimit` function is defined but never imported or called anywhere. Dead code.

**Files to delete:**
- `src/proxy.ts`
- `src/lib/rate-limit.ts`

**Verification:** `tsc --noEmit` passes after deletion. App still works (auth still protects dashboard, checkout still works).

---

### Task 1.4 — Fix hardcoded `dark` class on `<html>`

**Problem:** `src/app/layout.tsx` line 46: `<html lang="en" className="dark">`. The design system is a warm/light theme (`#F5F0E8` background, `#1C1008` text). The `dark` class triggers `@custom-variant dark (&:where(.dark, .dark *))` in globals.css. Currently harmless because no `dark:` utilities are used, but any future `dark:` class would activate incorrectly.

**Files to modify:**
- `src/app/layout.tsx`

**What to do:**
1. Remove `className="dark"` from the `<html>` tag
2. If `next-themes` is being used, check if it manages the class — but looking at the code, `next-themes` is installed but the `ThemeProvider` is never used. The theme is static.

**Verification:** App renders identically. Colors unchanged. No visual regression.

---

## Phase 2: Checkout & Payment Hardening

**Estimated effort:** 4 tasks, ~6 file edits

### Task 2.1 — Create checkout Zod validator and wire it in

**Problem:** The checkout form (`src/app/checkout/page.tsx`) collects FormData and sends it directly to `initiateOrderPayment()` with zero validation. No required field checks, no email format validation, no phone format, nothing.

**Files to create:**
- `src/lib/validators/checkout.ts`

**Files to modify:**
- `src/app/checkout/page.tsx`

**What to do:**

1. Create `src/lib/validators/checkout.ts`:
```typescript
import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  shippingName: z.string().min(1, "Name is required").max(100),
  shippingLastName: z.string().min(1, "Last name is required").max(100),
  street: z.string().min(1, "Street address is required").max(200),
  apartment: z.string().max(50).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["khalti", "esewa", "stripe"]),
  notes: z.string().max(500).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
```

2. In `checkout/page.tsx`:
   - Import `checkoutSchema` from `@/lib/validators/checkout`
   - Before calling `initiateOrderPayment`, validate formData with `checkoutSchema.safeParse()`
   - If validation fails, display errors below each field using conditional rendering (NOT a toast — show inline errors)
   - Add a `fieldErrors` state: `Record<string, string>` 
   - Style error text: `text-error text-label-sm mt-1`
   - On validation success, proceed with payment as before

**Verification:** Submit empty form — see inline errors. Submit invalid email — see email error. Submit valid form — proceeds to payment.

---

### Task 2.2 — Move eSewa URL to environment variable

**Problem:** `order-actions.ts:85` hardcodes `https://rc-epay.esewa.com.np/api/epay/main/v2/form` — the eSewa test URL. This should be configurable.

**Files to modify:**
- `src/lib/order-actions.ts`
- `.env.example` (add the variable)

**What to do:**
1. Add `ESEWA_PAYMENT_URL` to `.env.example` with value `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
2. Add `ESEWA_PAYMENT_URL` to `.env.local` (same test value)
3. In `order-actions.ts`, replace the hardcoded URL string with `process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form"`
4. The `product_code` is also hardcoded as `EPAYTEST` — add `ESEWA_PRODUCT_CODE` env var with same fallback

**Verification:** eSewa checkout flow still redirects to eSewa payment page. Environment variables are read correctly.

---

### Task 2.3 — Use `NEXT_PUBLIC_USD_EXCHANGE_RATE` for Stripe payments

**Problem:** `order-actions.ts:99` hardcodes `Math.round(priceNpr / 137)` for USD conversion. The project already has `NEXT_PUBLIC_USD_EXCHANGE_RATE=134` in `.env.example` but it's never used in checkout.

**Files to modify:**
- `src/lib/order-actions.ts`

**What to do:**
1. In `initiateOrderPayment`, read `const usdRate = Number(process.env.NEXT_PUBLIC_USD_EXCHANGE_RATE) || 134`
2. Replace `Math.round(i.priceNpr / 137)` with `Math.round(i.priceNpr / usdRate)`
3. Optionally: compute and store `totalUsd` in the order at creation time

**Verification:** Stripe checkout shows correct USD amount based on env var rate.

---

### Task 2.4 — Stripe webhook local testing setup

**Problem:** Stripe webhook handler exists at `src/app/api/payments/stripe/webhook/route.ts` but has never been tested. No local testing instructions.

**Files to modify:**
- `src/app/api/payments/stripe/webhook/route.ts` (review only, ensure it actually works)
- `README.md` or create a brief note in docs (optional)

**What to do:**
1. Read the webhook handler and verify:
   - It checks `stripe.webhooks.constructEvent()` with the webhook secret
   - It handles `checkout.session.completed` event
   - It calls `confirmOrder(orderId)` from `@/lib/order-actions`
   - Error responses return proper HTTP status codes (400 for invalid signature, 200 for unhandled events)
2. If the handler is incomplete, fix it per Stripe SDK best practices
3. Add a comment block at the top with the Stripe CLI test command:
   ```
   stripe listen --forward-to localhost:3000/api/payments/stripe/webhook
   stripe trigger checkout.session.completed
   ```

**Verification:** Code review only — actual end-to-end test requires Stripe sandbox keys and Stripe CLI.

---

## Phase 3: Password Reset Flow

**Estimated effort:** 2 tasks, ~4 file edits

### Task 3.1 — Create forgot password page and server action

**Problem:** No password reset flow exists. Users who forget their password have no recovery path.

**Files to create:**
- `src/app/(auth)/forgot-password/page.tsx`
- `src/lib/auth/reset-password.ts` (server action)

**What to do:**

1. Create `src/lib/auth/reset-password.ts`:
   - Export `requestPasswordReset(formData: FormData)` server action
   - Validate email with Zod: `z.string().email()`
   - Call `supabase.auth.resetPasswordForEmail(email, { redirectTo: \`${SITE_URL}/reset-password\` })`
   - Return `{ success: true }` regardless of whether the email exists (prevents email enumeration)
   - Export `updatePassword(formData: FormData)` server action
   - Validate new password: `z.string().min(8)`
   - Call `supabase.auth.updateUser({ password })`
   - On success, redirect to `/login` with `?reset=success` query param

2. Create `src/app/(auth)/forgot-password/page.tsx`:
   - Simple centered form: email input + submit button
   - On submit, call `requestPasswordReset`
   - Show success message: "If an account exists with that email, we've sent a reset link."
   - Link back to `/login`
   - Use the same styling as login/register pages (gold-button, inputStyle)

3. Create `src/app/(auth)/reset-password/page.tsx` (the callback page):
   - This page receives the reset token from Supabase via URL hash
   - Shows a new-password input + confirm-password input
   - On submit, calls `updatePassword`
   - On success, redirects to `/login?reset=success`

4. Add link to forgot password on the login page: "Forgot password?" below the sign-in button

**Design compliance:** Use existing auth page patterns from `login/page.tsx` and `register/page.tsx`. Same input styles, same gold-button, same layout wrapper from `(auth)/layout.tsx`.

**Verification:** Request reset → check Supabase Auth emails (or check logs) → follow link → set new password → log in with new password.

---

### Task 3.2 — Show "Password reset successful" message on login page

**Files to modify:**
- `src/app/(auth)/login/page.tsx`

**What to do:**
1. Read `searchParams` for `reset` query param
2. If `reset === "success"`, show a Sonner toast or inline success banner: "Password updated successfully. Please sign in."

**Verification:** After password reset, redirected to `/login?reset=success` — see the success message.

---

## Phase 4: Email Integration (Resend)

**Estimated effort:** 3 tasks, ~3 new files, ~3 file edits

### Task 4.1 — Create email utility with Resend

**Problem:** Resend is installed but never used. No transactional emails exist — order placed → silent, payment confirmed → silent, artwork sold → artist doesn't know.

**Files to create:**
- `src/lib/email.ts`

**What to do:**
1. Create `src/lib/email.ts`:
```typescript
"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = "Kathmandu Arts <orders@kathmanduarts.com>";

export async function sendOrderConfirmation(to: string, order: { id: string; totalNpr: number; items: Array<{ title: string }> }) {
  // Build a minimal, elegant plain-text + HTML email
  // List order items, total, link to order page
}
export async function sendArtistSaleNotification(to: string, artwork: { title: string; priceNpr: number; buyerName: string }) { ... }
export async function sendCommissionAcknowledgment(to: string, name: string) { ... }
```

2. Keep emails minimal — no fancy templates. Plain text with an HTML fallback. The tone matches the brand: "Your order has been received with reverence."
3. All functions are server actions — they can be called from other server actions or API routes.
4. If `RESEND_API_KEY` is not set, functions silently return (no crash).

**Verification:** Set a real Resend API key (or use Resend's test mode), trigger an order, check email delivery.

---

### Task 4.2 — Send order confirmation email on successful payment

**Files to modify:**
- `src/lib/order-actions.ts`

**What to do:**
1. In `confirmOrder()`, after marking the order paid and artworks sold:
   - Fetch the order with items and customer email
   - Call `sendOrderConfirmation(customerEmail, orderDetails)`
2. Wrap email sending in a try/catch — email failure should not block order confirmation
3. In `createOrder()`, after order is created but before payment redirect:
   - Optionally send an "order received, awaiting payment" email

**Verification:** Complete a test order, check that the confirmation function is called (log or inspect Resend dashboard).

---

### Task 4.3 — Send artist notification and commission acknowledgment

**Files to modify:**
- `src/lib/order-actions.ts` (add artist notification in `confirmOrder`)
- `src/lib/commission-actions.ts` (add acknowledgment email after `submitCommission`)

**What to do:**
1. In `confirmOrder()`: after marking artworks sold, look up the artist's email from `artworks → artists → profiles`, send notification
2. In `submitCommission()`: after DB insert, send acknowledgment to the submitter's email
3. Both wrapped in try/catch — email failures must not break the main flow

**Verification:** Trigger a commission submission and an order, verify email functions are called.

---

## Phase 5: Wishlist Heart Button Fix

**Estimated effort:** 1 task, ~1 file edit

### Task 5.1 — Prevent wishlist heart button from navigating to product page

**Problem:** The `ArtCard` component wraps the entire card in a `<Link href={...}>`. The `AddToWishlistButton` inside it calls `e.stopPropagation()` but does NOT call `e.preventDefault()`. In Next.js 16, the `<Link>` component intercepts clicks and navigates client-side — `stopPropagation` alone doesn't prevent this. Users clicking the heart are navigated to the product page instead of just toggling the wishlist.

**Files to modify:**
- `src/components/cart/add-to-wishlist-button.tsx`

**What to do:**
1. In the `handleClick` function, add `e.preventDefault()` BEFORE `e.stopPropagation()`:
```typescript
async function handleClick(e: React.MouseEvent) {
  e.preventDefault();   // Block the parent <Link> navigation
  e.stopPropagation();  // Stop React event bubbling
  // ... rest of wishlist toggle logic
}
```

2. Additionally, ensure the `onPointerDown` and `onMouseDown` handlers also call `e.preventDefault()`:
```typescript
onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
```

3. Add `draggable={false}` to the span to prevent drag-to-save behavior that might trigger link preview

**Why `preventDefault` is needed even with `stopPropagation`:** Next.js's `<Link>` uses both React synthetic events AND native DOM events. `stopPropagation` only stops React's synthetic event bubbling. `preventDefault` blocks the native browser navigation behavior.

**Verification:** On the marketplace page, click the heart icon on any artwork card. The heart should fill/empty but the page should NOT navigate. Clicking anywhere else on the card should still navigate to the product page.

---

## Phase 6: Artwork Descriptions

**Estimated effort:** 1 task, ~1 file edit

### Task 6.1 — Write proper rich descriptions for all 6 seeded artworks

**Problem:** The 6 seeded artworks have generic/placeholder descriptions. The artwork detail page is story-driven — it needs rich content covering deity symbolism, artistic techniques, materials significance, and the artist's story. Without this, the core value proposition ("museum-quality storytelling") falls flat.

**Files to modify:**
- `supabase/seed_artworks.sql`

**What to do:**

Update each artwork's `description` field with 3-4 paragraphs covering:

1. **The Kalachakra Mandala** (by Tenzin Norbu)
   - Explain the Kalachakra (Wheel of Time) concept — one of the most complex mandalas in Tibetan Buddhism
   - Describe the 722 deities depicted, the 5 levels of the palace, the outer/inner/secret layers
   - Detail the materials: 24K gold leaf on cotton canvas, lapis lazuli for the blue vajra ring, vermilion for the fire perimeter
   - Tenzin's story: trained at Sera Monastery, 3 months to complete the deity placement alone
   - Approx 250 words

2. **Green Tara** (by Ani Dolma)
   - Explain Tara as the female bodhisattva of compassion, Green Tara specifically as the active, protective form
   - Describe her posture: right leg extended (ready to act), left hand in refuge gesture, utpala flower by her shoulder
   - Detail the pigments: malachite for the green body, cinnabar for the aureole, gold for her ornaments
   - Ani Dolma's story: one of few female Thangka masters in Kathmandu, learned from her grandmother
   - Approx 250 words

3. **Buddha Shakyamuni** (by Karma Wangdue)
   - Explain the historical Buddha Shakyamuni, the earth-touching mudra (calling the earth to witness his enlightenment)
   - Describe the composition: Buddha in meditation under the Bodhi tree, mara's daughters below, alms bowl
   - Detail the Karma Gadri style: transparent halos, spacious landscape backgrounds, Chinese-influenced clouds
   - Karma Wangdue's lineage: 5th generation Thangka painter in the Karma Gadri tradition
   - Approx 250 words

4. **Vajrasattva** (by Karma Wangdue)
   - Explain Vajrasattva as the embodiment of purification, central to Vajrayana practice
   - Describe the iconography: white body (purity), vajra scepter in right hand, bell in left hand (wisdom + compassion)
   - Detail the 100-syllable mantra and its role in purification practice
   - Connection to Karma Wangdue's style
   - Approx 200 words

5. **Buddha Amitabha** (by Tenzin Norbu)
   - Explain Amitabha as the Buddha of Infinite Light, ruler of Sukhavati (Western Pure Land)
   - Describe the iconography: red body, meditation mudra, peacock throne, the symbolism of the setting sun
   - Detail the Pure Land tradition and its importance in Himalayan Buddhism
   - Approx 200 words

6. **Guru Rinpoche** (by Ani Dolma)
   - Guru Rinpoche (Padmasambhava), the Lotus-Born, who brought Buddhism to Tibet in the 8th century
   - Describe the iconography: khatvanga trident, skull cup, vajra, his distinctive hat with the vulture feather
   - Explain his role as the "Second Buddha" in Tibetan Buddhism
   - Ani Dolma's personal connection to Guru Rinpoche practice
   - Approx 200 words

**Tone:** Scholarly, reverent, accessible to both newcomers and collectors. No academic jargon without explanation. Every description should make the reader feel they're learning something meaningful.

**Verification:** After updating seed data, re-seed the artworks table. Visit each artwork detail page. The description should be rich, informative, and match the "story-driven artwork page" vision from ARCHITECTURE.md.

---

## Phase 7: Code Quality & Architecture Cleanup

**Estimated effort:** 3 tasks, ~40 file edits (mostly import path changes)

### Task 7.1 — Migrate all type imports to `@/types`

**Problem:** `src/types/` exists with proper barrel exports from `index.ts`, re-exporting types from `user.ts`, `artwork.ts`, `artist.ts`, `order.ts`. But **zero files** import from `@/types`. All 40 consumers import directly from `@/lib/db/schema`.

**Files to modify:** All ~40 files that import from `@/lib/db/schema` for type purposes only.

**What to do:**

1. First, understand the pattern:
   - Files that import `{ db }` from `@/lib/db` need to keep that import (runtime values)
   - Files that import types from `@/lib/db/schema` should switch to `@/types` for those types
   - Files that import BOTH runtime values AND types from schema need imports from both places

2. Identify the type imports to migrate:
   - `Profile`, `Artist`, `Artwork`, `Certificate`, `CreationStep`, `Order`, `OrderItem`, `CartItem`, `WishlistItem`, `Article`, `Testimonial` → import from `@/types`
   - `NewProfile`, `NewArtist`, etc. (insert types) → import from `@/types` (re-export them from `@/types` first)
   - Enums: `userRole`, `artworkStatus`, `orderStatus` are runtime values → keep in `@/lib/db/schema`

3. Update `src/types/index.ts` to also re-export insert types:
```typescript
export type { NewProfile, NewArtist, NewArtwork, NewOrder, NewOrderItem, NewCartItem, NewWishlistItem } from "@/lib/db/schema";
```

4. Then migrate file by file. The pattern in each file:
   - BEFORE: `import { artworks, type Artwork } from "@/lib/db/schema"`
   - AFTER: `import { artworks } from "@/lib/db/schema"` + `import type { Artwork } from "@/types"`

5. Priority files (most impactful):
   - All page.tsx files under `src/app/` that import types
   - All server actions under `src/lib/` that import types
   - All components under `src/components/` that import types

**Verification:** `tsc --noEmit` passes with zero errors. No runtime behavior changes.

---

### Task 7.2 — Resolve dual DB directory confusion

**Problem:** Two database directories exist:
- `src/db/` — contains manual SQL migrations (`add_orders.sql`, `add_reviews.sql`) and seed files (`fake_reviews.sql`)
- `src/lib/db/` — contains the actual Drizzle schema and client
- `supabase/migrations/` — contains Drizzle-generated migrations

**Files to delete:**
- `src/db/migrations/add_orders.sql` (table already exists in schema.ts)
- `src/db/migrations/add_reviews.sql` (reviews table is in schema.ts)
- `src/db/seeds/fake_reviews.sql` (reviews are now in main schema)

**Files to keep:**
- `src/lib/db/schema.ts` — authoritative schema
- `src/lib/db/index.ts` — Drizzle client
- `supabase/migrations/` — Drizzle output

**What to do:**
1. Verify the migrations in `src/db/` are already represented in `src/lib/db/schema.ts`:
   - `add_orders.sql` → `orders` and `order_items` tables already in schema.ts ✓
   - `add_reviews.sql` → `reviews` table already in schema.ts ✓
2. Delete `src/db/` directory entirely
3. If `drizzle.config.ts` references `src/db/` anywhere, update it (it doesn't — it points to `src/lib/db/schema.ts`)

**Verification:** `tsc --noEmit` passes. `pnpm build` passes. No imports reference the deleted directory.

---

### Task 7.3 — Audit and convert remaining `<img>` to `next/image`

**Problem:** 11 files already use `next/image`, but some components may still use native `<img>` tags. `next/image` provides automatic lazy loading, WebP conversion, size optimization, and prevents layout shift.

**What to do:**
1. Search for all `<img ` tags in `src/` (case-insensitive)
2. For each occurrence:
   - Determine if the image source is static (in `public/`) or remote (Supabase, Unsplash, etc.)
   - For static imports: use `import` syntax, no width/height needed
   - For remote images: add the hostname to `next.config.ts` `images.remotePatterns` if not already there, add `width`/`height` props (or `fill` with a sized container)
   - Add `loading="lazy"` unless it's the LCP image (add `priority` for LCP)
   - Add `sizes` attribute for responsive images in grids
3. Replace each `<img>` with `<Image>` from `next/image`

**Verification:** `pnpm build` passes. Images render correctly on all pages.

---

## Phase 8: Testing & Dev Infrastructure

**Estimated effort:** 2 tasks, ~3 new files

### Task 8.1 — Stripe webhook local testing instructions

**Files to modify:**
- `src/app/api/payments/stripe/webhook/route.ts` (add instruction comment)

**What to do:**
1. Verify the webhook handler is correct (Stripe signature verification, event handling, error responses)
2. Fix any issues found
3. Add setup instructions as a comment block at the top of the file

**Verification:** Code review pass on the webhook handler logic.

---

### Task 8.2 — Add basic integration test for auth flow

**Problem:** Zero test files in the project. At minimum, the auth flow (register → login → protected page) should have a smoke test.

**Files to create:**
- `src/__tests__/auth.test.ts` (or similar, using Playwright or a simpler approach)

**What to do:**
1. Skip this if testing infrastructure setup is too heavy. Instead, create a manual smoke-test checklist:
2. Create `docs/testing-checklist.md`:
   - Register a new user → redirected to `/verify`
   - Login → redirected to `/dashboard`
   - Browse marketplace → see 6 artworks
   - Filter by deity → results update
   - Search → results appear
   - Add to cart → cart drawer shows item
   - Checkout → payment redirect works (Khalti test mode)
   - Wishlist toggle → heart fills without navigation
   - Admin: upgrade user to artist → user can access artist dashboard
   - Artist: upload artwork → appears in marketplace
   - Sign out → back to home, protected routes redirect to login

**Verification:** Walk through the checklist manually.

---

## Execution Order & Dependencies

```
Phase 1 (Security & Auth) ── no dependencies, do first
    │
Phase 2 (Checkout) ── no dependencies on Phase 1
    │
Phase 3 (Password Reset) ── no dependencies
    │
Phase 4 (Email) ── depends on Phase 2 (needs confirmOrder to be stable)
    │
Phase 5 (Wishlist Fix) ── no dependencies, quick standalone fix
    │
Phase 6 (Artwork Descriptions) ── no dependencies, content-only
    │
Phase 7 (Code Quality) ── depends on Phase 1 (deletes proxy.ts, rate-limit.ts)
    │
Phase 8 (Testing) ── depends on all prior phases
```

Recommended execution: **1 → 2 → 5 → 3 → 4 → 6 → 7 → 8**

Phase 5 (wishlist) and Phase 6 (descriptions) can run in parallel if multiple agents are working.

---

## Success Criteria

After all 8 phases:

1. `tsc --noEmit` — zero errors
2. `pnpm build` — zero errors, zero warnings
3. All roles correctly restricted (clients cannot access admin, artists cannot access admin)
4. Checkout validates input before processing
5. Wishlist heart toggles without navigation
6. All 6 artworks have rich, unique descriptions
7. Password reset flow works end-to-end
8. Emails fire on order confirmation, commission submission
9. All type imports use `@/types` barrel
10. `src/db/` and dead files deleted
11. `<html>` tag no longer has hardcoded `dark` class
12. Stripe uses env var exchange rate, eSewa uses env var payment URL
13. Manual smoke-test checklist document exists

---

## File Summary: What Gets Created, Modified, Deleted

| Action | File |
|---|---|
| CREATE | `src/lib/validators/checkout.ts` |
| CREATE | `src/lib/auth/reset-password.ts` |
| CREATE | `src/app/(auth)/forgot-password/page.tsx` |
| CREATE | `src/app/(auth)/reset-password/page.tsx` |
| CREATE | `src/lib/email.ts` |
| CREATE | `docs/testing-checklist.md` |
| MODIFY | `src/app/dashboard/layout.tsx` |
| MODIFY | `src/components/layout/user-menu.tsx` |
| MODIFY | `src/app/layout.tsx` |
| MODIFY | `src/app/checkout/page.tsx` |
| MODIFY | `src/lib/order-actions.ts` |
| MODIFY | `src/app/(auth)/login/page.tsx` |
| MODIFY | `src/components/cart/add-to-wishlist-button.tsx` |
| MODIFY | `src/lib/commission-actions.ts` |
| MODIFY | `src/types/index.ts` |
| MODIFY | `supabase/seed_artworks.sql` |
| MODIFY | `.env.example` |
| MODIFY | `~40 files` (import path migration in Phase 7.1) |
| DELETE | `src/proxy.ts` |
| DELETE | `src/lib/rate-limit.ts` |
| DELETE | `src/db/` (entire directory tree) |

---

## Agent Prompt Templates

When executing each phase, begin with:

> "I'm executing Phase X of the June 17 plan. I've read the pre-flight docs. I understand the conventions: server components default, no comments, design tokens only, use `cn()` for classes, all mutations via server actions."

Report after each task:
- What file was changed
- What the change was (one line)
- Whether `tsc --noEmit` still passes
